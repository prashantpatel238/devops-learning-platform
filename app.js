const skillGrid = document.querySelector('#skill-grid');
const toolsGrid = document.querySelector('#tools-grid');
const labsGrid = document.querySelector('#labs-grid');
const articleList = document.querySelector('#article-list');
const projectList = document.querySelector('#project-list');
const roleSelect = document.querySelector('#role-select');
const questionCard = document.querySelector('#question-card');
const newQuestionBtn = document.querySelector('#new-question');
const lastUpdated = document.querySelector('#last-updated');

let questions = [];

function relativeTime(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function renderSkills(skills) {
  skillGrid.innerHTML = skills
    .map(
      (skill) => `
      <article class="card">
        <h3>${skill.name}</h3>
        <p>${skill.description}</p>
        <p><strong>Production scenario:</strong> ${skill.productionScenario}</p>
        <p><strong>Scale:</strong> ${skill.scaleConsiderations}</p>
        <p><strong>Cost:</strong> ${skill.costImplications}</p>
        <p><strong>Security:</strong> ${skill.securityImplications}</p>
        <p><strong>Real incident:</strong> ${skill.incidentExample}</p>

        <strong>Common enterprise mistakes:</strong>
        <ul>
          ${skill.commonMistakes.map((mistake) => `<li>${mistake}</li>`).join('')}
        </ul>

        <strong>Start with:</strong>
        <ul>
          ${skill.resources.map((resource) => `<li>${resource}</li>`).join('')}
        </ul>
      </article>
    `
    )
    .join('');
}

function renderToolGuides(toolGuides = []) {
  if (!toolsGrid) return;

  toolsGrid.innerHTML = toolGuides
    .map(
      (guide) => `
      <article class="card">
        <h3>${guide.tool}</h3>
        <p><strong>Why this exists:</strong> ${guide.whyItExists}</p>

        <strong>When to use it:</strong>
        <ul>
          ${guide.whenToUse.map((item) => `<li>${item}</li>`).join('')}
        </ul>

        <strong>When NOT to use it:</strong>
        <ul>
          ${guide.whenNotToUse.map((item) => `<li>${item}</li>`).join('')}
        </ul>

        <p><strong>Alternatives used in industry:</strong> ${guide.alternatives.join(', ')}</p>
        <p><strong>Startup example:</strong> ${guide.startupExample}</p>
        <p><strong>Enterprise example:</strong> ${guide.enterpriseExample}</p>
      </article>
    `
    )
    .join('');
}


function renderLabs(labs = []) {
  if (!labsGrid) return;

  labsGrid.innerHTML = labs
    .map(
      (lab) => `
      <article class="card">
        <h3>${lab.topic} Lab</h3>
        <p><strong>Objective:</strong> ${lab.objective}</p>
        <p><strong>Architecture diagram description:</strong> ${lab.architectureDiagramDescription}</p>

        <strong>Step-by-step commands:</strong>
        <ol>
          ${lab.stepByStepCommands.map((cmd) => `<li><code>${cmd}</code></li>`).join('')}
        </ol>

        <strong>Expected output:</strong>
        <ul>
          ${lab.expectedOutput.map((item) => `<li>${item}</li>`).join('')}
        </ul>

        <strong>Common failure cases:</strong>
        <ul>
          ${lab.commonFailureCases.map((item) => `<li>${item}</li>`).join('')}
        </ul>

        <strong>Cleanup steps:</strong>
        <ol>
          ${lab.cleanupSteps.map((step) => `<li><code>${step}</code></li>`).join('')}
        </ol>
      </article>
    `
    )
    .join('');
}

function initializeQuestionPicker(interviewQuestions) {
  questions = interviewQuestions;
  const roles = ['all', ...new Set(interviewQuestions.map((q) => q.role))];

  roleSelect.innerHTML = roles.map((role) => `<option value="${role}">${role}</option>`).join('');
  roleSelect.value = 'all';
}

function pickQuestion() {
  const role = roleSelect.value;
  const filtered = role === 'all' ? questions : questions.filter((q) => q.role === role);

  if (!filtered.length) {
    questionCard.innerHTML = '<h3>No questions available</h3><p>Try another role.</p>';
    return;
  }

  const chosen = filtered[Math.floor(Math.random() * filtered.length)];
  questionCard.innerHTML = `
    <h3>${chosen.role}</h3>
    <p>${chosen.question}</p>
    <small>Focus area: ${chosen.focus}</small>
  `;
}

async function fetchDevToArticles() {
  try {
    const response = await fetch('https://dev.to/api/articles?tag=devops&per_page=6');
    if (!response.ok) throw new Error('Unable to fetch articles');

    const articles = await response.json();
    articleList.innerHTML = articles
      .map(
        (article) => `
        <li>
          <a href="${article.url}" target="_blank" rel="noreferrer">${article.title}</a>
          <p>${article.description || 'No description'}</p>
          <small>Published ${relativeTime(article.published_at)}</small>
        </li>
      `
      )
      .join('');
  } catch {
    articleList.innerHTML =
      '<li>Could not load live articles right now. Please refresh later.</li>';
  }
}

async function fetchTrendingProjects() {
  try {
    const response = await fetch(
      'https://api.github.com/search/repositories?q=topic:devops&sort=stars&order=desc&per_page=6',
      { headers: { Accept: 'application/vnd.github+json' } }
    );

    if (!response.ok) throw new Error('Unable to fetch projects');

    const data = await response.json();
    projectList.innerHTML = data.items
      .map(
        (repo) => `
        <li>
          <a href="${repo.html_url}" target="_blank" rel="noreferrer">${repo.full_name}</a>
          <p>${repo.description || 'No description'}</p>
          <small>⭐ ${repo.stargazers_count.toLocaleString()} stars</small>
        </li>
      `
      )
      .join('');
  } catch {
    projectList.innerHTML =
      '<li>Could not load trending projects right now. Please refresh later.</li>';
  }
}

async function initialize() {
  const response = await fetch('data/content.json');
  const content = await response.json();

  renderSkills(content.skills);
  renderToolGuides(content.toolGuides);
  renderLabs(content.labs);
  initializeQuestionPicker(content.interviewQuestions);

  lastUpdated.textContent = `Live sections updated ${new Date().toLocaleString()}`;

  newQuestionBtn.addEventListener('click', pickQuestion);
  pickQuestion();

  await Promise.all([fetchDevToArticles(), fetchTrendingProjects()]);
}

initialize();
