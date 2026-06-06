# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 2.x     | ✅ Active support  |
| 1.x     | ❌ No longer supported |

## Reporting a Vulnerability

If you discover a security vulnerability in QuantumScore, please report it responsibly:

1. **Do NOT** open a public GitHub issue for security vulnerabilities.
2. Email your findings to the repository maintainer via GitHub's private messaging or through the contact information on the maintainer's profile.
3. Include:
   - A description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge receipt within **48 hours** and aim to provide a fix or mitigation plan within **7 days**.

## Scope

This policy applies to:

- The QuantumScore web application (frontend, backend, ML service)
- API endpoints exposed by the backend and ML service
- Data handling and storage

## Best Practices

When deploying QuantumScore:

- Never commit `.env` files with real credentials
- Use HTTPS in production
- Keep dependencies up to date
- Run the ML service behind a reverse proxy in production
