import { BasePage } from './BasePage';
import { AccountData } from '../utils/dataGenerator';

export class AccountSetupPage extends BasePage {
  get firstName() {
    return this.page.getByLabel(/first name/i);
  }

  get lastName() {
    return this.page.getByLabel(/last name/i);
  }

  get email() {
    return this.page.getByLabel(/email/i);
  }

  get phone() {
    return this.page.getByLabel(/phone/i);
  }

    get password() {
    return this.page.locator('input[type="password"]').first();
  }

  get confirmPassword() {
    return this.page.locator('input[type="password"]').last();
  }

  async fill(data: AccountData): Promise<void> {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.email.fill(data.email);
    await this.phone.fill(data.phone);
    await this.password.fill(data.password);
    await this.confirmPassword.fill(data.password);
  }

  async submit(): Promise<void> {
    await this.nextButton.click();
  }

  async fillAndSubmit(data: AccountData): Promise<void> {
    await this.fill(data);
    await this.submit();
  }
}