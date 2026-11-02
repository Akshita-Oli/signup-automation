import { BasePage } from './BasePage';

export class EmailVerificationPage extends BasePage {
  get codeInput() {
    return this.page.getByRole('textbox').first();
  }

  get verifyButton() {
    return this.page.getByRole('button', { name: /verify/i });
  }

  async verify(code: string): Promise<void> {
    await this.codeInput.click();
    await this.codeInput.pressSequentially(code); // works for one box or separate digit boxes
    await this.verifyButton.click();
  }
}