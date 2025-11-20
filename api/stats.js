cat > api/stats.js << 'EOF'
const GitHubClient = require('../lib/github');
const LanguageAggregator = require('../lib/aggregator');
const SVGGenerator = require('../lib/svg-generator');

module.exports = async (req, res) => {
    try {
        const {
            username,
            orgs,
            exclude_forks = 'true',
            theme = 'default',
            hide_title = 'false',
            hide_border = 'false',
            limit = '5',
            format = 'svg',
        } = req.query;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const githubToken = process.env.GITHUB_TOKEN;
        if (!githubToken) {
            return res.status(500).json({ error: 'GitHub token not configured' });
        }

        const client = new GitHubClient(githubToken);
        const aggregator = new LanguageAggregator();

        console.log(`Fetching repos for user: ${username}`);
        const userRepos = await client.getUserRepositories(username);
        aggregator.addRepositories(userRepos, exclude_forks === 'true');

        if (orgs) {
            const orgList = orgs.split(',').map(org => org.trim());
            for (const orgName of orgList) {
                console.log(`Fetching repos for org: ${orgName}`);
                try {
                    const orgRepos = await client.getOrganizationRepositories(orgName);
                    aggregator.addRepositories(orgRepos, exclude_forks === 'true');
                } catch (error) {
                    console.error(`Error fetching org ${orgName}:`, error.message);
                }
            }
        }

        const stats = aggregator.getStats();

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
            return res.status(200).json(stats);
        }

        const svgGenerator = new SVGGenerator(theme);
        const svg = svgGenerator.generate(stats.languages, {
            hideTitle: hide_title === 'true',
            hideBorder: hide_border === 'true',
            limit: parseInt(limit),
        });

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
        res.status(200).send(svg);

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: 'Failed to fetch language statistics',
            message: error.message
        });
    }
};
EOF