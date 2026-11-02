import { test as base, expect } from '@playwright/test';
import { Mailbox } from '../utils/mailbox';
import { RegisterAgreementPage } from '../pages/RegisterAgreementPage';
import { AccountSetupPage } from '../pages/AccountSetupPage';
import { EmailVerificationPage } from '../pages/EmailVerificationPage';
import { AgencyDetailsPage } from '../pages/AgencyDetailsPage';
import { ProfessionalExperiencePage } from '../pages/ProfessionalExperiencePage';
import { VerificationPreferencesPage } from '../pages/VerificationPreferencesPage';
import { ProfilePage } from '../pages/ProfilePage';

type Fixtures = {
  mailbox: Mailbox;
  agreementPage: RegisterAgreementPage;
  accountPage: AccountSetupPage;
  codePage: EmailVerificationPage;
  agencyPage: AgencyDetailsPage;
  experiencePage: ProfessionalExperiencePage;
  preferencesPage: VerificationPreferencesPage;
  profilePage: ProfilePage;
};

export const test = base.extend<Fixtures>({
  // Only created by tests that ask for it, so the negative tests never contact the mail service
  mailbox: async ({ request }, use) => {
    await use(await Mailbox.create(request));
  },
  agreementPage: async ({ page }, use) => {
    await use(new RegisterAgreementPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountSetupPage(page));
  },
  codePage: async ({ page }, use) => {
    await use(new EmailVerificationPage(page));
  },
  agencyPage: async ({ page }, use) => {
    await use(new AgencyDetailsPage(page));
  },
  experiencePage: async ({ page }, use) => {
    await use(new ProfessionalExperiencePage(page));
  },
  preferencesPage: async ({ page }, use) => {
    await use(new VerificationPreferencesPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
});

export { expect };