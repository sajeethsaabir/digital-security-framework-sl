# Digital Security Framework — Sri Lanka

A web application that turns the *Digital Security Toolkit v1.0* (Sri Lanka) into an
interactive digital safety guide. It helps everyday internet users in Sri Lanka respond
to cyberattacks, protect their data, prevent threats, report incidents, and build good
digital security habits.

The application consists of two projects:


## Security notes

- Auth sessions use `httpOnly`, `secure`, `SameSite=Strict` cookies; passwords are
  hashed with salted, iterated SHA-256.
- The frontend middleware (`src/proxy.ts`) adds CSP, HSTS, and other security headers
  and enforces CSRF origin checks on JSON `POST` requests.
- Seed scripts and backend validate/sanitize user input (email format, password
  strength, name escaping, SQL injection guards, rate limiting).
