cat > lib/github.js << 'EOF'
const { graphql } = require('@octokit/graphql');

class GitHubClient {
    constructor(token) {
        this.graphqlWithAuth = graphql.defaults({
            headers: {
                authorization: `token ${token}`,
            },
        });
    }

    async getUserRepositories(username) {
        const query = `
      query($username: String!, $cursor: String) {
        user(login: $username) {
          repositories(first: 100, after: $cursor, ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              name
              owner {
                login
              }
              isFork
              isPrivate
              languages(first: 10) {
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
    `;

        let allRepos = [];
        let hasNextPage = true;
        let cursor = null;

        while (hasNextPage) {
            const response = await this.graphqlWithAuth(query, {
                username,
                cursor,
            });

            const repos = response.user.repositories;
            allRepos = allRepos.concat(repos.nodes);

            hasNextPage = repos.pageInfo.hasNextPage;
            cursor = repos.pageInfo.endCursor;
        }

        return allRepos;
    }

    async getOrganizationRepositories(orgName) {
        const query = `
      query($orgName: String!, $cursor: String) {
        organization(login: $orgName) {
          repositories(first: 100, after: $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              name
              owner {
                login
              }
              isFork
              isPrivate
              languages(first: 10) {
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
    `;

        let allRepos = [];
        let hasNextPage = true;
        let cursor = null;

        while (hasNextPage) {
            const response = await this.graphqlWithAuth(query, {
                orgName,
                cursor,
            });

            const repos = response.organization.repositories;
            allRepos = allRepos.concat(repos.nodes);

            hasNextPage = repos.pageInfo.hasNextPage;
            cursor = repos.pageInfo.endCursor;
        }

        return allRepos;
    }
}

module.exports = GitHubClient;
EOF