# Playwright Automation Framework

Playwright automation framework built using TypeScript and Page Object Model (POM) principles. This project focuses on reusable automation design, test stability, debugging workflows, and scalable test structure for modern UI automation testing.

---

## Tech Stack

- Playwright (`@playwright/test`)
- TypeScript
- Node.js
- Page Object Model (POM)
- Data-Driven Testing
- Git & GitHub
- VS Code

---

## Framework Features

- Reusable Page Object Model structure
- Data-driven testing using reusable datasets
- Reusable waits and assertion utilities
- Retry and timeout handling for flaky test prevention
- Smart wait strategies and synchronization handling
- Trace Viewer and debugging workflow support
- Structured Playwright notes and interview preparation documentation

---

## Automated Scenarios

- Basic smoke validation flows
- Navigation and content verification
- Login navigation and validation workflows
- Invalid login validation using data-driven testing
- Multi-browser Playwright execution support

---

## Project Structure

```text
pw-framework/
│
├── pages/                # Page Object classes
├── tests/                # Test specifications
├── fixtures/             # Reusable Playwright fixtures
├── utils/                # Waits, assertions and helper utilities
├── test-data/            # Reusable datasets
├── Playwright-Notes/     # Learning notes and interview preparation
├── playwright.config.ts  # Playwright configuration
└── README.md
```

---

## Stability and Debugging

This framework includes:
- Retry handling
- Custom timeout configuration
- Smart synchronization strategies
- Trace Viewer support
- VS Code debugging workflows
- Breakpoint-based execution analysis

---

## How to Run Tests

### Install dependencies

```bash
npm install
```

### Run all tests

```bash
npx playwright test
```

### Run a specific test file

```bash
npx playwright test tests/day4-login.spec.ts
```

### Run tests in headed mode

```bash
npx playwright test tests/day4-login.spec.ts --project=chromium --headed
```

### Open Playwright HTML Report

```bash
npx playwright show-report
```

---

## Learning Focus Areas

This repository is being actively expanded with focus on:
- Modern Playwright automation practices
- API testing with Playwright
- CI/CD integration
- Framework scalability
- Debugging and flaky test prevention
- SDET interview preparation

---

## Author

Bharath S  
QA Automation Engineer / SDET  

LinkedIn:  
https://www.linkedin.com/in/bharath-s-76936724b/

GitHub:  
https://github.com/sbharath1997-hub/playwright-framework