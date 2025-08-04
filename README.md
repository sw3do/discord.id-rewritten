# Discord.ID - Discord User Information Viewer

[![GitHub stars](https://img.shields.io/github/stars/sw3do/discord.id-rewritten?style=social)](https://github.com/sw3do/discord.id-rewritten/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sw3do/discord.id-rewritten?style=social)](https://github.com/sw3do/discord.id-rewritten/network/members)
[![GitHub issues](https://img.shields.io/github/issues/sw3do/discord.id-rewritten)](https://github.com/sw3do/discord.id-rewritten/issues)
[![GitHub license](https://img.shields.io/github/license/sw3do/discord.id-rewritten)](https://github.com/sw3do/discord.id-rewritten/blob/main/LICENSE)

A modern web application that allows you to view comprehensive Discord user information by entering a Discord user ID.

## ✨ Features

- 🎨 **Modern & Responsive Design** - Built with Tailwind CSS 4
- 🔍 **Discord User Search** - Search by Discord user ID
- 👤 **Complete User Profiles** - Avatar, banner, username, discriminator, and more
- 🏆 **Discord Badges Display** - Shows all Discord badges and achievements
- 🎭 **Avatar Decorations** - Support for Discord avatar decorations
- 🎮 **Activity Status** - Real-time Discord activity via Lanyard API
- 📱 **Mobile Responsive** - Optimized for all device sizes
- ⚡ **Fast Performance** - Powered by Nuxt.js 4 and Bun
- 🔒 **Privacy Focused** - No data storage, real-time fetching

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [Node.js](https://nodejs.org/) 22+ (for compatibility)
- Discord Application (for API access)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sw3do/discord.id-rewritten.git
   cd discord.id-rewritten
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Discord bot token:
   ```env
   DISCORD_BOT_TOKEN=your_actual_bot_token_here
   ```

4. **Start the development server:**
   ```bash
   bun run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to the "Bot" section
4. Copy your bot token
5. Add the token to your `.env` file

### Environment Variables

```env
# Required
DISCORD_BOT_TOKEN=your_discord_bot_token
```

## 📖 Usage

1. **Enter a Discord User ID** in the search field
2. **Click "Search User"** to fetch user information
3. **View comprehensive user data** including:
   - Profile information (avatar, banner, username)
   - Discord badges and achievements
   - Account creation date
   - Activity status (if available via Lanyard)
   - Avatar decorations

### How to Find a Discord User ID

1. Enable Developer Mode in Discord (Settings > Advanced > Developer Mode)
2. Right-click on a user and select "Copy User ID"

## 🛠️ Tech Stack

- **Framework:** [Nuxt.js 4](https://nuxt.com/) - Vue.js meta-framework
- **Frontend:** [Vue.js 3](https://vuejs.org/) - Progressive JavaScript framework
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- **Runtime:** [Bun](https://bun.sh/) - Fast JavaScript runtime
- **API:** [Discord API v10](https://discord.com/developers/docs) - Official Discord API
- **Activity Data:** [Lanyard API](https://github.com/Phineas/lanyard) - Discord presence API

## 🎯 API Endpoints

### Discord User Information
```
GET /api/discord/[id]
```
Fetches comprehensive Discord user information including badges, profile data, and more.

## 🏆 Discord Badges Support

This application displays all Discord badges including:

- **Staff Badges:** Discord Staff, Moderator Programs Alumni
- **Program Badges:** Partner, Verified Bot Developer, Early Verified Bot Developer, Active Developer
- **Community Badges:** HypeSquad Events, HypeSquad Houses (Bravery, Brilliance, Balance), Bug Hunter (Tier 1 & 2)
- **Subscription Badges:** Nitro (all tiers), Early Supporter
- **Bot Badges:** Verified Bot, Bot HTTP Interactions, Uses Automod
- **Team Badges:** Team User
- **Special Badges:** Quest completion, Orbs Apprentice, and more

Badge data and images are sourced from the comprehensive [discord-badges](https://github.com/mezotv/discord-badges) repository.

## 🔗 Useful Resources

- **[Discord Badges Collection](https://github.com/mezotv/discord-badges)** - Complete Discord badges reference
- **[Lanyard API](https://github.com/Phineas/lanyard)** - Discord presence and activity API
- **[Discord Developer Documentation](https://discord.com/developers/docs)** - Official Discord API docs
- **[Discord.js Guide](https://discordjs.guide/)** - Discord bot development guide

## 🚀 Deployment

### Build for Production

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sw3do/discord.id-rewritten)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sw3do/discord.id-rewritten)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](.github/CONTRIBUTING.md) before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview production build
```

## 🐛 Issues & Support

If you encounter any issues or need support:

1. Check [existing issues](https://github.com/sw3do/discord.id-rewritten/issues)
2. Create a [new issue](https://github.com/sw3do/discord.id-rewritten/issues/new/choose) using our templates
3. Join our Discord server for community support

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/sw3do/discord.id-rewritten)
![GitHub code size](https://img.shields.io/github/languages/code-size/sw3do/discord.id-rewritten)
![GitHub last commit](https://img.shields.io/github/last-commit/sw3do/discord.id-rewritten)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/sw3do/discord.id-rewritten)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**sw3do** - [GitHub Profile](https://github.com/sw3do)

---

⭐ **Star this repository if you find it helpful!**

*Made with ❤️ for the Discord community*
