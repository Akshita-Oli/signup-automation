import { BasePage } from './BasePage';
import { VerificationData, sampleDocument } from '../utils/dataGenerator';

export class VerificationPreferencesPage extends BasePage {
  get registrationNumber() {
    return this.page.getByLabel(/business registration number/i);
  }

  get countriesTrigger() {
    return this.page.getByText(/select.*countr/i).first();
  }

  // Institution types are a group of checkboxes (or radio buttons): take the first choice
  get firstInstitutionType() {
    return this.page
      .locator('input[type="checkbox"], input[type="radio"], [role="checkbox"], [role="radio"]')
      .first();
  }

  get fileInput() {
    return this.page.locator('input[type="file"]').first();
  }

  get submitButton() {
    return this.page.getByRole('button', { name: /submit/i });
  }

  async selectCountry(country: string): Promise<void> {
    await this.countriesTrigger.click();
    await this.page.getByPlaceholder('Search...').fill(country);
    await this.page.getByText(country, { exact: true }).click();
    await this.page.keyboard.press('Escape');
  }

  async selectFirstInstitutionType(): Promise<void> {
    await this.firstInstitutionType.click();
  }

  async fill(data: VerificationData): Promise<void> {
    await this.registrationNumber.fill(data.registrationNumber);
    await this.selectCountry(data.country);
    await this.selectFirstInstitutionType();
    await this.fileInput.setInputFiles(sampleDocument);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async fillAndSubmit(data: VerificationData): Promise<void> {
    await this.fill(data);
    await this.submit();
  }
}