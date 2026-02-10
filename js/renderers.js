function list(items = []) {
  return items.map((item) => `<li>${item}</li>`).join('');
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
      </article>
    `
    )
    .join('');
}

export function renderLabs(container, labs = []) {
  container.innerHTML = labs
    .map(
      (lab) => `
      <article class="card">
        <h3>${lab.topic} Lab</h3>
        <p><strong>Objective:</strong> ${lab.objective}</p>
        <p><strong>Architecture diagram description:</strong> ${lab.architectureDiagramDescription}</p>
        <strong>Step-by-step commands:</strong>
        <ol>${lab.stepByStepCommands.map((cmd) => `<li><code>${cmd}</code></li>`).join('')}</ol>
        <strong>Expected output:</strong>
        <ul>${list(lab.expectedOutput)}</ul>
        <strong>Common failure cases:</strong>
        <ul>${list(lab.commonFailureCases)}</ul>
        <strong>Cleanup steps:</strong>
        <ol>${lab.cleanupSteps.map((step) => `<li><code>${step}</code></li>`).join('')}</ol>
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
