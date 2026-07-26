# nano-sdk Agent Guide

Read this file before substantial work. It describes the current repository, not a general TypeScript SDK
template. Keep changes consistent with nearby code and update this guide when the repository changes in a way
that makes it incomplete or inaccurate.

## Repository Overview

`nano-sdk` is a single-package TypeScript SDK for Nano node integrations. It provides:

- Runtime-validated and statically typed Nano RPC requests/responses over HTTP.
- Runtime-validated Nano WebSocket requests/responses and a reconnecting, typed `WebSocketClient`.
- Zod schemas for Nano primitives and block variants.
- Local cryptographic helpers for keys, accounts, hashes, signatures, blocks, and work verification.
- Precision-safe raw/nano amount conversion, arithmetic, comparison, and formatting.

The consumer surface is the `Nano` namespace imported from `"nano-sdk"`; see `README.md` and `examples/`.
This repository implements SDK schemas, transports, and deterministic utilities. It does not run or configure a
Nano node, persist wallet/application state, or provide an application UI. Live protocol verification belongs in
integration tests and requires an external node.

This is an npm project with `package-lock.json` (lockfile version 3). It is not a monorepo. There are no checked-in
CI workflows or nested `AGENTS.md` files at present.

## High-Level Architecture

The root flow is:

```text
src/index.ts -> Nano namespace (`src/nano/index.ts`)
  -> Types / Blocks / Crypto / Math
  -> RPC schemas -> RPC method -> HTTP transport -> Nano RPC endpoint
  -> WebSocket schemas -> WebSocketClient -> Nano WebSocket endpoint
```

The areas are deliberately organized by Nano concepts:

- **Types — `src/nano/types/`:** Zod schema factories and inferred TypeScript aliases for accounts, amounts,
  hashes, keys, heights, timestamps, work, and other protocol primitives. Higher layers reuse these validators.
  Some support types (`Result`, throwing-mode markers, conditional mapped types, and `Nacl`) are internal because
  they are not exported by `src/nano/types/index.ts`. Unit tests are in `test/unit/nano/types/`.
- **Blocks — `src/nano/blocks/`:** Zod schemas for state and legacy block shapes; `block.ts` unions the variants.
  RPC, WebSocket, and crypto code consume these shapes. Unit tests mirror the directory in
  `test/unit/nano/blocks/`.
- **Crypto — `src/nano/crypto/`:** Public camelCase operations for key derivation/generation, account
  conversion, hashing, signing, and verification. `conversion/` contains byte/base32/hex/key converters used
  internally; `generate-random-bytes.ts` and `src/nano/types/nacl.ts` are also implementation details. Crypto
  functions validate inputs using `Types` and generally support throwing and non-throwing overloads. Tests are
  in `test/unit/nano/crypto/`, including a mirrored `conversion/` subtree.
- **Math — `src/nano/math/`:** Raw/nano conversions and bounded raw arithmetic/formatting. Public functions
  accept validated raw strings and/or `bigint`; arithmetic return type follows the first `raw` argument.
  `comparison.ts` is a shared internal helper even though it has a direct unit test. Tests are in
  `test/unit/nano/math/`.
- **RPC — `src/nano/rpc/`:** A protocol method normally spans matching kebab-case files under `requests/`,
  `responses/`, and `methods/`. Request and response files define Zod schemas plus inferred types. The method
  validates the request, selects the response schema (sometimes from request flags), and delegates to `http/`.
  `http/post.ts` handles request validation, transport, node error payloads, response validation, throwing versus
  result-returning behavior, timeout/cancellation, and custom `HttpClient` injection. Unit schema tests mirror
  `requests/` and `responses/`; live method tests are in `test/integration/nano/rpc/`.
- **WebSocket — `src/nano/web-socket/`:** `requests/`, `responses/`, and `types/` contain Zod schemas for Nano
  actions, acknowledgements, and topics. `client/web-socket-client.ts` owns connection lifecycle, reconnection,
  queueing, WebSocket-like event APIs, incoming JSON validation, and typed ack/topic dispatch. Schema unit tests
  mirror these directories. Live topic tests and local transport/client tests are in
  `test/integration/nano/web-socket/`.

There is no universal one-way dependency rule: for example, the account validator uses the internal base32
converter while crypto utilities use account/type validators. Reuse the existing shared primitive and converter
layers, but inspect imports and call sites before adding a new cross-area dependency.

## Source Layout and Placement

