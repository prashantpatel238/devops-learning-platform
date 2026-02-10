const AI_API_BASE = window.__AI_API_BASE__ || 'http://127.0.0.1:8787';

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

async function postAi(path, payload) {
  const response = await fetch(`${AI_API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`AI API request failed: ${response.status}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Unknown AI API error');
  }
  return result.data;
}

export function explainTopicSimple(payload) {
  return postAi('/api/v1/ai/explain', payload);
}

export function generateInterviewQuestions(payload) {
  return postAi('/api/v1/ai/interview-questions', payload);
}

export function generateRealWorldScenarios(payload) {
  return postAi('/api/v1/ai/real-world-scenarios', payload);
}

export function detectOutdatedContent(payload = {}) {
  return postAi('/api/v1/ai/detect-outdated', payload);
}
