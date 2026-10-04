# 🏦 ISBNetBanking – Playwright Automation Framework

A scalable end-to-end test automation framework for the **ISBNetBanking** application, built using **Playwright with JavaScript**.

The framework is designed with maintainability, reusability, parallel execution, reporting, authentication optimization, and CI/CD execution in mind.

---

## 🚀 Project Highlights

- Playwright-based end-to-end automation
- JavaScript automation framework
- Page Object Model (POM)
- Reusable Playwright fixtures
- Centralized test data
- Authentication using Playwright storage state
- Chromium browser automation
- Parallel test execution
- Automatic retries
- Smoke, regression and negative test suites
- HTML reporting
- Allure reporting
- Trace collection on retry
- AI-generated test scenarios
- GitHub Actions CI/CD integration
- Scheduled test execution

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Playwright | End-to-End Test Automation |
| JavaScript | Programming Language |
| Node.js | Runtime Environment |
| Git | Version Control |
| GitHub | Source Code Management |
| GitHub Actions | CI/CD |
| Allure | Test Reporting |
| HTML Report | Playwright Test Reporting |
| Playwright MCP | AI-assisted browser automation |

---

## 📂 Project Structure

```text
ISBNETBanking/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── .playwright-mcp/
│
├── ai/
│   └── ai-generated-test-scenarios/
│
├── fixtures/
│   └── Reusable Playwright fixtures
│
├── pages/
│   └── Page Object Model classes
│
├── specs/
│   └── Test specifications and scenarios
│
├── test-data/
│   └── Test data
│
├── tests/
│   └── Playwright test scripts
│
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.js
└── README.md
```

---

## 🏗️ Framework Architecture

The framework follows the **Page Object Model** pattern to separate test logic from application-specific locators and actions.

```text
                    Test Scenarios
                          │
                          ▼
                    Test Scripts
                          │
                          ▼
                       Fixtures
                          │
                          ▼
                     Page Objects
                          │
                          ▼
                       Playwright
                          │
                          ▼
                   ISBNetBanking App
```

### Page Objects

The `pages` directory contains reusable page classes.

Page-specific:

- Locators
- Actions
- Navigation
- Reusable business operations

are maintained in the respective Page Object classes.

This helps reduce duplication and makes UI changes easier to maintain.

---

## 🧩 Fixtures

Reusable test setup and custom Playwright fixtures are maintained under:

```text
fixtures/
```

Fixtures are used to provide common test dependencies and avoid repeating setup logic across individual test cases.

---

## 🔐 Authentication

The framework uses **Playwright storage state** to optimize authentication.

Authentication state is maintained separately from the test scripts, allowing authenticated test cases to avoid performing the login flow unnecessarily.

The Playwright configuration uses:

```text
auth/user.json
```

for the Chromium project.

Authentication files are excluded from source control through `.gitignore`.

---

## 🧪 Test Suites

The framework supports different test suite categories using Playwright tags.

### Smoke Tests

```bash
npm run smoke
```

Runs tests tagged with:

```text
@smoke
```

### Regression Tests

```bash
npm run regression
```

Runs tests tagged with:

```text
@regression
```

### Negative Tests

```bash
npm run negative
```

Runs tests tagged with:

```text
@negative
```

### Complete Test Suite

```bash
npm test
```

Runs the complete Playwright test suite.

---

## ▶️ Getting Started

### Prerequisites

Install the following:

- Node.js
- npm
- Git
- VS Code (recommended)

---

### Clone the Repository

```bash
git clone https://github.com/goutham3991/ISBNETBanking.git
```

Navigate to the project:

```bash
cd ISBNETBanking
```

---

### Install Dependencies

```bash
npm ci
```

---

### Install Playwright Browsers

```bash
npx playwright install
```

For Linux/CI environments:

```bash
npx playwright install --with-deps
```

---

## ▶️ Execute Tests

### Run all tests

```bash
npm test
```

### Run smoke tests

```bash
npm run smoke
```

### Run regression tests

```bash
npm run regression
```

### Run negative tests

```bash
npm run negative
```

### Run tests in headed mode

```bash
npx playwright test --headed
```

### Run a specific test file

```bash
npx playwright test <test-file-path>
```

---

# 📊 Test Reporting

## Playwright HTML Report

After test execution:

```bash
npx playwright show-report
```

The HTML report is generated under:

```text
playwright-report/
```

---

## Allure Report

Generate the Allure report:

```bash
npm run allure:generate
```

Open the report:

```bash
npm run allure:open
```

Or generate and open it together:

