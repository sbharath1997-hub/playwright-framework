# Day 04 — Realistic Login Flow with POM

## Realistic automation flow

Day 4 moves from demo pages to a real public practice site: `https://automationexercise.com`.
The test flow models an actual user path:

1. Open home page
2. Validate core page state is visible
3. Click `Signup / Login`
4. Confirm login page is displayed

This is closer to real QA automation because it checks navigation behavior across pages, not only one static screen.

---

## Login and navigation testing

The new test (`tests/day4-login.spec.ts`) verifies:

- home page loads correctly
- primary login entry point is visible and clickable
- URL changes to the login route
- expected login heading appears

That combination (URL + visible user-facing content) makes assertions stronger than checking only one signal.

---

## Selector strategy

Selectors are chosen to be stable and readable:

- `getByRole('link', { name: 'Signup / Login' })` for the login entry action
- `getByRole('heading', { name: 'Login to your account' })` for page confirmation
- minimal fallback locator (`header`) only for broad page-load confidence

Why this strategy works:

- role-based selectors align with accessible UI semantics
- human-readable names make tests easy to review
- fewer brittle CSS chains reduce maintenance cost

---

## Why POM is useful in larger projects

POM separates concerns:

- **tests** describe scenario intent
- **page classes** own selectors and low-level actions

In larger suites, this improves:

- **reusability**: same methods reused across smoke/regression suites
- **maintainability**: UI change usually fixed in one place
- **readability**: tests read like business steps

---

## Interview-friendly summary

`automationexercise.com` is better for learning advanced automation because it has realistic user journeys (auth, cart, account pages), predictable navigation, and enough UI complexity to practice locator design and test architecture.

POM improves maintainability by centralizing UI interaction logic so tests do not duplicate selectors. Stability comes from role-based selectors, Playwright auto-waiting, and assertions that validate both URL and page content.

---

## Interview questions

**Q1. Why move from demo sites to a site like automationexercise.com?**  
**A.** Demo pages are good for syntax, but realistic sites teach practical problems: multi-step flows, navigation timing, selector reliability, and architecture decisions.

**Q2. What does POM solve in test automation?**  
**A.** It solves duplication and fragility by moving selector/action logic into reusable page classes, reducing update effort when UI changes.

**Q3. How do you choose stable selectors?**  
**A.** Prefer role/text-based selectors that match user-visible semantics; avoid brittle CSS/XPath chains tied to layout structure.

**Q4. Why assert both URL and heading for login page verification?**  
**A.** URL proves navigation route changed; heading proves correct content rendered. Together they reduce false positives.

**Q5. What keeps Playwright tests stable in this flow?**  
**A.** Auto-waiting on actions/assertions, deterministic selectors, and clear page-object boundaries that avoid repeated ad-hoc locator logic.