- `src/index.ts`: the only package entry source; exports `Nano`.
- `src/nano/index.ts`: assembles `Nano.Blocks`, `Nano.Crypto`, `Nano.Math`, `Nano.RPC`, `Nano.Types`,
  `Nano.WebSocket`, and the convenience alias `Nano.WebSocketClient`.
- `src/nano/*/index.ts`: public barrels. A file existing under `src` is not automatically public.
- `src/nano/rpc/methods/conditional-types/`: type-level helpers that make RPC response fields follow literal
  request flags. They are method internals, not exported from `methods/index.ts`.
- `test/unit/test-data.ts`: shared valid and deliberately invalid primitive/block fixtures.
- `test/integration/test-data.ts`: stable Nano network fixtures such as genesis/burn data.
- `test/assert.ts`: assertion function used to narrow discriminated result types.
- `test/integration/config.ts`: live RPC/WebSocket endpoint and timeout configuration.
- `scripts/convert-to-lf.mjs`: repository-wide LF normalizer with a non-writing `--check` mode; exposed through
  the `line-endings:lf` and `line-endings:check` npm scripts.
- `examples/`: consumer-oriented examples importing from `"nano-sdk"`. They are outside `tsconfig.json`'s
  `include`; do not treat them as build inputs.
- `images/`: README assets.
- `dist/`: generated CommonJS JavaScript and declarations. It is ignored and is not source-controlled.

Use kebab-case filenames. Follow the local symbol convention:

- Zod schema factories and their inferred type aliases usually share a PascalCase name, for example
  `AccountString` or `VersionResponse`.
- SDK utilities use camelCase, such as `hashBlock` and `rawPlus`.
- Nano RPC call functions intentionally use protocol action names in snake_case, such as `account_info`.
- Protocol object keys remain the Nano wire-format snake_case; do not “idiomatize” them to camelCase.

Do not add a generic `models`, `services`, or `utils` directory when the change belongs to an existing Nano
concept. Place protocol schemas beside their request/response peers, reusable primitive validators in `types`,
byte encoders/decoders in `crypto/conversion`, and transport behavior in the appropriate `http` or WebSocket
client layer.

## Public API and Exports

`package.json` exposes only `"."`, backed by `dist/index.js` and `dist/index.d.ts`. The build is CommonJS targeting
ES2020, emits declarations, and marks the package as side-effect-free. There are no supported package subpath
exports.

Consumers use:

```ts
import { Nano } from "nano-sdk";
```

When adding a public symbol:

1. Export it from the nearest area barrel (`src/nano/types/index.ts`, `blocks/index.ts`, `crypto/index.ts`,
   `math/index.ts`, or the relevant RPC/WebSocket barrel).
2. Confirm the area is already exposed through `src/nano/index.ts`; update it only for a genuinely new namespace
   or root alias.
3. Update export-focused tests where the public grouping changes (`test/unit/index.test.ts`,
   `test/unit/nano/index.test.ts`, and existing area index tests where present).
4. Build and inspect the generated declarations/package dry run when the package surface changes.

RPC additions require all three exports: `src/nano/rpc/requests/index.ts`,
`src/nano/rpc/responses/index.ts`, and `src/nano/rpc/methods/index.ts`. WebSocket additions require the relevant
`requests/index.ts`, `responses/index.ts`, or `types/index.ts`; these roll up through
`src/nano/web-socket/index.ts`.

Do not export implementation helpers merely because a public feature uses them. Current intentional internals
include crypto converters, random-byte generation, math comparison helpers, RPC conditional types and
`ErrorResponse`, throwing/result helper types, and `Nacl`.

Treat exported schema shapes, inferred aliases, overloads, error modes, namespace names, and runtime validation
behavior as compatibility-sensitive. Search internal use, examples, tests, and README references before changing
them. Preserve backward compatibility unless the task explicitly calls for a breaking change.

## Coding Conventions

The source compiler settings in `tsconfig.json` are strict: `strict`, `noImplicitAny`, `noUnusedLocals`,
`noUnusedParameters`, `noFallthroughCasesInSwitch`, and `noUncheckedSideEffectImports` are enabled. Only `src`
is built. The output target is ES2020/CommonJS with declaration files.

`eslint.config.mjs` applies ESLint recommended and typescript-eslint recommended rules. Its repository-specific
block covers `src`, `test`, and `scripts` and enforces:

- Prettier as an ESLint error.
- Sorted imports and exports through `simple-import-sort`.
- No unused variables/parameters, except names beginning with `_`; ignored rest siblings are allowed.
- `@typescript-eslint/no-explicit-any`; use narrow types. Existing `any` use in the WebSocket compatibility layer
  and a few tests has targeted suppressions and is not a general precedent.

