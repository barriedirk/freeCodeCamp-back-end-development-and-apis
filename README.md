# Back-End Development and APIs Certification

This curriculum teaches you how to build back end applications and APIs using Node.js and Express. You will work through guided lessons that introduce new concepts step by step, then apply what you have learnt in independent practice projects.

---

## Getting Started in VS Code

Whether you are using **GitHub Codespaces** or a **Local Dev Container**, follow these steps once your environment has finished loading:

1. **Open the Command Palette**: Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> on Windows and Linux or <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> on Mac.
2. **Start the Course**: Search for and run `freeCodeCamp: Run Course`.
3. **Select a Project**: The **Simple Browser** tab will open. Select your desired lab or workshop from the menu to start.

---

## Selecting & Switching Projects

You do **not** need to create a new machine or environment to take another lab or workshop. To start a new lab or switch projects:

1. Click the **freeCodeCamp** logo in the **Simple Browser** tab.
2. Select any lab from the list (for example, _Build a Case Converter_, _Build a Prime Number Checker Module_).

---

## Troubleshooting & Tips

- **Blank Screen on Launch:** Click the refresh icon in the top toolbar of the **Simple Browser** tab.
- **Reopening the Course Tab:** If you accidentally close the course panel, re-run `freeCodeCamp: Run Course` from the Command Palette.
- **Environment Loading:** If `freeCodeCamp: Run Course` isn't found immediately upon opening the workspace, wait a minute for VS Code extensions to finish initializing.

## Projects

### 1. Learn Node.js REPL

You will learn the Node.js REPL and command-line interface by exploring the runtime from the terminal.

### 2. Build a File Processor

You will learn Node.js built-in modules like `fs`, `path`, and `crypto` by using them for file operations and data processing.

### 3. Build a Case Converter

You will learn how to initialize, configure, and publish an NPM module by building a case converter.

### 4. Build a Prime Number Checker Module

Practice building and exporting an NPM module by creating a prime number checker.

### 5. Build a Web Server

You will learn the Node.js `http` module by building a web server to serve a multi-page client application.

### 6. Build a Random Joke App

You will learn basic Express routing and response methods by building a random joke app.

### 7. Build a Personal Profile App

Practice building an Express server and JSON API by creating a personal profile application.

### 8. Build a Submission Form

You will learn application-level and router-level middleware by building a structured submission form.

### 9. Build a Data Sanitizer

Practice creating custom Express middleware by building a data sanitizer and validator.

### 10. Build a Weather Service API

You will learn route parameters and modular routing with `express.Router` by building a weather service API.

### 11. Build a Timestamp Microservice

Practice building a RESTful API with date parsing logic by creating a timestamp microservice.

### 12. Build a Bank API

You will learn Express 5 error handling, health checks, and graceful shutdowns by building a bank API.

### 13. Build a Resource Monitor

You will learn Node.js WebSockets and real-time data streaming by building a system resource monitor.

### 14. Build a Chat App

Practice building a real-time multi-client chat server using Node.js WebSockets.

### 15. Build JWT Protected Routes

You will learn JSON Web Token authentication and role-based authorization by building a secure Express API with register, login, logout, and protected routes.

### 16. Build a Family Movie Watchlist API

Practice authentication and authorization by building a family movie watchlist HTTP API.

---

## Inspecting the Curriculum with `curriculum:extract`

The curriculum stores each lesson's description, tests, seed files, and test hooks inside Markdown files. `npm run curriculum:extract` is a small, **read-only** tool that reads those files and prints the requested part to your terminal.

It is useful when you want to:

- Read the exact tests that will grade a project.
- See the expected status codes, response bodies, and helper functions.
- Inspect the initial files (seed) for a lesson.
- Understand a failing test without searching through the whole Markdown file.

The command **does not** run tests, start your server, modify your project, or use AI to judge your code. It only parses and prints the curriculum source.

### Where the command is defined

The script lives in the workspace root `package.json`:

```json
"scripts": {
  "curriculum:extract": "node test/extract.mjs"
}
```

