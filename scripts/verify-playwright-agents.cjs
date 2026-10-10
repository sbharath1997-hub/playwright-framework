// A setup diagnostic, not a Planner/Generator agent invocation.
// Uses the MCP stdio protocol to verify the official local test server.
const { spawn } = require('node:child_process');
const path = require('node:path');
const readline = require('node:readline');
const fs = require('node:fs');

const root = path.resolve(__dirname, '..');
const evidence = {
  startedAt: new Date().toISOString(),
  nodeVersion: process.version,
  playwrightVersion: require('playwright/package.json').version,
  command: 'npm.cmd run agents:check',
  checks: [],
  scope: 'MCP and seed setup verification only; no LLM agent invocation or recording',
};
function passed(check) {
  evidence.checks.push(check);
  console.log(`PASS: ${check}`);
}
const cli = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js');
const child = spawn(process.execPath, [
  cli, 'run-test-mcp-server', '--headless', '--config', 'playwright.agents.config.ts',
], { cwd: root, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });

let nextId = 1;
const pending = new Map();
const lines = readline.createInterface({ input: child.stdout });
lines.on('line', (line) => {
  let message;
  try { message = JSON.parse(line); } catch { return; }
  const item = pending.get(message.id);
  if (!item) return;
  pending.delete(message.id);
  clearTimeout(item.timer);
  if (message.error) item.reject(new Error(JSON.stringify(message.error)));
  else item.resolve(message.result);
});
child.stderr.on('data', (data) => process.stderr.write(data));
function rejectPending(error) {
  for (const item of pending.values()) {
    clearTimeout(item.timer);
    item.reject(error);
  }
  pending.clear();
}
child.on('error', rejectPending);
child.on('exit', (code) => rejectPending(new Error(`MCP server exited: ${code}`)));

function request(method, params) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timed out: ${method}`));
    }, 60000);
    pending.set(id, { resolve, reject, timer });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
}
async function call(name, args = {}) {
  const result = await request('tools/call', { name, arguments: args });
  if (result.isError) {
    throw new Error(`${name}: ${result.content?.map((item) => item.text || '').join('\n')}`);
  }
  passed(name);
  return result;
}

async function main() {
  const initialized = await request('initialize', {
    protocolVersion: '2025-06-18', capabilities: {},
    clientInfo: { name: 'pw-framework-setup-check', version: '1.0.0', cwd: root },
  });
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
  passed(`MCP initialize (${initialized.serverInfo?.name})`);
  const { tools } = await request('tools/list', {});
  const required = [
    'planner_setup_page', 'planner_save_plan', 'generator_setup_page',
    'generator_read_log', 'generator_write_test', 'browser_snapshot', 'browser_close',
  ];
  for (const name of required) {
    if (!tools.some((tool) => tool.name === name)) throw new Error(`Missing MCP tool: ${name}`);
  }
  passed(`${required.length} required Planner/Generator/browser tools available`);

  const seed = { project: 'chromium', seedFile: 'tests/agent-lab/seed.spec.ts' };
  try {
    await call('planner_setup_page', seed);
    const snapshot = await call('browser_snapshot');
    const text = snapshot.content?.map((item) => item.text || '').join('\n') || '';
    if (!text.includes('playwright.dev') || !text.includes('Docs')) {
      throw new Error('Planner seed did not expose the expected Playwright home page.');
    }
    passed('Planner seed exposes live home page and Docs navigation');
  } finally {
    await call('browser_close', { intent: 'Close the Planner setup diagnostic browser' });
  }

  try {
    await call('generator_setup_page', {
      ...seed,
      plan: 'Setup diagnostic only: load the existing homePage fixture at playwright.dev. Do not generate tests.',
    });
    await call('generator_read_log');
    passed('Generator setup and recording log work');
  } finally {
    await call('browser_close', { intent: 'Close the Generator setup diagnostic browser' });
  }
  console.log('Setup check complete. No test plan, generated test, or Codegen recording was created.');
  evidence.status = 'passed';
}

main().catch((error) => {
  console.error(error.message);
  evidence.status = 'failed';
  evidence.error = error.message;
  process.exitCode = 1;
}).finally(() => {
  lines.close();
  child.stdin.end();
  child.kill();
  evidence.finishedAt = new Date().toISOString();
  const folder = path.join(root, 'evidence', 'agent-lab');
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'setup-mcp.json'), JSON.stringify(evidence, null, 2) + '\n');
});