`.prettierrc` requires LF endings, two spaces, no tabs, double quotes, semicolons, bracket spacing, a 120-column
width, and ES5-style trailing commas. **All repository text files must use Unix/Linux LF line endings; never
introduce CRLF line endings, including when working on Windows.** Run `npm run line-endings:lf` to normalize the
worktree (excluding `.git`, `node_modules`, `dist`, and `images`) or `npm run line-endings:check` to check without
writing. Let the import-sort rule establish grouping/order. There is no enforced repository-wide type-only-import,
member-ordering, explicit-return-type, or documentation-comment rule; follow the nearby file rather than imposing
a new convention.

Established implementation patterns:

- Validate external/protocol inputs with the existing Zod primitives and `.safeParse`; do not duplicate regexes
  or replace typed validation with casts.
- Keep wire-format schemas explicit. Zod objects strip unrecognized keys by default; changing schema strictness
  is observable behavior.
- Crypto and math functions commonly expose overloads selected by `throwOnError`: default/true throws an
  `Error`, while `false` returns the discriminated `Result<T>`.
- RPC calls default to throwing and use `PostError`; `{ throwOnError: false }` returns `PostResult<T>`.
  Preserve overloads and response inference when editing a method.
- For flag-dependent RPC responses, use the existing helpers in `methods/conditional-types/` and response schema
  patterns instead of broad union types or casts.
- Catch unknown values safely (`e instanceof Error`) and keep error paths observable. Do not introduce silent
  fallbacks unless the protocol intentionally permits them.
- Use focused comments for protocol quirks, compatibility, or attribution. Preserve attribution in
  `src/nano/types/nacl.ts`, `src/nano/web-socket/client/web-socket-client.ts`, and
  `THIRD_PARTY_NOTICES.md` when changing derived code.

Always inspect nearby code before introducing a pattern. Prefer local consistency and existing abstractions over
new wrappers or generalized layers that the requested change does not need.

## Testing Architecture and Mandatory Policy

Jest 30 with `ts-jest` is used in Node test environments. `jest.setup.ts` registers the custom matcher object
from `test/jest.custom-matchers.ts` (currently empty). Unit and integration suites have separate configs:

- `jest.unit.config.ts` matches `test/unit/**/*.test.ts`.
- `jest.integration.config.ts` matches `test/integration/**/*.test.ts`, runs with a 30-second default timeout,
  and individual WebSocket suites may override it.

The test tree mirrors the relevant source concept:

- `src/nano/types/account.ts` -> `test/unit/nano/types/account.test.ts`
- `src/nano/crypto/conversion/account-converter.ts` ->
  `test/unit/nano/crypto/conversion/account-converter.test.ts`
- `src/nano/rpc/requests/account-info.ts` and `responses/account-info.ts` ->
  matching unit paths under `test/unit/nano/rpc/requests/` and `responses/`
- `src/nano/rpc/methods/account-info.ts` -> live behavior in
  `test/integration/nano/rpc/account-info.test.ts` (the `methods` segment is intentionally omitted)
- WebSocket schemas mirror into `test/unit/nano/web-socket/...`; topic integration tests sit directly under
  `test/integration/nano/web-socket/`.
- `WebSocketClient` has multiple behavior-oriented files under
  `test/integration/nano/web-socket/client/` rather than one monolithic mirrored test.

Mandatory policy:

- Every new feature must include corresponding tests.
- Every behavioral change must add or update tests.
- Every bug fix should include a regression test that fails without the fix whenever reasonably possible.
- Place tests in the correct mirrored category and use the `.test.ts` suffix.
- Decide whether the behavior requires unit tests, integration tests, or both.
- Unit tests should isolate schemas, converters, math/crypto functions, and other deterministic components where
  appropriate. Cover normal behavior, relevant boundaries, invalid input, throwing/non-throwing modes, and
  regression cases.
- Use integration tests when behavior crosses the RPC HTTP/node boundary, WebSocket protocol/transport boundary,
  schema-to-method inference boundary, or connection lifecycle. RPC features normally need request/response unit
  tests plus a method integration test.
- Do not weaken, delete, skip, or broadly rewrite existing tests merely to make a change pass. Existing disabled
  integration tests reflect explicit environment/protocol limitations; do not use them as precedent for
  disabling new coverage.
- Reuse `test/unit/test-data.ts`, `test/integration/test-data.ts`, `test/assert.ts`, WebSocket helpers, and nearby
  mock/server setup instead of creating incompatible fixture styles.

### Integration environment

