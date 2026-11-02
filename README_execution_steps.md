# Signup Flow: Manual + Automation Testing

Assignment for the QA Officer position at Vrit Technologies.
Application under test: https://authorized-partner.vercel.app/ (agent signup flow starting at `/register`)
Tester: Akshita Oli

---

## 1. Prerequisites and versions

| Item | Version |
|---|---|
| Language | TypeScript |
| Test framework | Playwright Test (`@playwright/test` ^1.64.1) |
| Node.js | v24.18.0 |
| npm | 11.16.0 |
| Browser | Chromium (installed by Playwright) |
| Other packages | `dotenv` ^18.0.9, `typescript` ^7.0.2, `@types/node` ^26.6.6 |
| Operating system used | [Windows 11, tested in Git Bash] |
| Internet access | Required (the site and the temporary mailbox service) |

---

## 2. Setup and install

```bash
git clone https://github.com/Akshita-Oli/signup-automation.git
cd signup-automation
npm install
npx playwright install chromium
cp .env.example .env
```

`.env.example` contains no secrets. It holds only the site URL, the mail service URL and timing settings:

```
BASE_URL=https://authorized-partner.vercel.app
MAIL_API=https://api.mail.tm
OTP_REGEX=\b\d{6}\b
OTP_TIMEOUT_MS=90000
SLOW_MO=0
```

---

## 3. How to run the tests and open the report

Run the whole suite (headless):

```bash
npx playwright test
```

Run with the browser visible:

```bash
npm run test:headed
```

Run only the full end-to-end test:

```bash
npx playwright test signup.happy --headed
```

Open the HTML report:

```bash
npm run report
```

The generated report is saved in `reports/playwright-report/` (open `index.html` in a browser).

Please note: the full end-to-end test creates **one real account** on the site every time it runs, so please do not run it repeatedly. Tests run one at a time (`workers: 1`) to be considerate of the site.

---

## 4. Project structure and how Page Object Model (POM) is applied

```
signup-automation/
├── README_execution_steps.md
├── playwright.config.ts          Playwright settings (base URL, report folder, timeouts)
├── package.json, tsconfig.json
├── .env.example                  Config template (no secrets)
├── manual-testing/               Test cases, execution report, bug reports, summary
├── automation/
│   ├── config/env.ts             Reads settings from environment variables
│   ├── fixtures/fixtures.ts      Creates page objects and the mailbox for each test
│   ├── pages/                    One page class per signup page or step
│   │   ├── BasePage.ts                    Shared code (Next/Back buttons, messages)
│   │   ├── RegisterAgreementPage.ts       Terms and conditions page
│   │   ├── AccountSetupPage.ts            Step 1: account details
│   │   ├── EmailVerificationPage.ts       Email code page
│   │   ├── AgencyDetailsPage.ts           Step 2: agency details
│   │   ├── ProfessionalExperiencePage.ts  Step 3: professional experience
│   │   ├── VerificationPreferencesPage.ts Step 4: verification and preferences
│   │   └── ProfilePage.ts                 Final profile page (Pending status)
│   ├── tests/                    Test files (assertions only)
│   │   ├── signup.account.spec.ts
│   │   ├── signup.negative.spec.ts
│   │   └── signup.happy.spec.ts
│   └── utils/
│       ├── dataGenerator.ts      Unique test data for each run
│       └── mailbox.ts            Temporary mailbox and email code reader
├── reports/playwright-report/    Playwright HTML report
└── demo_video.mp4
```

How POM is applied:

- **One page class per page or step.** Each class holds that page's locators and actions (for example `fillAndSubmit`).
- **No locators in test files.** Tests only call page methods and contain the assertions (`expect`).
- **Shared setup is separate.** `BasePage` holds the shared code, `fixtures.ts` creates the page objects, `config/env.ts` holds settings, and `utils/` holds the data generator and mailbox helper.
- **No hard-coded waits.** The tests use Playwright's auto-waiting and web-first assertions. The email code is read by polling the inbox (`expect.poll`) and the mailbox login is retried with `toPass`. Both are built-in Playwright retry mechanisms, not fixed delays. Verified with `grep -rn "waitForTimeout\|sleep" automation`, which returns no results.

