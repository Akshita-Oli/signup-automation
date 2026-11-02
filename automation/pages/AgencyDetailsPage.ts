import { BasePage } from './BasePage';
import { AgencyData } from '../utils/dataGenerator';

export class AgencyDetailsPage extends BasePage {
  get name() {
    return this.page.getByLabel('Name', { exact: true });
  }

  get role() {
    return this.page.getByLabel(/role in agency/i);
  }

  get email() {
    return this.page.getByLabel(/email/i);
  }

  get website() {
    return this.page.getByLabel(/website/i);
  }

  get address() {
    return this.page.getByLabel('Address', { exact: true });
  }

  // The dropdown box that shows "Select Your Region of Operation"
  get regionTrigger() {
    return this.page.getByText(/select your region of operation/i).first();
  }

  get regionSearch() {
    return this.page.getByPlaceholder('Search...');
  }

  regionOption(regionName: string) {
    return this.page.getByText(regionName, { exact: true });
  }

  // Searchable dropdown: open it, type in the search box, click the matching option
  async selectRegion(regionName: string): Promise<void> {
    await this.regionTrigger.click();
    await this.regionSearch.fill(regionName);
    await this.regionOption(regionName).click();
    await this.page.keyboard.press('Escape'); // closes the list if it stays open (multi-select)
  }

  async fill(data: AgencyData): Promise<void> {
    await this.name.fill(data.name);
    await this.role.fill(data.role);
    await this.email.fill(data.email);
    await this.website.fill(data.website);
    await this.address.fill(data.address);
    await this.selectRegion(data.region);
  }

  async submit(): Promise<void> {
    await this.nextButton.click();
  }

  async fillAndSubmit(data: AgencyData): Promise<void> {
    await this.fill(data);
    await this.submit();
  }
}