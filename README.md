# 📊 GitHub Language Stats API

<div align="center">
  <img src="https://img.shields.io/badge/API-GraphQL-E10098?style=for-the-badge&logo=graphql" alt="GraphQL">
  <img src="https://img.shields.io/badge/Runtime-Node.js_18-339933?style=for-the-badge&logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/Platform-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel">
  <img src="https://img.shields.io/badge/API-GitHub_GraphQL_v4-181717?style=for-the-badge&logo=github" alt="GitHub API">
  <img src="https://img.shields.io/badge/Toolkit-@octokit/graphql-24292F?style=for-the-badge" alt="Octokit">
    <img src="https://github.com/NTT-DevFPT/github-lang-stats-api/actions/workflows/ci.yml/badge.svg" alt="CI">
</div>

<div align="center">
  <h3>🌐 <a href="https://github-lang-stats-api.vercel.app">Live API</a></h3>
  <p><em>Custom GitHub Language Statistics API with Smart Caching</em></p>
</div>

---

## 📖 About The Project

**GitHub Lang Stats API** is a custom-built serverless API service that aggregates programming language statistics from your personal and organization repositories using GitHub's GraphQL API v4. Unlike standard GitHub stats, this API provides comprehensive language breakdowns with intelligent caching for optimal performance.

Built with modern web technologies and deployed on Vercel's edge network, this API delivers fast, reliable language statistics that can be easily integrated into GitHub profile READMEs, portfolio websites, or data visualization dashboards.

### 🎯 Key Advantages

- **Organization Support**: Aggregates stats from both personal and organization repositories
- **Smart Caching**: 30-minute cache with cache-control headers for reduced API calls
- **GraphQL Efficiency**: Single API call fetches all required data
- **SVG Rendering**: Generates beautiful SVG cards for direct embedding
- **Zero Configuration**: Simply deploy and use with your GitHub username

---

## ✨ Features

### 📊 **Comprehensive Statistics**
- Aggregates language data across all accessible repositories
- Calculates total bytes and percentage for each language
- Supports both personal and organization repositories
- Excludes forked repositories for accurate representation
- Real-time data fetching from GitHub

### ⚡ **Performance Optimization**
- **Smart Caching**: Results cached for 30 minutes to minimize API usage
- **GraphQL Efficiency**: Single query fetches all repository data
- **Edge Deployment**: Serverless functions on Vercel edge network
- **Fast Response**: Typical response time < 500ms (cached)
- **Rate Limit Handling**: Implements GitHub API best practices

### 🎨 **Visual Rendering**
- SVG card generation for GitHub README embedding
- Clean, modern design with color-coded languages
- Responsive layout that works on all devices
- Percentage bars for visual comparison
- Customizable themes and colors

### 🔧 **Developer Friendly**
- Simple REST API endpoints
- JSON response format
- CORS enabled for web applications
- Detailed error messages
- TypeScript definitions (optional)

---

## 🛠️ Tech Stack

### **Core Technologies**
- **Node.js 18**: Modern JavaScript runtime with native fetch
- **Vercel Serverless**: Scalable serverless function deployment
- **GitHub GraphQL API v4**: Efficient data fetching with single query
- **@octokit/graphql**: Official GitHub GraphQL client

### **API Features**
- GraphQL for efficient data aggregation
- Serverless architecture for automatic scaling
- Edge caching for improved performance
- Environment variable configuration

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js (v18 or higher)
node --version

# Vercel CLI (optional for local testing)
npm install -g vercel
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/NTT-DevFPT/github-lang-stats-api.git
cd github-lang-stats-api
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

**Getting a GitHub Token:**
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic)
3. Select scopes: `read:user`, `repo` (for private repos)
4. Copy the token and add to `.env`

4. **Run locally with Vercel**
```bash
vercel dev
```

5. **Access the API**
```
http://localhost:3000/api?username=YOUR_GITHUB_USERNAME
```

---

## 📝 API Documentation

### Base URL
```
https://github-lang-stats-api.vercel.app
```

### Endpoints

#### Get Language Statistics (JSON)

```http
GET /api?username={username}
```

**Parameters:**
- `username` (required): GitHub username

**Response:**
```json
{
  "username": "NTT-DevFPT",
  "totalRepos": 5,
  "languages": {
    "JavaScript": {
      "bytes": 125340,
      "percentage": 45.2
    },
    "Java": {
      "bytes": 98720,
      "percentage": 35.6
    },
    "TypeScript": {
      "bytes": 53210,
      "percentage": 19.2
    }
  },
  "totalBytes": 277270,
  "cachedAt": "2025-11-21T09:00:00Z"
}
```

