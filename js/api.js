export async function fetchLocalContent() {
  const response = await fetch('data/content.json');
  if (!response.ok) {
    throw new Error('Failed to load local content');
  }
  return response.json();
}

export async function fetchDevToArticles() {
  const response = await fetch('https://dev.to/api/articles?tag=devops&per_page=6');
  if (!response.ok) {
    throw new Error('Unable to fetch articles');
  }
  return response.json();
}

export async function fetchTrendingProjects() {
  const response = await fetch(
    'https://api.github.com/search/repositories?q=topic:devops&sort=stars&order=desc&per_page=6',
    { headers: { Accept: 'application/vnd.github+json' } }
  );

  if (!response.ok) {
    throw new Error('Unable to fetch projects');
  }

  const data = await response.json();
  return data.items || [];
}
