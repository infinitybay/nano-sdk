<a name="nano-sdk"></a>
# nano-sdk

Production-grade TypeScript SDK for interacting with a **Nano** node, providing fully typed and runtime-validated RPC and WebSocket APIs, a built-in WebSocket client with typed ack and topic listeners, and utilities for blocks, cryptography, and safe raw amount arithmetic.

<a name="installation"></a>
## Installation

```bash
npm i nano-sdk zod
```

<a name="quick-start"></a>
## Quick Start

```ts
import { Nano } from "nano-sdk";

const nanoRpcUrl = "http://127.0.0.1:7076";

// Alias
type AccountString = Nano.Types.AccountString;
const AccountString = Nano.Types.AccountString();

async function fetchAccountBalance(account: AccountString) {
  // 1) Validate user input
  const validatedAccount = AccountString.parse(account);

  // 2) Typed RPC call
  const response = await Nano.RPC.account_balance(
    nanoRpcUrl,
    {
      action: "account_balance",
      account: validatedAccount,
      include_only_confirmed: true,
    },
    { timeoutInMs: 2000 }
  );

  // 3) Convert and format raw balance
  const balanceInNano = Nano.Math.rawToNano({ raw: response.balance, decimalPlaces: 6 });

  // 4) Output balanceInNano
  console.log("Balance (Nano):", balanceInNano);
}

fetchAccountBalance("nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3").catch((err) => console.error("Unexpected failure:", err));
```

<a name="typed-rpc-example"></a>
## Typed & Runtime-Validated RPC

RPC requests and responses are fully typed and validated at runtime. Response types are derived from the corresponding request parameters, meaning the shape of the response object adapts based on the options you provide.

![Typed RPC Response IntelliSense](./images/rpc-response-intellisense.gif)

<a name="overview"></a>
## Overview & Features

The SDK uses a single root namespace (**Nano**), organized into sub-namespaces, each focused on a specific responsibility:

- `Nano.Blocks`: Block schemas (**Zod**) and state-block creation helpers
- `Nano.Crypto`: Key derivation, block hashing, signing, and verification utilities
- `Nano.Math`: Raw amount conversion, formatting, and safe raw arithmetic
- `Nano.RPC`: **Nano** node RPC methods (HTTP POST), with typed requests and typed responses
- `Nano.Types`: Runtime validators for common **Nano** primitives (account, hash, keys, raw amounts, etc.)
- `Nano.WebSocket`: Fully typed **Nano** node WebSocket request and response schemas, including acknowledgement and topic message definitions
- `Nano.WebSocketClient`: Instantiable WebSocket client providing fully typed acknowledgement and topic-based message handling using the `Nano.WebSocket` schemas

<a name="smaller-application-bundles"></a>
## Smaller Application Bundles

Applications that only use one SDK area can import that domain explicitly instead of loading the complete `Nano`
namespace:

```ts
import { rawPlus } from "nano-sdk/math";
import { HashString } from "nano-sdk/types";
```

These explicit module imports limit the Nano SDK code that a bundler needs to include in the compiled application.
This can reduce the application's JavaScript bundle size and therefore its storage and download footprint. The
actual reduction depends on the selected modules and the application's build tool.

The available domain entry points are:

- `nano-sdk/blocks`
- `nano-sdk/crypto`
- `nano-sdk/math`
- `nano-sdk/rpc`
- `nano-sdk/types`
- `nano-sdk/web-socket`

<a name="rpc"></a>
## RPC Usage

All RPC methods:

- validate requests using **Zod**
- perform an HTTP POST (default: native `fetch`)
- detect and handle post errors
- validate responses using **Zod**

All RPC methods follow a consistent signature:

`Nano.RPC.<method>(rpcUrl, request, config?)`

- `rpcUrl` – **Nano** node RPC endpoint
- `request` – typed request object (including `action`)
- `config` *(optional)* – request behavior and transport options

### Error Handling

By default, RPC calls throw `Nano.RPC.Error` for:

- Invalid request payloads
- HTTP or transport errors
- **Nano** node error responses
- Invalid or unexpected response data

Blocks, crypto, and math use the same throwing/non-throwing pattern with their own error types. Every domain exposes
its error class as `Error` and its stable string enum as `ErrorCode` (for example, `Nano.Crypto.Error` and
`Nano.Crypto.ErrorCode`).

Set `throwOnError: false` to receive a discriminated result instead. Successful results contain `data`; failures
contain an error with the same `code` and `message` as the thrown error (RPC results use
`{ success: false, error: { code, message } }`). TypeScript narrows both the result and the method-specific set of
possible codes. Messages are intended for people and may change, so application logic should compare enum members:

```ts
const result = Nano.Math.rawMinus({ raw: "1", subtrahend: "2", throwOnError: false });
if (!result.success && result.error.code === Nano.Math.ErrorCode.NegativeResult) {
  // Handle underflow.
}
```

