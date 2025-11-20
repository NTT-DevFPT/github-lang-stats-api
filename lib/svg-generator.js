cat > lib/svg-generator.js << 'EOF'
class SVGGenerator {
    constructor(theme = 'default') {
        this.themes = {
            default: {
                bg: '#0d1117',
                border: '#30363d',
                title: '#58a6ff',
                text: '#c9d1d9',
                icon: '#58a6ff',
            },
            light: {
                bg: '#ffffff',
                border: '#e1e4e8',
                title: '#0969da',
                text: '#24292f',
                icon: '#0969da',
            },
            dark: {
                bg: '#161b22',
                border: '#30363d',
                title: '#58a6ff',
                text: '#c9d1d9',
                icon: '#58a6ff',
            },
        };
        this.theme = this.themes[theme] || this.themes.default;
    }

    generate(languageStats, options = {}) {
        const {
            title = 'Most Used Languages',
            width = 300,
            hideTitle = false,
            hideBorder = false,
            limit = 5,
        } = options;

        const topLanguages = languageStats.slice(0, limit);
        const cardHeight = hideTitle ? 45 + (topLanguages.length * 25) : 90 + (topLanguages.length * 25);

        const languageBars = topLanguages.map((lang, index) => {
            const yPos = hideTitle ? 20 + (index * 25) : 65 + (index * 25);
            const barWidth = (parseFloat(lang.percentage) / 100) * (width - 50);

            return `
        <g transform="translate(0, ${yPos})">
          <text x="10" y="15" class="lang-name">${lang.name}</text>
          <text x="${width - 40}" y="15" class="lang-percent">${lang.percentage}%</text>
          <rect x="10" y="20" width="${barWidth}" height="4" fill="${lang.color}" rx="2"/>
        </g>
      `;
        }).join('');

        return `
      <svg width="${width}" height="${cardHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .card { font-family: 'Segoe UI', Ubuntu, Sans-Serif; }
            .title { font-size: 18px; font-weight: 600; fill: ${this.theme.title}; }
            .lang-name { font-size: 12px; fill: ${this.theme.text}; }
            .lang-percent { font-size: 11px; fill: ${this.theme.text}; opacity: 0.8; }
          </style>
        </defs>
        
        <rect width="100%" height="100%" fill="${this.theme.bg}" ${hideBorder ? '' : `stroke="${this.theme.border}" stroke-width="1"`} rx="4.5"/>
        
        ${!hideTitle ? `
          <g transform="translate(0, 0)">
            <text x="10" y="30" class="title">${title}</text>
          </g>
        ` : ''}
        
        ${languageBars}
      </svg>
    `;
    }
}

module.exports = SVGGenerator;
EOF