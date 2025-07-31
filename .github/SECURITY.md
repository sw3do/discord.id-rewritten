# Security Policy

## Supported Versions

We actively support the following versions of discord.id-rewritten:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT create a public issue

Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### 2. Report privately

Instead, please report security vulnerabilities by:

- **Email:** Send details to [sw3doo@gmail.com]
- **GitHub Security Advisory:** Use GitHub's private vulnerability reporting feature
- **Discord:** Contact @sw3do directly on Discord

### 3. Include detailed information

Please include as much information as possible:

- Type of vulnerability
- Steps to reproduce the vulnerability
- Potential impact
- Suggested fix (if you have one)
- Your contact information

### 4. Response timeline

We will respond to security reports within:

- **24 hours:** Initial acknowledgment
- **72 hours:** Initial assessment and severity classification
- **7 days:** Detailed response with timeline for fix

## Security Considerations

### Discord API Security

- Never expose Discord bot tokens or API keys
- Implement proper rate limiting
- Validate all user inputs
- Use HTTPS for all API communications
- Handle Discord API errors securely

### User Data Protection

- Minimize data collection
- Don't store sensitive Discord user information
- Implement proper data sanitization
- Follow Discord's Terms of Service and Privacy Policy

### Application Security

- Keep dependencies up to date
- Implement proper input validation
- Use secure coding practices
- Regular security audits
- Proper error handling without information disclosure

## Scope

This security policy applies to:

- The main discord.id-rewritten application
- All related APIs and services
- Discord integrations and bot functionality
- User data handling and storage

## Out of Scope

- Third-party services (Discord, Lanyard, etc.)
- User's own Discord account security
- Issues in dependencies (report to respective maintainers)
- Social engineering attacks

## Security Best Practices for Contributors

### Code Security

- Never commit secrets, tokens, or API keys
- Use environment variables for sensitive configuration
- Implement proper input validation
- Follow secure coding guidelines
- Review code for potential security issues

### Discord Integration Security

- Use Discord's official API endpoints
- Implement proper OAuth2 flows
- Handle rate limits appropriately
- Validate Discord webhook signatures
- Don't expose internal Discord data

### Dependencies

- Regularly update dependencies
- Use `npm audit` to check for vulnerabilities
- Review new dependencies before adding
- Use lock files to ensure consistent builds

## Disclosure Policy

When we receive a security report:

1. We will work with the reporter to understand and reproduce the issue
2. We will develop and test a fix
3. We will coordinate disclosure timing with the reporter
4. We will credit the reporter (unless they prefer to remain anonymous)
5. We will publish a security advisory after the fix is released

## Security Updates

Security updates will be:

- Released as soon as possible
- Clearly marked as security releases
- Documented with severity and impact information
- Communicated through GitHub releases and security advisories

## Contact

For security-related questions or concerns:

- **Maintainer:** @sw3do
- **Email:** [sw3doo@gmail.com]
- **GitHub:** [@sw3do](https://github.com/sw3do)

## Acknowledgments

We appreciate the security research community and will acknowledge researchers who help improve our security:

- Responsible disclosure researchers will be credited in our security advisories
- We may provide recognition on our project page
- Significant contributions may be eligible for bounties (if program exists)

Thank you for helping keep discord.id-rewritten secure!