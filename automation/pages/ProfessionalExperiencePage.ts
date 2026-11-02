import { BasePage } from './BasePage';
import { ExperienceData } from '../utils/dataGenerator';

export class ProfessionalExperiencePage extends BasePage {
  // Years of Experience: a dropdown. If it's a custom one, the text below is the closed box's label.
  get experienceTrigger() {
    return this.page.getByText(/select.*experience/i).first();
  }

  get studentsPerYear() {
    return this.page.getByLabel(/number of students/i);
  }

  get focusArea() {
    return this.page.getByLabel(/focus area/i);
  }

  get successMetrics() {
    return this.page.getByLabel(/success metrics/i);
  }

  // Services Provided: 4 options. Picks the first one.
  get firstService() {
    return this.page.getByRole('checkbox').first();
  }

  async selectExperienceLevel(): Promise<void> {
    await this.experienceTrigger.click();
    await this.page.getByRole('option').first().click();
  }

  async fill(data: ExperienceData): Promise<void> {
    await this.selectExperienceLevel();
    await this.studentsPerYear.fill(data.studentsPerYear);
    await this.focusArea.fill(data.focusArea);
    await this.successMetrics.fill(data.successMetrics);
    await this.firstService.check();
  }

  async submit(): Promise<void> {
    await this.nextButton.click();
  }

  async fillAndSubmit(data: ExperienceData): Promise<void> {
    await this.fill(data);
    await this.submit();
  }
}