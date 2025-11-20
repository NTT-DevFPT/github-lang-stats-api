cat > lib/aggregator.js << 'EOF'
class LanguageAggregator {
    constructor() {
        this.languageStats = new Map();
        this.totalBytes = 0;
    }

    addRepositories(repos, excludeForks = true) {
        repos.forEach(repo => {
            if (excludeForks && repo.isFork) return;
            if (!repo.languages || !repo.languages.edges.length) return;

            repo.languages.edges.forEach(({ size, node }) => {
                const langName = node.name;
                const langColor = node.color || '#cccccc';

                if (this.languageStats.has(langName)) {
                    const current = this.languageStats.get(langName);
                    this.languageStats.set(langName, {
                        ...current,
                        size: current.size + size,
                    });
                } else {
                    this.languageStats.set(langName, {
                        name: langName,
                        color: langColor,
                        size: size,
                    });
                }

                this.totalBytes += size;
            });
        });
    }

    getStats() {
        const languages = Array.from(this.languageStats.values())
            .map(lang => ({
                ...lang,
                percentage: ((lang.size / this.totalBytes) * 100).toFixed(2),
            }))
            .sort((a, b) => b.size - a.size);

        return {
            languages,
            totalBytes: this.totalBytes,
            totalLanguages: languages.length,
        };
    }

    getTopLanguages(limit = 5) {
        const stats = this.getStats();
        return stats.languages.slice(0, limit);
    }
}

module.exports = LanguageAggregator;
EOF