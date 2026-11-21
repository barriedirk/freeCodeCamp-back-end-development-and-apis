# JWT Authentication API

A small Express API demonstrating access tokens and rotating refresh tokens.

## Setup

Install dependencies:

```sh
npm install
```

Create a `.env` file with:

```env
PORT=3000
JWT_SECRET=replace-with-a-long-random-secret
```

`JWT_REFRESH_SECRET` is optional. If it is not set, the API derives a separate
refresh-token signing key from `JWT_SECRET`. For production, configure both
secrets independently and keep them private.

Start the API:

```sh
npm start
```

Open the API tester at [http://localhost:3000/public/](http://localhost:3000/public/)
(replace `3000` if you configured a different port).

## Authentication

Register or log in to receive an access token and a refresh token:

```http
POST /api/auth/register
Content-Type: application/json

{"email":"person@example.com","password":"your-password"}
```

```http
POST /api/auth/login
Content-Type: application/json

{"email":"person@example.com","password":"your-password"}
```

Successful responses include `accessToken` and `refreshToken`. The legacy
`token` response field is also returned as an alias for `accessToken`.

Use the access token for protected endpoints:

```http
GET /api/auth/profile
Authorization: Bearer <accessToken>
```

Access tokens expire after 15 minutes. When one expires, exchange the current
refresh token for a new pair:

```http
POST /api/auth/refresh
Content-Type: application/json

{"refreshToken":"<refreshToken>"}
```

Refresh tokens expire after 7 days and are single-use: each successful refresh
invalidates the submitted token and returns a replacement. Store the new
refresh token and use it for the next refresh. Reuse of a rotated token revokes
the entire session, including its remaining refresh tokens and access tokens.

Log out with the access token:

```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

Logout revokes the refresh-token session and invalidates the access token.

## Storage and tests

This example stores users in `data/users.json` and refresh-token session state
in `data/refresh-tokens.json`; both data files are ignored by Git. Run the tests
with:

```sh
npm test
```

The JSON storage is intended for demonstration and single-process use. A
production or multi-instance deployment should use a shared database with
atomic refresh-token rotation.

## Security notes

The API uses `helmet()` for HTTP security headers. Helmet's defaults include a
Content-Security-Policy, `X-Frame-Options: SAMEORIGIN`, and
`Strict-Transport-Security` (HSTS). Browsers only honor HSTS when it is received
over HTTPS, so it does not secure a plain-HTTP localhost connection. In
production, serve the API over HTTPS and enable `includeSubDomains` only if all
subdomains are also HTTPS-capable.

The API currently returns access and refresh tokens in JSON, and the tester
keeps them in JavaScript-accessible page fields. It does not use cookies, so
cookie attributes such as `HttpOnly` and `SameSite` do not apply. Since the
client explicitly sends the access token in an `Authorization` header, the
browser does not automatically attach it to cross-site requests; this reduces
the usual CSRF risk. CORS is not needed while the tester and API are served
from the same origin, and CORS alone is not a CSRF defense.

JavaScript-accessible tokens can be exposed by an XSS vulnerability. Password
masking only hides a token visually; it does not prevent scripts from reading
it. If refresh tokens are moved to cookies, use `HttpOnly`, `Secure` over
HTTPS, and an appropriate `SameSite` setting, and add CSRF defenses such as
Origin validation and a CSRF token. If the frontend is moved to another origin,
allow only that specific origin in CORS rather than using a wildcard with
credentials.