Most RPC and topic-level WebSocket integration tests require a running Nano node with reachable public RPC and
WebSocket endpoints. Resolution order in `test/integration/config.ts` is:

1. `NANO_RPC_URL` / `NANO_WEB_SOCKET_URL`
2. npm-provided `package.json` config values (`config.nanoRpcUrl`, `config.nanoWebSocketUrl`)
3. `http://127.0.0.1:7076` / `ws://127.0.0.1:7078`

Enabled tests are intended not to require `enable_control=true`; control-only, expensive, or incompletely
implemented cases are already marked with `xdescribe`/`xtest` or commented in their files. Inspect the specific
test before enabling one.

`test/integration/nano/web-socket/client/` is different: it uses the dev-only `ws` package and local servers,
mostly on port `50123`; the timeout test starts `unresponsive-server.js` on `50124`. These tests can fail if those
ports are occupied and run serially to avoid collisions. Other WebSocket integration tests connect to the live
Nano endpoint.

## Common Change Workflows

### Add or change a primitive or block schema

1. Add/edit the schema in `src/nano/types/` or `src/nano/blocks/`, reusing existing primitive schemas.
2. Preserve the paired schema factory/inferred-type convention.
3. Update the area `index.ts` if public.
4. Add/update the mirrored unit test and shared `test/unit/test-data.ts` only when the fixture is broadly useful.
5. Search RPC, WebSocket, block, crypto, and example call sites for compatibility impact.

### Add or change a crypto/math operation

1. Put the public operation in `crypto/` or `math/`; keep byte encodings in `crypto/conversion/` and shared
   private logic unexported.
2. Preserve overload behavior (`throwOnError`, discriminated `Result`, and first-argument-dependent math return
   types where applicable).
3. Export intended public functions from the area barrel.
4. Add mirrored unit tests for valid vectors, invalid input, boundaries, and both error modes.
5. Update an example/README only when consumer guidance or the advertised feature set changes.

### Add or change an RPC method

1. Define the request schema/type in `src/nano/rpc/requests/<method>.ts`.
2. Define the response schema/type in `src/nano/rpc/responses/<method>.ts`. Model request-dependent fields with
   existing conditional response patterns.
3. Implement `src/nano/rpc/methods/<method>.ts`: simple fixed-shape methods use `postFunction`; dynamic response
   methods use typed overloads plus `post`.
4. Add the matching export to all three RPC barrels.
5. Add/update request and response unit tests in their mirrored directories.
6. Add/update `test/integration/nano/rpc/<method>.test.ts`; use `rpcUrl`, `rpcRequestConfig`, and integration
   fixtures. Do not enable control-sensitive calls against an ordinary node without deliberate setup.

### Add or change a WebSocket message/topic

1. Update the relevant `types/`, `requests/`, and `responses/` schemas and barrels.
2. For a new ack/topic, update every exhaustive map in `web-socket-client.ts`: schema maps, response type maps,
   and initialized listener maps.
3. Add mirrored schema unit tests.
4. Add/update live topic integration coverage and client dispatch/protocol coverage where applicable.
5. Test malformed incoming data as well as correctly typed dispatch when client parsing changes.

### Change a public API

Update the nearest barrel, root namespace assembly if needed, export tests, README/examples when applicable, and
all affected declarations/tests. Run the build and `npm run publish:dry` to catch a feature that works via source
imports but is absent from the package.

## Commands

Use npm; do not introduce a second lockfile.

```bash
# Clean install from package-lock.json (the prepare lifecycle also runs the build)
npm ci

# Lint src, tests, examples/configs covered by the flat config
npm run lint

# Apply configured ESLint/Prettier fixes
npm run lint:fix

# Convert repository text files to Unix/Linux LF line endings
npm run line-endings:lf

# Check line endings without modifying files
npm run line-endings:check

# Type-check without emitting (there is no dedicated package script)
npx tsc --noEmit

# Unit tests
npm run test:unit

# Integration tests (live node required for most protocol suites)
npm run test:integration

# Build dist/ from src/ (cleans dist first)
npm run build

# Release gate used by npm publishing: lint + unit tests + build
npm run prepublishOnly

# Inspect the package that npm would publish
npm run publish:dry
```

There is no single `test` or combined full-test script. Run both test commands when the environment supports live
integration tests. For a focused Jest run during development:

```bash
npx jest --runInBand --config jest.unit.config.ts test/unit/nano/types/account.test.ts
npx jest --runInBand --config jest.integration.config.ts test/integration/nano/rpc/account-info.test.ts
```