Nano node error responses use `Nano.RPC.ErrorCode.NodeError` and preserve the node's free-form message. If one SDK
domain wraps a failure from another, its operation-level error retains the original error as `cause`.

### Request config

The optional config supports:

- `throwOnError` – true (default) throws, false returns `{ success, data / error }`
- `timeoutInMs` – HTTP timeout
- `abortSignal` – cancellation via AbortController
- `headers` – custom HTTP headers merged with the default JSON content type
- `httpClient` – custom HTTP transport

By default, errors throw `Nano.RPC.Error`.

### Custom HTTP headers

Custom HTTP headers, such as bearer tokens required by authenticated RPC providers, can be passed directly through the RPC request configuration:

```ts
const response = await Nano.RPC.account_balance(
  nanoRpcUrl,
  {
    action: "account_balance",
    account: account,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```

### Custom HTTP client

RPC methods accept a custom `httpClient` via the request config. See the `axios` example in

- [`axios-http-client.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/rpc/axios-http-client.example.ts)

### Custom RPCs

Non-standard RPC providers can be integrated by defining custom Zod request and response schemas and passing them
to `Nano.RPC.postFunction`. For example, Nano.to extends and changes parts of the official Nano Node RPC API; the
[`custom-rpc.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/rpc/custom-rpc.example.ts)
example demonstrates how to integrate its custom `work_generate` action.

### Examples

- [`account-info.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/rpc/account-info.example.ts)
- [`custom-rpc.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/rpc/custom-rpc.example.ts)
- [`version.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/rpc/version.example.ts)

<a name="websocket"></a>
## WebSocket Usage

`Nano.WebSocket` provides a complete, strongly typed implementation of all **Nano** node WebSocket request and response schemas and ships with a built-in `WebSocketClient`. By default, the client uses the globally available `WebSocket` implementation provided by the current runtime environment (browser or Node.js).

The `WebSocketClient` exposes **fully typed WebSocket interactions** through two complementary listener APIs:

- **Ack listeners** for handling typed acknowledgement messages returned by the node when a WebSocket action explicitly requests an acknowledgement (`subscribe`, `unsubscribe`, `update`, or `pong`)
- **Topic listeners** for typed streaming subscriptions, including `bootstrap`, `confirmation`, `new_unconfirmed_block`, `started_election`, `stopped_election`, `telemetry`, `work`, and `vote`

All incoming messages are validated and typed based on the corresponding WebSocket schemas, enabling safe, ergonomic access to response data without manual parsing or casting.

![Typed WebSocket Response IntelliSense](./images/web-socket-response-intellisense.gif)

### Available options

```ts
const ws = new Nano.WebSocketClient(webSocketUrl, undefined, {
  webSocketClass: undefined, // WebSocket constructor, if none provided, defaults to global WebSocket
  connectionTimeout: 4000, // retry connect if not connected after this time, in ms
  minUptime: 5000, // min time in ms to consider connection as stable
  maxEnqueuedMessages: Infinity, // maximum number of messages to buffer until reconnection
  maxReconnectionAttempts: Infinity, // maximum number of reconnection attempts
  maxReconnectionDelay: 10000, // max delay in ms between reconnections
  minReconnectionDelay: 1000 + Math.random() * 4000, // min delay in ms between reconnections
  reconnectionDelayGrowFactor: 1.3, // how fast the reconnection delay grows
  startClosed: false, // start websocket in CLOSED state, call `.reconnect()` to connect
});
```

### Examples

- [`typed-ack-and-topic-listeners.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/web-socket/typed-ack-and-topic-listeners.example.ts)
- [`custom-web-socket-client.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/web-socket/custom-web-socket-client.example.ts)

<a name="validation"></a>
## Validation & Typing

`Nano.Types` provides a collection of **reusable Zod schemas** for common **Nano-specific primitives**. These schemas form the foundation for higher-level features such as cryptography and RPC validation. Use them to validate external input and to type values throughout your codebase:

- Prefer `.parse(...)` when invalid input should throw immediately
- Prefer `.safeParse(...)` when you want a typed success/failure result without throwing

The available schemas cover a wide range of Nano primitives, including but not limited to:

- `AccountString`, `RawAmountString`, `NanoAmountString`, `PrivateKeyString`, `PublicKeyString`, `SignatureString`, `HashString`, `HexString`, ...

### Examples

- [`alias-and-safe-parse.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/types/alias-and-safe-parse.example.ts)

<a name="math"></a>
## Math

`Nano.Math` provides safe arithmetic, comparison, and formatting utilities for **nano** and **raw** amounts.

**Raw** amounts can be represented as **strings** (`RawAmountString`, to remain JSON-serializable) and native `BigInt` values (`RawAmount`).

**Nano** amounts are represented as **strings** (`NanoAmountString`) to avoid precision issues and eliminate the need for a `BigNumber.js` dependency.

