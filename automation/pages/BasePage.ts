import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected get nextButton(): Locator {
    return this.page.getByRole('button', { name: /next/i });
  }

  protected get backButton(): Locator {
    return this.page.getByRole('button', { name: /back/i });
  }

  // Finds a message on screen. The same text can appear twice (password and confirm password), so take the first.
  message(text: string | RegExp): Locator {
    return this.page.getByText(text).first();
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
  }

    // Opens a dropdown and picks its first option. Works for most custom dropdowns.
  protected async pickFirstOption(trigger: Locator): Promise<void> {
    await trigger.click();
    await this.page.getByRole('option').first().click();
    await this.page.keyboard.press('Escape'); // closes multi-select lists, harmless otherwise
  }
}