Do not publish from an agent task unless explicitly requested; `publish:dry` is the verification command.

## Validation Before Completion

Run the narrowest relevant test while developing, then the appropriate broader checks. For production changes,
the normal completion set is:

1. Targeted tests for the changed behavior.
2. `npm run test:unit`.
3. `npm run test:integration` when a reachable Nano node exists and the change affects RPC, WebSocket, transport,
   or live serialization behavior.
4. `npm run lint`.
5. `npx tsc --noEmit` or `npm run build`; run the build for package/export changes.
6. `npm run publish:dry` for public API, entry-point, dependency, or packaging changes.
7. `git diff --check`.

Documentation-only changes do not require protocol tests, but still require a relevant Markdown/format check when
available and `git diff --check`.

Never claim a check passed unless it was actually executed successfully. If a check cannot run, report exactly
which command was omitted or failed, why (for example, no live Nano node or occupied local port), and what remains
unverified.

## Change Discipline

- Keep changes focused; avoid unrelated refactors, renames, formatting churn, or lockfile refreshes.
- Inspect all call sites before changing a shared validator, converter, conditional type, transport, or public
  overload.
- Update related barrels, inferred types, schema options, response maps, tests, fixtures, examples, README, and
  third-party notices as the change requires.
- Reuse existing Zod primitives, `post`/`postFunction`, result types, converters, and WebSocket listener machinery.
- Avoid new dependencies unless the existing implementation cannot reasonably support the requirement. Remember
  that `blakejs` is the runtime dependency, `zod` is a peer dependency, and `ws` is a development dependency used
  for tests/custom injection.
- Do not edit `dist/` manually or commit it; `npm run build` generates it and `.gitignore` excludes it.
- Do not hide errors with `any`, unsafe casts, broad lint disables, skipped tests, or silent fallback behavior.
  Narrow, documented compatibility exceptions must match the surrounding architecture.
- Preserve protocol field names and exact runtime validation semantics. A type-only workaround is not a fix for
  an incorrect schema or transport behavior.
- Preserve existing third-party attribution and licensing comments/notices.

## Known Pitfalls and Navigation Hints

- A new RPC feature can compile in its own file but remain invisible unless all three RPC barrels are updated.
- RPC filenames are kebab-case, exported method functions are Nano action snake_case, and request/response schema
  symbols are PascalCase.
- Dynamic RPC response types are derived from literal request flags. Widening a request, losing `const` generic
  inference, or returning a broad union degrades the SDK's core IntelliSense behavior.
- `Nano.WebSocketClient` is a root convenience alias, while the same class is also available under
  `Nano.WebSocket`. Keep both paths compatible.
- Adding a WebSocket topic/ack requires synchronized manual updates in `web-socket-client.ts`; Zod barrels alone
  do not make typed dispatch work.
- Public imports must be tested through `src`/the `Nano` namespace, not only through deep source paths. The
  published package has no subpath exports.
- Unit tests mirror request and response schema directories, but RPC method integration tests intentionally omit
  the `methods/` directory level.
- WebSocket client integration tests use fixed localhost ports and are distinct from live-node WebSocket topic
  tests.
- Some integration files are deliberately disabled for control permissions, performance, missing live events, or
  incomplete node behavior. Read their comments before changing status.
- `examples/` import the package name and are not compiled by the source `tsconfig.json`; build success alone does
  not validate example code.
- Schema factories and inferred type aliases often have the same name. Preserve both value-space and type-space
  usage when moving or renaming them.
- The source includes adapted third-party crypto and reconnecting-WebSocket code. Small changes there have a wide
  compatibility surface and require focused regression coverage.

## Maintaining This File

`AGENTS.md` is living project documentation:

- Every coding agent must read it before substantial work in this repository.
- During every change, decide whether new architectural knowledge belongs here.
- Add important new components, directories, abstractions, workflows, public API/export conventions, test
  patterns, build requirements, and architectural decisions.
- If a change makes a statement, path, command, or workflow inaccurate, update the relevant section in the same
  change.
- Agents may edit, reorganize, replace, or remove outdated sections. Current accuracy is more important than
  preserving obsolete wording.
- Keep the file entirely in English, concise enough to scan at session start, and organized by durable topic
  rather than as a chronological log.

When a user gives feedback that agents should generally behave differently in this repository, handle a recurring
task category differently, follow an additional convention, or avoid repeating a mistake, evaluate whether it is
durable guidance. If it applies to future nano-sdk work, document it here so later sessions retain the expectation.
Do not add temporary, task-specific, personal, or one-off instructions that would not help future repository work.