There are two relevant `package.json` files in this workspace:

| Location | Purpose |
| --- | --- |
| `back-end-development-and-apis/package.json` | Workspace root. Contains `curriculum:extract`, `test`, and the freeCodeCamp OS tooling. |
| `back-end-development-and-apis/<project>/package.json` | The individual lab or workshop. Usually only contains a `start` script. |

Run the command **from the workspace root**, not from the lab folder:

```sh
cd back-end-development-and-apis
npm run curriculum:extract -- --project build-a-family-movie-watchlist-api --section tests
```

The `--` is required: it tells npm that the following flags belong to `test/extract.mjs`, not to npm itself.

If you run it from a lab folder, you will see `Missing script: "curriculum:extract"` because that folder has a different `package.json`.

The script imports `CoffeeDown` from the workspace's `node_modules`, so run `npm install` in the workspace root first if dependencies are not installed yet.

### What happens behind the scenes

```text
config/projects.json
        │  find the project by dashedName
        ▼
curriculum/locales/english/<dashedName>.md
        │  parse with CoffeeDown
        ▼
lesson objects
(description, tests, seed, hooks, hints)
        │  select and render
        ▼
Markdown or JSON in your terminal
```

1. **Arguments are parsed.** The script accepts `--project`, `--lesson`, `--section`, and `--json`.
2. **The project is looked up** in `config/projects.json` by its `dashedName`, for example `build-a-family-movie-watchlist-api`. An unknown project produces `Unknown project: ...`.
3. **The curriculum Markdown is opened** at `curriculum/locales/english/<dashedName>.md`.
4. **The file is parsed with `CoffeeDown`**, the parser shipped with `@freecodecamp/freecodecamp-os`:
   ```js
   import { CoffeeDown } from
     '../node_modules/@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/parser.js';
   ```
   `getProjectMeta()` returns the number of lessons, and `getLesson(number)` returns an object with the lesson content.
5. **Lessons are selected.** If you omit `--lesson`, every lesson is selected. Lesson numbering starts at `0`.
6. **The requested section is rendered** as Markdown, or as JSON when `--json` is used.
7. **The result is printed.** Errors such as an invalid section or lesson number exit with a non-zero status.

A parsed lesson contains these fields:

| Field | Contents |
| --- | --- |
| `description` | The lesson explanation and user stories. |
| `tests` | An array of `[description, code]` pairs. Each `code` value is the JavaScript assertion that grades the project. |
| `seed` | Initial files for the lesson. Items are either plain strings or `{ filePath, fileSeed }` objects. |
| `beforeAll`, `beforeEach`, `afterEach`, `afterAll` | Hook code that runs around the tests. |
| `hints` | Optional hints shown with the lesson. |

### Available sections

| Section | What it prints |
| --- | --- |
| `lesson` | Everything: description, tests, hooks, seed, and hints. This is the default. |
| `description` | The explanation and user stories. |
| `tests` | Every test with its description and assertion code. |
| `seed` | The initial files for the project. |
| `hooks` | The `beforeAll`, `beforeEach`, `afterEach`, and `afterAll` code. |

### Available options

| Option | Description |
| --- | --- |
| `--project <name>` | **Required.** The project's `dashedName` from `config/projects.json`. |
| `--lesson <number>` | Extract only that lesson. Omit it to extract all lessons. |
| `--section <name>` | `lesson`, `description`, `tests`, `seed`, or `hooks`. Defaults to `lesson`. |
| `--json` | Print structured JSON instead of Markdown. |
| `--help`, `-h` | Show the built-in help text. |

Flags can be written as `--section tests` or `--section=tests`. `--json` takes no value.

### Examples

#### Read the tests for a project

```sh
npm run curriculum:extract -- \
  --project build-a-family-movie-watchlist-api \
  --section tests
```

The output starts like this:

````markdown
## Lesson 0

#### Test 1

An HTTP server should be listening on port `3000`.

```js
const __listening = await __helpers.isServerListening(3000);
assert.isTrue(__listening, "Your server should be listening on port 3000");
```