### Tests included

| Test | Manual case | Type |
|---|---|---|
| Accepting terms opens the account setup step | TC_REG_02 | Positive |
| Empty account form shows required-field messages | TC_ACC_02 | Negative |
| Wrongly formatted email is rejected (`abc@example`) | TC_ACC_09 | Negative |
| Password shorter than 8 characters is rejected | TC_ACC_11 | Negative |
| Password without a number is rejected | TC_ACC_13 | Negative |
| Full signup flow: terms, account, email code, agency, experience, verification, Pending profile | TC_E2E_01 | Positive (happy path) |

Total: 6 tests (1 full happy path and 4 negative/validation tests).

---

## 5. Test data and accounts used

- **No credentials are stored in the code or the repo.** Settings come from environment variables (`.env`, which is git-ignored; `.env.example` is provided).
- **Data is generated fresh on every run** (`utils/dataGenerator.ts`): a unique agency name and registration number (timestamp plus random suffix), a random phone number, and a random password that is never saved.
- **Email address:** each run creates a brand new temporary mailbox through the free mail.tm API, and that address is used for the account email and the agency email. The mailbox is thrown away after the test.
- **Uploaded document:** a small PDF is created in memory by the test, so no file is needed in the repo.
- **Accounts created:** every full run registers one new throwaway agency account on the site. No existing or personal accounts are used.

### How the email verification code (OTP) is handled

The signup sends a code to the account email, and it cannot continue without it. The test does not skip this step:

1. `Mailbox.create()` (`utils/mailbox.ts`) creates a temporary inbox on mail.tm and logs in to it.
2. The test signs up with that inbox address.
3. `Mailbox.waitForCode()` polls the inbox until the email arrives, then reads the 6-digit code from it (the pattern is configurable with `OTP_REGEX`).
4. `EmailVerificationPage.verify()` types the code into the page.

Everything runs automatically with no manual steps.

---

## 6. Assumptions, known limitations, and what is not automated

**Assumptions**
- No requirements document was provided. Expected results are based on the app's own behaviour, its on-screen messages, common web standards and reasonable user expectation.
- The phone number is generated with the prefix `980`, because the app rejected some other number patterns during testing (for example `9867898568`). The exact accepted format is not documented.
- The Region, Countries and Institution Types steps pick a fixed value (Nepal, Australia) or the first available choice.
- The Years of Experience and Services steps pick the first available option.

**Known limitations**
- Each full end-to-end run creates a real account on the live site, and there is no clean-up function.
- The tests depend on the third-party mail.tm service. If it is down or rate limiting, the full flow cannot complete. `MAIL_API` can be changed in `.env` to another compatible service (for example `https://api.mail.gw`).
- Locators use visible text, labels and roles, so a change in the site's wording or layout may need an update in the matching page class only.
- Only Chromium (desktop viewport) is configured.
- TC_ACC_09 uses `abc@example` because the browser itself blocks `abc@` before the app's own message can appear.

**Not automated, and why**
- Duplicate email and duplicate phone checks: they need an existing account and would create or reuse real data on the live site.
- Expired, wrong or resent verification codes: the code expiry time is unknown and cannot be controlled.
- Refresh, direct URL access and Back button navigation, responsive layout, and file size or type checks: covered in manual testing only, to keep the suite small and avoid extra submissions on the live site.
- Admin approval of a Pending account: no admin access.
- Load or performance testing: out of scope, and the site asked testers not to send load or spam submissions.

---

## Manual testing deliverables

All manual testing files are in `manual-testing/`: `test_cases.xlsx` (61 cases), `test_execution_report.xlsx` (59 passed, 2 failed, 0 blocked), `bug_reports.xlsx` and `test_summary.pdf`.

Demo video of the automation running end to end: `demo_video.mp4`
