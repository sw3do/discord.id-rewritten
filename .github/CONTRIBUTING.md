# Contributing to discord.id-rewritten

Thank you for your interest in contributing to discord.id-rewritten! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites
- Node.js (latest LTS version)
- npm or yarn package manager
- Git
- Basic knowledge of Vue.js/Nuxt.js
- Understanding of Discord API (helpful but not required)

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/discord.id-rewritten.git
   cd discord.id-rewritten
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

## How to Contribute

### Reporting Bugs
- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include detailed steps to reproduce
- Provide environment information
- Add screenshots if applicable

### Suggesting Features
- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Clearly describe the feature and its benefits
- Consider Discord integration aspects
- Provide use cases and examples

### Submitting Pull Requests

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Test your changes thoroughly:
   - Test on different screen sizes
   - Test with various Discord user profiles
   - Verify Discord API integrations work correctly

4. Commit your changes:
   ```bash
   git commit -m "feat: add new Discord badge display feature"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request using our [PR template](.github/PULL_REQUEST_TEMPLATE.md)

## Coding Standards

### General Guidelines
- Write clean, readable code
- Follow existing code style and patterns
- Add comments for complex logic
- Use meaningful variable and function names
- Keep functions small and focused

### Vue.js/Nuxt.js Specific
- Use Composition API when possible
- Follow Vue.js style guide
- Use TypeScript for type safety
- Implement proper error handling
- Optimize for performance

### Discord Integration
- Handle API rate limits properly
- Implement proper error handling for Discord API calls
- Cache responses when appropriate
- Follow Discord API best practices
- Test with different user scenarios

## Discord-Specific Contributions

### Working with Discord Badges
- Reference: [discord-badges](https://github.com/mezotv/discord-badges)
- Ensure proper badge rendering
- Handle missing or invalid badges gracefully
- Test with users having different badge combinations

### Lanyard Integration
- Reference: [Lanyard API](https://github.com/Phineas/lanyard)
- Handle offline/online status changes
- Implement proper WebSocket connections
- Cache activity data appropriately
- Handle API failures gracefully

### Discord API Usage
- Follow Discord API rate limits
- Implement proper authentication
- Handle API errors appropriately
- Use latest API version when possible
- Document any new endpoints used

## Testing

### Manual Testing
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on different devices (desktop, mobile, tablet)
- Test with different Discord user profiles
- Verify all Discord integrations work correctly

### Automated Testing
- Write unit tests for new functions
- Add integration tests for API calls
- Ensure all tests pass before submitting PR

## Documentation

- Update README.md if adding new features
- Document any new configuration options
- Add inline code comments for complex logic
- Update API documentation if applicable

## Resources

### Useful Links
- [Discord Developer Documentation](https://discord.com/developers/docs)
- [Discord Badges Reference](https://github.com/mezotv/discord-badges)
- [Lanyard API Documentation](https://github.com/Phineas/lanyard)
- [Nuxt.js Documentation](https://nuxt.com/docs)
- [Vue.js Documentation](https://vuejs.org/guide/)

### Community
- Join our Discord server for discussions
- Follow project updates on GitHub
- Check existing issues before creating new ones

## Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Follow GitHub's community guidelines

## Questions?

If you have questions, please:
1. Check existing documentation
2. Search through existing issues
3. Create a [Question issue](.github/ISSUE_TEMPLATE/question.md)
4. Join our Discord server for real-time help

Thank you for contributing to discord.id-rewritten!