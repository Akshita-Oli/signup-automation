import { BasePage } from './BasePage';

export class RegisterAgreementPage extends BasePage {
  get termsCheckbox() {
    return this.page.getByRole('checkbox');
  }

  get continueButton() {
    return this.page.getByRole('button', { name: /continue/i });
  }

  async open(): Promise<void> {
    await this.page.goto('/register');
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async acceptTermsAndContinue(): Promise<void> {
    await this.termsCheckbox.check();
    await this.continueButton.click();
  }
}