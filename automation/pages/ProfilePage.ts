import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  get pendingStatus() {
    return this.page.getByText(/pending/i).first();
  }
}