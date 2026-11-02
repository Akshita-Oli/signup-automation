import { test, expect } from '../fixtures/fixtures';
import { buildAccountData } from '../utils/dataGenerator';

// Never sent to the server: each test below is blocked by the form's own validation.
const validAccount = buildAccountData('negative.test@example.com');

test.describe('Account setup: negative and validation cases', () => {
  test.beforeEach(async ({ page, agreementPage }) => {
    await agreementPage.open();
    await agreementPage.acceptTermsAndContinue();
    await expect(page).toHaveURL(/step=setup/);
  });

  test('TC_ACC_09: wrongly formatted email is rejected', async ({ page, accountPage }) => {
    await accountPage.fillAndSubmit({ ...validAccount, email: 'abc@example' });

    await expect(accountPage.message('Invalid email address')).toBeVisible();
    await expect(page).toHaveURL(/step=setup/);
  });

  test('TC_ACC_11: password shorter than 8 characters is rejected', async ({ page, accountPage }) => {
    await accountPage.fillAndSubmit({ ...validAccount, password: 'Te@1abc' }); // 7 characters

    await expect(accountPage.message('Password must be at least 8 characters')).toBeVisible();
    await expect(page).toHaveURL(/step=setup/);
  });

  test('TC_ACC_13: password without a number is rejected', async ({ page, accountPage }) => {
    await accountPage.fillAndSubmit({ ...validAccount, password: 'abcdefgh' });

    await expect(accountPage.message('Password must contain at least one number')).toBeVisible();
    await expect(page).toHaveURL(/step=setup/);
  });
});