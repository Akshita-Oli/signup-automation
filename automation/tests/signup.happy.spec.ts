import { test, expect } from '../fixtures/fixtures';
import {
  buildAccountData,
  buildAgencyData,
  buildExperienceData,
  buildVerificationData,
} from '../utils/dataGenerator';

test('TC_E2E_01: full signup flow', async ({
  page,
  mailbox,
  agreementPage,
  accountPage,
  codePage,
  agencyPage,
  experiencePage,
  preferencesPage,
  profilePage,
}) => {
  const account = buildAccountData(mailbox.address);
  const agency = buildAgencyData(mailbox.address);
  const experience = buildExperienceData();
  const verification = buildVerificationData();

  await agreementPage.open();
  await agreementPage.acceptTermsAndContinue();
  await expect(page).toHaveURL(/step=setup/);

  await accountPage.fillAndSubmit(account);
  await codePage.verify(await mailbox.waitForCode());
  await expect(page).toHaveURL(/step=details/);

  await agencyPage.fillAndSubmit(agency);
  await expect(page).toHaveURL(/step=professional-experience/);

  await experiencePage.fillAndSubmit(experience);
  await expect(page).toHaveURL(/step=verification/);

  await preferencesPage.fillAndSubmit(verification);
  await expect(page).toHaveURL(/admin\/profile/);
  await expect(profilePage.pendingStatus).toBeVisible();
});