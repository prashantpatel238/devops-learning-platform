const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8787;
const CONTENT_PATH = path.join(__dirname, '..', 'data', 'content.json');

function sendJson(res, code, payload) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function normalizeText(text = '') {
  return String(text).replace(/\s+/g, ' ').trim();
}

function explainSimpleTerms({ topic = '', lessonText = '' }) {
  const cleanTopic = normalizeText(topic || 'this DevOps topic');
  const cleanLesson = normalizeText(lessonText);
  const summarySeed = cleanLesson ? cleanLesson.slice(0, 220) : 'No lesson text provided.';

  return {
    topic: cleanTopic,
    explanation: [
      `${cleanTopic} in simple terms: think of it as a way to make software delivery safer, faster, and repeatable.`,
      'A practical mental model is: build once, verify quality, deploy safely, observe continuously, and improve quickly.',
      `From your lesson: "${summarySeed}"`,
      'If you are new, focus first on what problem this tool/process solves, then how teams operate it in production.'
    ].join(' ')
  };
}

function generateInterviewQuestions({ lessonTitle = '', lessonText = '' }) {
  const title = normalizeText(lessonTitle || 'DevOps lesson');
  const seed = normalizeText(lessonText).slice(0, 160);
  return {
    lessonTitle: title,
    questions: [
      `How would you explain the core goal of "${title}" to a new team member?`,
      `What are the top production risks if "${title}" is implemented without guardrails?`,
      `Which metrics would you track to prove "${title}" is working in production?`,
      `Describe a rollout strategy for "${title}" that minimizes blast radius.`,
      `Given this lesson context (${seed || 'no extra context'}), what trade-off would you prioritize first and why?`
    ]
  };
}

function createRealWorldScenarioQuestions({ topic = '', difficulty = 'intermediate' }) {
  const t = normalizeText(topic || 'DevOps operations');
  return {
    topic: t,
    difficulty,
    scenarios: [
      `During a peak-traffic release, ${t} changes increased p95 latency by 30%. What is your first 15-minute triage plan?`,
      `A security team flags a critical misconfiguration related to ${t} 1 hour before launch. Do you block release or proceed with compensating controls? Explain.`,
      `Costs rose 25% after introducing ${t}. How do you separate waste from necessary reliability spend?`,
      `Your dashboards disagree during an incident tied to ${t}. Which data source do you trust first and why?`
    ]
  };
}

function detectOutdatedDevopsContent({ contentItems = [] }) {
  const now = new Date();
  const staleThresholdDays = 365;
  const staleKeywords = ['docker swarm', 'kubernetes v1.20', 'terraform 0.11', 'jenkins freestyle only'];

  const findings = contentItems
    .map((item) => {
      const title = normalizeText(item.title || item.name || 'Untitled content');
      const body = normalizeText(item.body || item.description || '');
      const reviewedAt = item.lastReviewedAt ? new Date(item.lastReviewedAt) : null;
      const ageDays = reviewedAt ? Math.floor((now - reviewedAt) / (1000 * 60 * 60 * 24)) : null;
      const keywordHit = staleKeywords.find((k) => body.toLowerCase().includes(k));

      const reasons = [];
      if (!reviewedAt) reasons.push('Missing lastReviewedAt metadata');
      if (ageDays !== null && ageDays > staleThresholdDays) reasons.push(`Last review is ${ageDays} days old`);
      if (keywordHit) reasons.push(`Potentially outdated reference detected: "${keywordHit}"`);

      return {
        title,
        status: reasons.length ? 'review_required' : 'ok',
        reasons
      };
    })
    .filter((r) => r.status === 'review_required');

  return {
    checkedAt: now.toISOString(),
    staleThresholdDays,
    findings
  };
}

function loadDefaultContentItems() {
  try {
    const raw = fs.readFileSync(CONTENT_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return (parsed.skills || []).map((s) => ({
      title: s.name,
      description: s.description,
      body: [s.description, s.productionScenario, s.incidentExample].filter(Boolean).join(' '),
      lastReviewedAt: s.lastReviewedAt || null
    }));
  } catch {
    return [];
  }
}

const routes = {
  '/api/v1/ai/explain': async (req) => explainSimpleTerms(await readBody(req)),
  '/api/v1/ai/interview-questions': async (req) => generateInterviewQuestions(await readBody(req)),
  '/api/v1/ai/real-world-scenarios': async (req) =>
    createRealWorldScenarioQuestions(await readBody(req)),
  '/api/v1/ai/detect-outdated': async (req) => {
    const body = await readBody(req);
    const items = Array.isArray(body.contentItems) && body.contentItems.length
      ? body.contentItems
      : loadDefaultContentItems();
    return detectOutdatedDevopsContent({ contentItems: items });
  }
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  if (req.method === 'GET' && req.url === '/api/v1/health') {
    return sendJson(res, 200, { status: 'ok', service: 'devops-learning-ai-api', version: 'v1' });
  }

  if (req.method === 'POST' && routes[req.url]) {
    try {
      const data = await routes[req.url](req);
      return sendJson(res, 200, { success: true, data });
    } catch (error) {
      return sendJson(res, 400, { success: false, error: error.message });
    }
  }

  return sendJson(res, 404, { success: false, error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`AI API server running on http://localhost:${PORT}`);
});
