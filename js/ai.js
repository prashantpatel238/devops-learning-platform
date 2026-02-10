import {
  explainTopicSimple,
  generateInterviewQuestions,
  generateRealWorldScenarios,
  detectOutdatedContent
} from './api.js';

function setLoading(outputEl, text) {
  outputEl.innerHTML = `<p>${text}</p>`;
}

function renderList(title, items = []) {
  return `
    <h4>${title}</h4>
    <ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>
  `;
}

export function initializeAiFeatures(content) {
  const topicInput = document.querySelector('#ai-topic');
  const lessonInput = document.querySelector('#ai-lesson-text');
  const difficulty = document.querySelector('#ai-difficulty');
  const output = document.querySelector('#ai-output');

  const explainBtn = document.querySelector('#ai-explain-btn');
  const interviewBtn = document.querySelector('#ai-interview-btn');
  const scenarioBtn = document.querySelector('#ai-scenario-btn');
  const outdatedBtn = document.querySelector('#ai-outdated-btn');

  if (!output) return;

  explainBtn?.addEventListener('click', async () => {
    setLoading(output, 'Asking Codex API to simplify topic...');
    try {
      const data = await explainTopicSimple({
        topic: topicInput.value,
        lessonText: lessonInput.value
      });
      output.innerHTML = `<h4>Simple Explanation</h4><p>${data.explanation}</p>`;
    } catch (error) {
      output.innerHTML = `<p>Unable to explain topic right now: ${error.message}</p>`;
    }
  });

  interviewBtn?.addEventListener('click', async () => {
    setLoading(output, 'Generating interview questions from lesson...');
    try {
      const data = await generateInterviewQuestions({
        lessonTitle: topicInput.value,
        lessonText: lessonInput.value
      });
      output.innerHTML = renderList('Interview Questions', data.questions);
    } catch (error) {
      output.innerHTML = `<p>Unable to generate interview questions: ${error.message}</p>`;
    }
  });

  scenarioBtn?.addEventListener('click', async () => {
    setLoading(output, 'Generating real-world SRE scenarios...');
    try {
      const data = await generateRealWorldScenarios({
        topic: topicInput.value,
        difficulty: difficulty.value
      });
      output.innerHTML = renderList('Real-world Scenario Questions', data.scenarios);
    } catch (error) {
      output.innerHTML = `<p>Unable to generate scenario questions: ${error.message}</p>`;
    }
  });

  outdatedBtn?.addEventListener('click', async () => {
    setLoading(output, 'Scanning content for outdated DevOps guidance...');
    try {
      const contentItems = (content.skills || []).map((s) => ({
        title: s.name,
        body: [s.description, s.productionScenario, s.incidentExample].filter(Boolean).join(' '),
        lastReviewedAt: s.lastReviewedAt || null
      }));
      const data = await detectOutdatedContent({ contentItems });

      if (!data.findings.length) {
        output.innerHTML = '<h4>Outdated Content Scan</h4><p>No stale items detected.</p>';
        return;
      }

      output.innerHTML = `
        <h4>Outdated Content Findings</h4>
        <ul>
          ${data.findings
            .map(
              (f) => `<li><strong>${f.title}</strong><br/>${f.reasons
                .map((r) => `- ${r}`)
                .join('<br/>')}</li>`
            )
            .join('')}
        </ul>
      `;
    } catch (error) {
      output.innerHTML = `<p>Outdated scan failed: ${error.message}</p>`;
    }
  });
}