#### Get Language Statistics (SVG)

```http
GET /api/svg?username={username}
```

**Parameters:**
- `username` (required): GitHub username
- `theme` (optional): `light` | `dark` (default: `light`)

**Usage in GitHub README:**
```markdown
![Language Stats](https://github-lang-stats-api.vercel.app/api/svg?username=NTT-DevFPT)
```

---

## 📋 How It Works

### Data Aggregation Process

1. **GraphQL Query**: Single query fetches all repositories with language data
2. **Repository Filtering**: Excludes forks, processes only accessible repos
3. **Language Aggregation**: Sums up bytes for each language across all repos
4. **Percentage Calculation**: Computes percentage based on total bytes
5. **Cache Storage**: Results cached with 30-minute TTL
6. **Response Format**: Returns JSON or renders SVG card

### GraphQL Query Structure

```graphql
query($username: String!) {
  user(login: $username) {
    repositories(first: 100, ownerAffiliations: [OWNER, ORGANIZATION_MEMBER]) {
      nodes {
        name
        isFork
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}
```

---

## 🛡️ Deployment

### Deploy to Vercel

1. **Fork this repository**

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your forked repository

3. **Add Environment Variables**
   - Add `GITHUB_TOKEN` with your personal access token

4. **Deploy**
   - Vercel will automatically deploy your API
   - Access at `https://your-project.vercel.app`

### Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NTT-DevFPT/github-lang-stats-api&env=GITHUB_TOKEN)

---

## 📁 Project Structure

```
github-lang-stats-api/
├── api/                 # Vercel serverless functions
│   ├── index.js        # Main API endpoint (JSON)
│   └── svg.js          # SVG rendering endpoint
├── lib/                 # Utility libraries
│   ├── github.js       # GitHub GraphQL client
│   ├── cache.js        # Caching utilities
│   └── svg-render.js   # SVG generation
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── vercel.json          # Vercel configuration
└── README.md            # Project documentation
```

---

## 🔮 Usage Examples

### In GitHub Profile README

```markdown
## 📊 My Language Stats

![Language Stats](https://github-lang-stats-api.vercel.app/api/svg?username=YOUR_USERNAME&theme=dark)
```

### Fetch Data with JavaScript

```javascript
const username = 'NTT-DevFPT';
const response = await fetch(`https://github-lang-stats-api.vercel.app/api?username=${username}`);
const data = await response.json();

console.log(data.languages);
```

### Display on Website

```html
<img src="https://github-lang-stats-api.vercel.app/api/svg?username=YOUR_USERNAME" 
     alt="Language Statistics" />
```

---

## ⚠️ Rate Limiting

- GitHub API: 5,000 requests/hour for authenticated users
- API implements caching to minimize GitHub API calls
- Cache TTL: 30 minutes
- Recommended: Add cache-control headers when embedding

---

## 🔮 Future Enhancements

- [ ] Custom color themes
- [ ] Multiple layout options for SVG cards
- [ ] Support for private repositories
- [ ] Advanced filtering options
- [ ] Language trend tracking over time
- [ ] Integration with GitHub Actions
- [ ] REST API authentication
- [ ] Webhook support for real-time updates
- [ ] Export to various formats (PNG, PDF)
- [ ] Analytics dashboard

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👤 Author

**Nguyễn Thành Tài**
- GitHub: [@NTT-DevFPT](https://github.com/NTT-DevFPT)
- LinkedIn: [Connect with me](https://linkedin.com)
- Email: thanhtai10903@gmail.com
- Portfolio: [ntt-dev-fpt.vercel.app](https://ntt-dev-fpt.vercel.app)

---

## 🙏 Acknowledgments

- GitHub GraphQL API team for excellent documentation
- Octokit team for the GraphQL client library
- Vercel for serverless hosting platform
- Community contributors and testers

---

## 🔗 Related Projects

- [GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats) - Inspiration for SVG rendering
- [Octokit](https://github.com/octokit) - GitHub API client

---

<div align="center">
  <p>Made with ❤️ by NTT-DevFPT</p>
  <p>⭐ Star this repo if you find it helpful!</p>
  <p>🔗 <a href="https://github-lang-stats-api.vercel.app">Try the Live API</a></p>
</div>
