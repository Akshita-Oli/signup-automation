import { APIRequestContext, expect } from '@playwright/test';
import { randomBytes } from 'crypto';
import { env } from '../config/env';

const API = env.mailApi;

export class Mailbox {
  private constructor(
    private readonly request: APIRequestContext,
    readonly address: string,
    private readonly token: string,
  ) {}

  // Creates a brand new throwaway inbox for this run
  static async create(request: APIRequestContext): Promise<Mailbox> {
    const domainsResponse = await request.get(`${API}/domains`);
    expect(domainsResponse.ok(), `mail.tm domains request (status ${domainsResponse.status()})`).toBeTruthy();
    const domain = (await domainsResponse.json())['hydra:member'][0].domain as string;

    const address = `qa.${Date.now().toString(36)}${randomBytes(2).toString('hex')}@${domain}`;
    const password = randomBytes(12).toString('hex'); // throwaway, generated per run

    const created = await request.post(`${API}/accounts`, { data: { address, password } });
    const createdBody = await created.text();
    expect(created.ok(), `mail service account creation (status ${created.status()}): ${createdBody}`).toBeTruthy();
    const storedAddress = (JSON.parse(createdBody).address as string) ?? address;

        // The new inbox can take a moment to become usable, so the login is retried until it works
    let token = '';
    await expect(async () => {
      const response = await request.post(`${API}/token`, { data: { address: storedAddress, password } });
      const body = await response.text();
      expect(response.ok(), `mail.tm login failed, status ${response.status()}: ${body}`).toBeTruthy();
      token = JSON.parse(body).token as string;
    }).toPass({
      timeout: 30_000,
      intervals: [1_000, 2_000, 3_000],
    });

        return new Mailbox(request, storedAddress, token);
  }

    // Checks the inbox repeatedly (polling) until an email with a code arrives
  async waitForCode(): Promise<string> {
    const headers = { Authorization: `Bearer ${this.token}` };
    let code = '';

    await expect
      .poll(
        async () => {
          const list = await this.request.get(`${API}/messages`, { headers });
          const messages = (await list.json())['hydra:member'] as { id: string }[];
          if (messages.length === 0) return '';

          const detail = await this.request.get(`${API}/messages/${messages[0].id}`, { headers });
          const body = (await detail.json()) as { text?: string };
          code = body.text?.match(env.otpRegex)?.[0] ?? '';
          return code;
        },
        {
          message: 'verification email containing a code',
          timeout: env.otpTimeoutMs,
          intervals: [2_000, 3_000, 5_000],
        },
      )
      .not.toBe('');

    return code;
  }
}