All raw functions support **mixed inputs** (`RawAmount` and `RawAmountString`).
The **type of the first parameter** of arithmetic functions determines the return type:
- If the first `raw` parameter is a `RawAmount` (`BigInt`), the result is returned as `BigInt`
- If the first `raw` parameter is a `RawAmountString` (`String`), the result is returned as `String`

Available utilities:

- Conversion: `nanoToRaw`, `rawToNano`
- Formatting: `formatRaw`
- Arithmetic (with bounds checking):  
  `rawPlus`, `rawMinus`, `rawMultiply`, `rawDivide`, `rawModulo`
- Comparisons:  
  `rawIsZero`, `rawIsGreaterThan`, `rawIsGreaterThanOrEqualTo`, `rawIsLessThan`, `rawIsLessThanOrEqualTo`, `rawIsEqualTo`

### Examples

- [`format-raw.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/math/format-raw.example.ts)
- [`raw-arithmetic.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/math/raw-arithmetic.example.ts)
- [`raw-comparison.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/math/raw-comparison.example.ts)

<a name="crypto"></a>
## Crypto

`Nano.Crypto` provides cryptographic utilities commonly needed when building **Nano**-related services:

- Key pair generation and deterministic key derivation
- Block hashing and hash verification
- Block signing and signature verification
- Block verification (combines hash, link, and signature validation for state blocks into a single method call)
- Proof-of-work hash verification

### Examples

- [`derive-account-from-seed.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/crypto/derive-account-from-seed.example.ts)
- [`hash-and-verify-hash.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/crypto/hash-and-verify-hash.example.ts)
- [`sign-and-verify-signature.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/crypto/sign-and-verify-signature.example.ts)
- [`verify-block.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/crypto/verify-block.example.ts)

## Blocks

`Nano.Blocks` provides predefined Zod schemas for composing and validating **Nano** block variants. All schemas are provided as composable building blocks and can be used as a base to define extended schemas with additional custom fields.

Available block schemas:

- `StateBlock`
- `LegacySendBlock`, `LegacyReceiveBlock`, `LegacyOpenBlock`, `LegacyChangeBlock`
- `Block` as a union of all supported block variants

`createOpenBlock`, `createSendBlock`, `createReceiveBlock`, and `createChangeBlock` validate and create new state
blocks. They only support complete `StateBlock` inputs; legacy blocks are not supported.
Send, receive, and change use the account's latest `frontierBlock`. Open uses the funding `sendBlock`, while
receive needs both the destination `frontierBlock` and the complete source `sendBlock`.

Pass `privateKey` to sign during creation or omit it and sign the returned block later with
`Nano.Crypto.signBlock` or the lower-level `Nano.Crypto.signHash`. Open requires an explicit
`representative`; the other helpers inherit it where possible. Pass `{ throwOnError: false }` to receive a
`Result<StateBlock, Nano.Blocks.Error>` instead of throwing.

Created blocks contain zero work so proof of work can be generated independently and assigned afterward. For
local PoW without an external work server, install
[`nano-pow`](https://www.npmjs.com/package/nano-pow) with `npm i nano-pow`. It supports local generation through
WebGPU, WebGL, WASM, or CPU depending on the environment. See the NanoPow example for the different work roots
used by open and subsequent blocks.

### Examples

- [`create-state-blocks.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/blocks/create-state-blocks.example.ts)
- [`create-state-block-with-nano-pow.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/blocks/create-state-block-with-nano-pow.example.ts)
- [`state-block-with-hash.example.ts`](https://github.com/infinitybay/nano-sdk/blob/master/examples/blocks/state-block-with-hash.example.ts)

<a name="testing"></a>
## Testing

- Unit tests (`test/unit`) cover schemas, math edge cases, crypto utilities, and parsing/validation flows (throwing and non-throwing).
- Integration tests (`test/integration`) verify both **RPC** and **WebSocket** functionality against a real **Nano** node, ensuring request and response schemas match live node behavior.

Unit tests are executed using:

```bash
npm run test:unit
```

Integration test requirements:

- A running **Nano** node is required.
- All public **Nano** RPC and WebSocket endpoints must be reachable. `enable_control=true` is **not** required for any currently enabled integration tests.
- The RPC endpoint URL can be configured via the `config.nanoRpcUrl` field in `package.json` or via the `NANO_RPC_URL` environment variable. The environment variable takes precedence if both are set.
- The WebSocket endpoint URL can be configured via the `config.nanoWebSocketUrl` field in `package.json` or via the `NANO_WEB_SOCKET_URL` environment variable. The environment variable takes precedence if both are set.

Integration tests for RPC and WebSocket are executed together using:

```bash
npm run test:integration
```

<a name="links"></a>
## Links

- npm: https://www.npmjs.com/package/nano-sdk
- GitHub: https://github.com/infinitybay/nano-sdk
- Nano Node RPC Protocol: https://docs.nano.org/commands/rpc-protocol/
- Nano Node WebSockets Integration Guide: https://docs.nano.org/integration-guides/websockets/