#### Test 2

`middleware/authenticate.js` should export a named `authenticate` function.

```js
const { authenticate } = await __helpers.importSansCache(
  `${project.dashedName}/middleware/authenticate.js`,
);
assert.isFunction(
  authenticate,
  "middleware/authenticate.js should export a named function `authenticate`.",
);
```
````

This shows the exact assertions, including expected status codes and response bodies. For example, the authentication tests check for `{ error: "No token provided." }` exactly, including the key name and the final period.

#### Read the user stories only

```sh
npm run curriculum:extract -- \
  --project build-a-family-movie-watchlist-api \
  --section description
```

Use this to review the requirements without the test code.

#### Read the test hooks and helpers

```sh
npm run curriculum:extract -- \
  --project build-a-family-movie-watchlist-api \
  --section hooks
```

The hooks section contains helpers such as:

```js
const __url = "http://localhost:3000";

const __login = async (username, password) => {
  const res = await fetch(`${__url}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, token: body.token };
};

const __auth = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

const __mockRes = () => ({
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});
```

These helpers explain how the tests call your API: they log in to get a token, send it as a Bearer token, and mock Express's `res` object when testing middleware directly.

#### Read the seed files

```sh
npm run curriculum:extract -- \
  --project build-a-chat-app \
  --lesson 0 \
  --section seed
```

If a lesson defines initial files, this section prints each one with its path and content:

````markdown
#### build-a-chat-app/server.js

```js
import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";

const PORT = 3001;
```
````

Some lessons do not define seed files in their Markdown. In that case, the command prints only the lesson heading. For example, the watchlist lab currently has no `seed` section. That does not necessarily mean the project has no starter files; it means this particular lesson does not declare them in the curriculum Markdown.

#### Extract JSON for scripting

```sh
npm run curriculum:extract -- \
  --project build-a-family-movie-watchlist-api \
  --lesson 0 \
  --section tests \
  --json
```

When a single lesson is selected, the output is one object:

```json
{
  "number": 0,
  "content": [
    [
      "An HTTP server should be listening on port `3000`.",
      "const __listening = await __helpers.isServerListening(3000);\nassert.isTrue(__listening, \"Your server should be listening on port 3000\");"
    ]
  ]
}
```

When `--lesson` is omitted, the output is an array of `{ number, content }` objects. You can redirect it to a file for easier reading:

```sh
npm run curriculum:extract -- \
  --project build-a-family-movie-watchlist-api \
  --section tests \
  --json > /tmp/watchlist-tests.json
```

#### Extract a single lesson

```sh
npm run curriculum:extract -- \
  --project build-a-family-movie-watchlist-api \
  --lesson 0
