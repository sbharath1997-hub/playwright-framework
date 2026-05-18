# Day 05 — Data-Driven Login Testing

## What data-driven testing is

Data-driven testing means running the same test flow multiple times with different input datasets.  
Instead of duplicating test code for each case, you keep one reusable test and feed it structured data.

---

## Reusable test data structure

Day 5 introduces `test-data/loginData.ts` with a typed dataset model and multiple login cases:

- invalid email + invalid password
- valid-format placeholder email + incorrect password
- empty credentials

Each dataset includes:

- case name
- email
- password
- expected error message

No real credentials are used.

---

## Scalability benefits

Reusable data helps scale the framework:

- add new scenarios by appending data objects
- keep test flow code unchanged
- separate business cases from UI interaction logic
- support larger suites with clearer coverage mapping

---

## Maintainability advantages

Data-driven tests reduce maintenance cost:

- one test flow to update when UI behavior changes
- less duplicated code, fewer inconsistencies
- easier review because intent is visible in dataset names
- cleaner POM methods reused across many cases

---

## Edge case handling and negative testing

During execution, the empty email/password case behaved differently from wrong credentials:

- wrong credentials submit the form and show an app-level error banner
- empty credentials trigger browser-native `required` validation first
- form submission is blocked, so the app error banner is never rendered

This is an important negative testing concept: not all invalid inputs fail through the same UI channel.

Framework update for reliability:

- keep invalid credential assertions for server/app-level errors
- add a dedicated assertion path for empty required-field validation
- use dataset metadata (`expectedOutcome`) to route to the correct validation strategy

---

## Interview-friendly summary

Data-driven testing improves test design by separating **how the test runs** from **what values it uses**.  
Compared to hardcoded tests, this makes suites easier to extend, easier to review, and less error-prone as coverage grows.

---

## Interview questions

**Q1. What is data-driven testing in Playwright?**  
**A.** It is running one reusable test logic against multiple input datasets, usually stored in arrays/files, to validate different behaviors efficiently.

**Q2. Why is it better than hardcoding values directly in tests?**  
**A.** Hardcoded tests duplicate logic and are harder to maintain. Data-driven tests centralize case inputs and keep test logic reusable.

**Q3. Where should test data live in a framework?**  
**A.** In a dedicated structure (for example `test-data/`) separate from test implementation files, so data and behavior stay decoupled.

**Q4. How does POM complement data-driven testing?**  
**A.** POM encapsulates page actions while datasets provide variable inputs. Together they create modular, scalable tests.

**Q5. What is a common pitfall in data-driven tests?**  
**A.** Overloading one test with too many unrelated scenarios. Keep datasets focused and split flows when behavior differs significantly.

