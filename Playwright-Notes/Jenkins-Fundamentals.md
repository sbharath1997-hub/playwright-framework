# Jenkins Fundamentals for Playwright SDET

## 1. What is Jenkins

- Jenkins is an open-source automation server for running build and test pipelines.
- It coordinates code checkout, dependency install, test execution, and artifact collection.
- As a Playwright SDET, think of Jenkins as the automation engine that executes your test workflow.

## 2. Why Jenkins is Used

- Centralizes automated test execution for PRs, branches, or scheduled runs.
- Supports Playwright TypeScript and other QA workflows.
- Provides a consistent place to validate changes outside local development.
- Keeps build history and test results for review.

## 3. Jenkins Architecture

### Controller

- The controller manages job configuration, pipeline execution, and build state.
- It acts as the coordinator for pipeline runs.

### Agent

- The agent runs the actual build steps, such as `npm ci` and `npx playwright test`.
- It usually has Node.js, browsers, and test dependencies installed.

## 4. Jobs

- Jobs define work Jenkins can run.
- In modern Jenkins, pipelines replace freestyle jobs for most QA automation.
- A job can perform checkout, install, test, and archive artifact steps.

## 5. Pipelines

- Pipelines are version-controlled workflows defined in code.
- They break the process into stages like `Checkout`, `Install`, `Test`, and `Publish`.
- Pipelines make Playwright execution repeatable and easier to maintain.

## 6. Jenkinsfile

- A `Jenkinsfile` stores the pipeline definition in the repository.
- It is usually written in declarative Groovy.
- The Jenkinsfile keeps your test flow with the code and makes changes reviewable.

```groovy
pipeline {
  agent any

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Test') {
      steps {
        sh 'npx playwright test'
      }
    }
  }
}
```

## 7. Typical Playwright Pipeline

- Checkout source from Git.
- Install dependencies with `npm ci`.
- Run Playwright tests or a targeted suite.
- Publish reports and artifacts for later review.
- Fail the build if tests fail.

## 8. Running Playwright Tests in Jenkins

- Use agent machines with Node.js and browsers installed.
- Checkout the repo and install dependencies.
- Run `npx playwright test --reporter=html` or the equivalent npm script.
- Keep the commands aligned with local development scripts.

Typical flow:

1. Checkout repository
2. npm ci
3. npx playwright install --with-deps (if required)
4. npx playwright test
5. Archive reports and artifacts

## 9. Reports and Artifacts

- Artifacts are generated files saved from the build.
- Common QA artifacts: HTML reports, screenshots, traces, and logs.
- Archiving artifacts helps diagnose failures after the pipeline finishes.
- Verify the pipeline preserves these files for review.

## 10. Scheduled Execution

- Jenkins can run pipelines on a schedule using cron-style triggers.
- Common uses are nightly regression, daily smoke checks, or periodic API health runs.
- Scheduled jobs help catch regressions that PR-triggered runs might miss.

## 11. Jenkins vs GitHub Actions

- Jenkins is a standalone server; GitHub Actions runs inside GitHub.
- Both can execute the same Playwright commands.
- Jenkins is often used in existing enterprise pipelines; Actions is easier for GitHub-native repos.
- Maintenance effort is typically higher in Jenkins due to the separate host and agent setup.

| Jenkins | GitHub Actions |
| ------- | -------------- |
| Standalone server with controller/agent model | Native GitHub pipeline runner |
| Pipeline defined in `Jenkinsfile` stored in repo | Pipeline defined in workflow YAML in repo |
| Common in existing enterprise automation setups | Common for GitHub-centric development workflows |
| Requires agent environment maintenance | Uses hosted or self-hosted runners with simpler setup |

## Interview Answer Templates

**What is Jenkins?**
A Jenkins is an automation server that runs build and test pipelines and collects results. For a Playwright SDET, it is the central runner that executes tests and records outcomes.

**What is a Jenkinsfile?**
A `Jenkinsfile` is the pipeline script stored in the repository. It defines stages and steps so the test workflow is version controlled and reviewable.

**Difference between Controller and Agent?**
The controller coordinates pipelines, schedules builds, and stores job definitions. The agent executes the actual work, like installing deps and running Playwright tests.

**How would you run Playwright tests from Jenkins?**
Checkout the repo, install dependencies with `npm ci`, then run `npx playwright test` or the appropriate npm script. Finally archive test reports and artifacts for debugging.

**What are artifacts?**
Artifacts are files saved from a build, such as HTML reports, screenshots, traces, and logs. They help investigate failures after the pipeline completes.

**Jenkins vs GitHub Actions?**
Jenkins is a separate automation server; Actions is built into GitHub. Both can run Playwright, but Actions is often simpler for GitHub repos while Jenkins is common in established enterprise pipelines.

## Key Takeaways

- Jenkins is an automation server that runs and records test pipelines.
- A `Jenkinsfile` keeps pipeline logic version-controlled and in the repo.
- Controller vs agent: controller coordinates, agent executes work.
- For Playwright, Jenkins should run `npm ci`, `npx playwright test`, and archive reports.
- Jenkins and GitHub Actions can run the same tests; the main difference is hosting model and maintenance effort.

## Common Jenkins Pipeline Stages

1. **Checkout** – pulls the Playwright repo code into the workspace.
2. **Install** – installs Node dependencies so tests can run consistently.
3. **Test** – executes `npx playwright test` or a specific suite.
4. **Publish Reports** – generates HTML or other test report files for review.
5. **Archive Artifacts** – saves reports, screenshots, and traces for debugging after the build.
