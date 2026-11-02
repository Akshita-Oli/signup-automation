import { test, expect } from '../fixtures/fixtures';

test('TC_REG_02: accepting terms opens the account setup step', async ({ page, agreementPage }) => {
  await agreementPage.open();
  await agreementPage.acceptTermsAndContinue();
  await expect(page).toHaveURL(/step=setup/);
});

test('TC_ACC_02: empty account form shows required-field messages', async ({ page, agreementPage, accountPage }) => {
  await agreementPage.open();
  await agreementPage.acceptTermsAndContinue();
  await expect(page).toHaveURL(/step=setup/);

  await accountPage.submit();

  await expect(accountPage.message('First name must be at least 2 characters')).toBeVisible();
  await expect(accountPage.message('Last name must be at least 2 characters')).toBeVisible();
  await expect(accountPage.message('Invalid email address')).toBeVisible();
  await expect(accountPage.message('Password must be at least 8 characters')).toBeVisible();
});