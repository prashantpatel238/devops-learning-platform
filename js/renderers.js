function list(items = []) {
  return items.map((item) => `<li>${item}</li>`).join('');
}

const INDICATOR_INFO = {
  'Used in production': 'Commonly implemented by real engineering teams in live environments.',
  'Enterprise pattern': 'Scales with governance, security controls, and cross-team operational standards.',
  'Anti-pattern': 'A risky approach that often causes reliability, security, or maintainability issues.',
  'Interview favorite': 'Frequently asked in DevOps/SRE interviews to test practical decision-making.'
};

function slug(text = '') {
  return text.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
}

function renderIndicators(indicators = []) {
  if (!indicators.length) return '';

  return `
    <div class="indicator-row">
      ${indicators
        .map(
          (item) =>
            `<span class="indicator-badge indicator-${slug(item)}">${item}</span>`
        )
        .join('')}
    </div>
    <ul class="indicator-explanations">
      ${indicators
        .map((item) => `<li><strong>${item}:</strong> ${INDICATOR_INFO[item] || 'Important learning signal.'}</li>`)
        .join('')}
    </ul>
  `;
}

export function relativeTime(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export function renderSkills(container, skills = []) {
  container.innerHTML = skills
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
        ${renderIndicators(skill.indicators || ['Used in production', 'Enterprise pattern', 'Interview favorite'])}
        <strong>Common enterprise mistakes:</strong>
        <ul>${list(skill.commonMistakes)}</ul>
        <strong>Start with:</strong>
        <ul>${list(skill.resources)}</ul>
      </article>
    `
    )
    .join('');
}

export function renderToolGuides(container, toolGuides = []) {
  container.innerHTML = toolGuides
    .map(
      (guide) => `
      <article class="card">
        <h3>${guide.tool}</h3>
        <p><strong>Why this exists:</strong> ${guide.whyItExists}</p>
        <strong>When to use it:</strong>
        <ul>${list(guide.whenToUse)}</ul>
        <strong>When NOT to use it:</strong>
        <ul>${list(guide.whenNotToUse)}</ul>
        <p><strong>Alternatives used in industry:</strong> ${guide.alternatives.join(', ')}</p>
        <p><strong>Startup example:</strong> ${guide.startupExample}</p>
        <p><strong>Enterprise example:</strong> ${guide.enterpriseExample}</p>
        ${renderIndicators(guide.indicators || ['Used in production', 'Enterprise pattern', 'Anti-pattern', 'Interview favorite'])}
      </article>
    `
    )
    .join('');
}

export function renderLabs(container, labs = []) {
  container.innerHTML = labs
    .map((lab) => {
      const misconfig = lab.intentionalMisconfiguration
        ? `
        <strong>Intentional misconfiguration:</strong>
        <ul>${list(lab.intentionalMisconfiguration)}</ul>
      `
        : '';

      const workflow = lab.sreTroubleshootingWorkflow
        ? `
        <strong>SRE troubleshooting workflow:</strong>
        <ol>${lab.sreTroubleshootingWorkflow.map((step) => `<li>${step}</li>`).join('')}</ol>
      `
        : '';

      const solution = lab.solutionExplanation
        ? `<p><strong>Solution walkthrough:</strong> ${lab.solutionExplanation}</p>`
        : '';

      return `
      <article class="card">
        <h3>${lab.topic} Lab${lab.labType ? ` — ${lab.labType}` : ''}</h3>
        <p><strong>Objective:</strong> ${lab.objective}</p>
        <p><strong>Architecture diagram description:</strong> ${lab.architectureDiagramDescription}</p>
        ${misconfig}
        <strong>Step-by-step commands:</strong>
        <ol>${lab.stepByStepCommands.map((cmd) => `<li><code>${cmd}</code></li>`).join('')}</ol>
        <strong>Expected output:</strong>
        <ul>${list(lab.expectedOutput)}</ul>
        <strong>Common failure cases:</strong>
        <ul>${list(lab.commonFailureCases)}</ul>
        ${workflow}
        ${solution}
        ${renderIndicators(lab.indicators || ['Used in production', 'Enterprise pattern', 'Anti-pattern', 'Interview favorite'])}
        <strong>Cleanup steps:</strong>
        <ol>${lab.cleanupSteps.map((step) => `<li><code>${step}</code></li>`).join('')}</ol>
      </article>
    `;
    })
    .join('');
}


export function renderLearningPaths(container, paths = []) {
  container.innerHTML = paths
    .map(
      (path) => `
      <article class="card">
        <h3>${path.name}</h3>
        <strong>Required lessons:</strong>
        <ul>${list(path.requiredLessons)}</ul>
        <strong>Required labs:</strong>
        <ul>${list(path.requiredLabs)}</ul>
        <strong>Skills gained:</strong>
        <ul>${list(path.skillsGained)}</ul>
        ${renderIndicators(path.indicators || ['Used in production', 'Enterprise pattern', 'Interview favorite'])}
      </article>
    `
    )
    .join('');
}

export function renderArticles(container, articles = []) {
  container.innerHTML = articles
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
}

export function renderProjects(container, projects = []) {
  container.innerHTML = projects
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
}