```bash
npm run report
```

Allure results are generated under:

```text
allure-results/
```

---

# ⚙️ Playwright Configuration

The framework is configured with:

- Test directory: `tests`
- Chromium browser
- Headless execution
- Fully parallel execution
- Automatic retries
- CI-specific worker configuration
- HTML reporting
- Allure reporting
- Trace collection on first retry
- Storage state authentication

The current configuration uses:

```text
https://www.testerrank.com
```

as the application base URL.

---

# 🔄 CI/CD – GitHub Actions

The project uses **GitHub Actions** to execute the Playwright automation suite.

Workflow:

```text
.github/
└── workflows/
    └── playwright.yml
```

The pipeline is designed to support:

- Push-based execution
- Pull Request validation
- Scheduled execution
- Manual execution
- Playwright browser installation
- Automated test execution
- Test report collection
- Test artifact retention

---

## ⏰ Scheduled Execution

The automation suite is configured to execute automatically **every 6 hours**.

GitHub Actions uses UTC for scheduled workflows.

```yaml
schedule:
  - cron: '0 */6 * * *'
```

This results in four scheduled executions per day:

```text
00:00 UTC
06:00 UTC
12:00 UTC
18:00 UTC
```

Approximately in IST:

```text
05:30 AM
11:30 AM
05:30 PM
11:30 PM
```

The workflow can also be manually triggered from:

```text
GitHub → Actions → Playwright Automation → Run workflow
```

---

# 🤖 AI-Assisted Test Automation

The repository includes an AI-assisted test automation area:

```text
ai/
└── ai-generated-test-scenarios/
```

The project also contains Playwright MCP configuration:

```text
.playwright-mcp/
```

The AI-assisted approach is intended to support activities such as:

```text
Application Exploration
        ↓
Test Scenario Identification
        ↓
AI-Generated Test Scenarios
        ↓
Review & Validation
        ↓
Playwright Test Generation
        ↓
POM / Fixture Integration
        ↓
Test Execution
```

AI-generated scenarios are reviewed before being converted into executable automation.

---

# 🧱 Framework Design Principles

The framework follows these principles:

### Reusability

Common actions and application interactions are implemented in Page Objects and fixtures.

### Maintainability

Locators and page-specific actions are separated from test logic.

### Scalability

The framework structure allows additional modules and test suites to be added without significantly changing the existing architecture.

### Parallel Execution

Tests are configured for parallel execution to reduce overall execution time.

### Reliability

Playwright retries and trace collection are configured to assist with diagnosing intermittent failures.

### Secure Test Data Management

Credentials and authentication state should not be committed to source control.

Sensitive configuration should be maintained using environment variables or GitHub Actions Secrets.

---

# 📋 NPM Commands

| Command | Description |
|---|---|
| `npm test` | Execute complete test suite |
| `npm run smoke` | Execute smoke tests |
| `npm run regression` | Execute regression tests |
| `npm run negative` | Execute negative tests |
| `npm run test:fresh` | Clean Allure results and execute tests |
| `npm run allure:generate` | Generate Allure report |
| `npm run allure:open` | Open Allure report |
| `npm run report` | Generate and open Allure report |
| `npx playwright show-report` | Open Playwright HTML report |

---

# 📈 Future Enhancements

Planned improvements include:

- Multi-environment configuration
- API automation integration
- Enhanced CI/CD pipeline
- Smoke and regression pipeline separation
- Parallel execution optimization
- Test sharding
- Improved Allure reporting
- Automated failure notifications
- AI-powered test generation
- AI-assisted failure analysis
- API/UI hybrid test automation
- Quality and execution dashboards

---

# 👨‍💻 Author

**Goutham Kumar**

QA Lead | Senior QA Automation Engineer

11+ Years of Quality Engineering Experience

### Core Automation Skills

- Playwright
- JavaScript
- TypeScript
- Cypress
- Selenium
- API Testing
- BDD
- CI/CD
- GitHub Actions
- AI-assisted Test Automation

---

## 🔗 Repository

[ISBNETBanking – GitHub](https://github.com/goutham3991/ISBNETBanking)
---

## ⚙️ Configuration

Copy `.env.example` to `.env` and fill in the values (never commit `.env`). In GitHub Actions, set
`VALID_USER_EMAIL`, `VALID_USER_PASSWORD` and `VALID_USER_NAME` as repository secrets and, optionally, `BASE_URL` as a repository variable.

```bash
npm run lint      # ESLint with eslint-plugin-playwright
npm run smoke     # @smoke tests
```