```

Most standalone labs with a single lesson use `--lesson 0`. Larger projects and workshops can have many lessons.

#### Show the built-in help

```sh
npm run curriculum:extract -- --help
```

### How this helps you understand the tests

The extracted tests are the **source of truth** for grading. The user stories describe the intended behavior, but the tests contain the exact details the grader checks. Reading them helps you:

- See the exact HTTP status expected for each request.
- See the exact JSON shape, including property names such as `error` versus `message`.
- See whether a test calls middleware directly or makes a real HTTP request.
- See which helpers the tests use and what data they send.
- Reproduce a failure manually with `curl` or `fetch`.

The tests are ordinary JavaScript executed with Node.js and `assert`. They are deterministic: no AI decides whether your project passes. AI can help you interpret a failure and suggest a fix, but the assertions are what actually grade the work.

### `curriculum:extract` vs. `test/run.mjs`

| Command | What it does | Safe to run on your project? |
| --- | --- | --- |
| `npm run curriculum:extract` | Reads and prints curriculum Markdown. Read-only. | Yes. It does not modify anything. |
| `node test/run.mjs` | Runs curriculum validation checks in temporary workspaces using seed and solution snapshots. | Yes for your project; it is intended to validate the curriculum, not to grade your work. |
| `npm start` (workspace root) | Starts the freeCodeCamp OS tooling server used by the course UI. | Yes. |
| Run Tests button in the course UI | Runs the official tests against your project. | Yes. This is the normal grading flow. |

`test/run.mjs --check solution` is intended to validate the curriculum itself, not to grade your project. It builds temporary workspaces from the repository's tracked files and snapshots, then removes them when it finishes. For day-to-day work, use the course UI or `curriculum:extract` instead. If a reset or seed action in the course tooling restores starter files, back up configuration files such as `.env` first.

### Suggestions and tips

- **Run from the workspace root.** If `curriculum:extract` is missing, check `pwd` and run `npm run` to list the scripts available in the current folder.
- **Start with `--section description`.** Read the requirements first, then `--section tests` for the exact assertions.
- **Read `--section hooks` when a test uses helpers.** The hooks reveal how tokens are created, how requests are authenticated, and how middleware responses are mocked.
- **Use `--section seed` when a lesson declares starter files.** It shows those files and any environment values defined there. If the section is empty, the lesson does not declare seed files in its Markdown.
- **Remember that lesson numbering starts at `0`.** A lab with one lesson uses `--lesson 0`.
- **Use `--json` when you want to process the output.** It is easier to save, search, or filter than Markdown.
- **Do not edit the curriculum Markdown to make tests pass.** The tests are part of the course. Change your project, not the grader.
- **If a test checks an exact string, match it exactly.** Punctuation, capitalization, and property names matter.
- **If a reset or seed action restores starter files, re-check your `.env` afterwards.** It may replace local values with the starter version.
- **Keep real secrets out of version control.** Use `.env` for local values and provide a `.env.example` without secrets when sharing a project.

---

## How the Tests in the Markdown Are Executed

Short answer: the tests are not imported as JavaScript modules. They are extracted from the Markdown as strings and executed with **`eval()` inside a Node.js worker thread**.

### 1. From Markdown to test code

The curriculum parser, `CoffeeDown`, uses the `marked` lexer to tokenize each Markdown file. Inside a lesson it looks for the `--tests--` section and separates:

- Paragraphs, which become the test descriptions.
- Code blocks, which become the test code.

It then pairs them:

```js
// node_modules/@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/parser.js
const texts = textTokens.map(token => token.text);
const tests = testTokens.map(token => token.text);
return texts.map((text, index) => [text, tests[index]]);
```

The result is an array of `[description, code]` pairs:

```js
[
  [
    "An HTTP server should be listening on port `3000`.",
    "const __listening = await __helpers.isServerListening(3000);\nassert.isTrue(__listening, \"Your server should be listening on port 3000\");"
  ],
  [
    "`middleware/authenticate.js` should export a named `authenticate` function.",
    "const { authenticate } = await __helpers.importSansCache(...);\nassert.isFunction(authenticate, ...);"
  ]
]
```

Each test is therefore a **JavaScript string**, not a file.

### 2. The local runner creates a worker

`test/run.mjs` loads the curriculum, selects the project and lesson, creates a temporary workspace from the repository's tracked files plus the lesson seed, and calls `runLessonTests()` in `test/lib/worker.mjs`.

For each test, `LessonWorker` creates or reuses a `Worker` from `node:worker_threads` that runs:

```text
node_modules/@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/tests/test-worker.js
```

The worker receives:

- `beforeEach`: the lesson hook.
- `project`: project metadata.
- `testCode`: the test string, sent with `postMessage`.

The worker is also started with `--unhandled-rejections=strict`, so a rejected promise that is not handled becomes a worker failure instead of being silently ignored.

### 3. The `eval` call

The core of the execution is in `test-worker.js`:

```js
parentPort.on('message', async ({ testCode, testId }) => {
  let passed = false;
  let error = null;
  try {
    const _eval_out = await eval(`(async () => {
      ${beforeEach}
      ${testCode}
})();`);
    passed = true;
  } catch (e) {
    // ...
    error.type = e instanceof AssertionError ? 'AssertionError' : 'Error';
  }
  parentPort.postMessage({ passed, testId, error });
});
```

This is a **direct `eval`** of a self-invoking async function. The evaluated string contains:

1. The lesson's `beforeEach` code.
2. The test code.

Because `eval` is direct, the evaluated code can access variables from the worker's lexical scope. That is why tests can use `assert`, `expect`, `__helpers`, and `project` without importing them, and why helpers defined in `beforeEach` (such as `__url`, `__auth`, or `__mockRes`) are available to the test.

For example, this test:

```js
const __res = await fetch(`${__url}/api/watchlist/1`);
assert.equal(__res.status, 401);
```

works because `assert` comes from the Chai import in `test-worker.js` and `__url` comes from the `beforeEach` hook. The async IIFE also allows top-level `await` inside the test.

### 4. How pass and fail are determined

The worker does not use Jest, Mocha, or another test framework. It only tries the evaluation and catches errors:

- **No exception** → `pass`.
- **`AssertionError` from Chai** → `fail`.
- **Any other error** (for example `ReferenceError` or `TypeError`) → `crash`.
- **Timeout** → the parent terminates the worker and records `timeout`.
- **Unhandled promise rejection** → `unhandledRejection`.
- **Worker exits unexpectedly** → `crash`.

The parent also waits a short `settle` period (500 ms by default) after receiving a message, so late rejections from floating promises can still be detected.

### 5. The complete flow

```text
Markdown
   │  marked / CoffeeDown
   ▼
[ [description, code], ... ]
   │  test/run.mjs
   ▼
Worker thread (test-worker.js)
   │  postMessage({ testCode })
   ▼
eval(`(async () => {
  beforeEach
  testCode
})();`)
   │
   ├── no error        → pass
   ├── AssertionError  → fail
   ├── other error     → crash
   ├── timeout         → timeout
   └── worker exits    → crash
```

### 6. Local runner vs. the official freeCodeCamp tooling

The `eval` mechanism is the same in both cases, but the context is different:

| | `test/run.mjs` (local) | Official tooling (`npm start` / course UI) |
| --- | --- | --- |
| Where it runs | Temporary workspace in the system temp directory | Your actual project |
| Files | Copies tracked files and applies the lesson seed | Uses your project as it is |
| Server | Skips tests that need a live server (`fetch`, WebSocket, `isServerListening`) | Runs all tests against your running server |
| Purpose | Validates the curriculum and its snapshots | Grades your project |

In the official tooling, `tests/main.js`:

1. Runs `beforeAll` with `eval`.
2. Creates one worker per test, or a single blocking worker.
3. Sends `{ testCode, testId }` to each worker.
4. Lets the worker run the test with `eval`.
5. Runs `afterEach` and `afterAll` with `eval` as well.

The local runner skips live-server tests because it is designed to validate the curriculum itself, not to start your project. The course UI is the normal grading path.

### 7. Is using `eval` safe?

Here it is acceptable because the evaluated code comes from the **curriculum**, not from an untrusted user. Still, the implications are important:

- `eval` executes arbitrary JavaScript with the permissions of the process.
- A worker thread is **not a security sandbox**. It isolates the scope and lets the parent terminate it on timeout, but the code can still read files, use the network, and access environment variables.
- Only run tests from a curriculum you trust.
- The `lint` check (`test/run.mjs --check lint`) analyzes test code statically with `@babel/parser`, but the actual execution still uses `eval`.

### 8. Why use `eval` instead of imports?

Because the tests are **curriculum content**, not standalone `.js` files. Using `eval` lets the tooling:

- Execute tests defined directly in Markdown without generating temporary files or a build step.
- Support top-level `await` by wrapping the code in an async function.
- Inject `beforeEach` and helpers into the same scope as the test.
- Catch any exception and report it to the course UI.

In summary: the tests in the Markdown are extracted as strings, concatenated with the `beforeEach` hook, and executed with a direct `eval` inside a worker thread. The worker reports pass, fail, crash, timeout, or unhandled rejection back to the runner.
