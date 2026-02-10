import { fetchLocalContent, fetchDevToArticles, fetchTrendingProjects } from './api.js';
import {
  renderSkills,
  renderToolGuides,
  renderLabs,
  renderArticles,
  renderProjects
} from './renderers.js';
import { initializeQuestionPicker, pickQuestion, initializeMenu } from './ui.js';

const els = {
  skillGrid: document.querySelector('#skill-grid'),
  toolsGrid: document.querySelector('#tools-grid'),
  labsGrid: document.querySelector('#labs-grid'),
  articleList: document.querySelector('#article-list'),
  projectList: document.querySelector('#project-list'),
  roleSelect: document.querySelector('#role-select'),
  questionCard: document.querySelector('#question-card'),
  newQuestionBtn: document.querySelector('#new-question'),
  lastUpdated: document.querySelector('#last-updated')
};

let interviewQuestions = [];

async function initialize() {
  try {
    const content = await fetchLocalContent();

    renderSkills(els.skillGrid, content.skills);
    renderToolGuides(els.toolsGrid, content.toolGuides);
    renderLabs(els.labsGrid, content.labs);

    interviewQuestions = content.interviewQuestions || [];
    initializeQuestionPicker(els.roleSelect, interviewQuestions);
    els.newQuestionBtn.addEventListener('click', () =>
      pickQuestion(els.roleSelect, els.questionCard, interviewQuestions)
    );
    pickQuestion(els.roleSelect, els.questionCard, interviewQuestions);

    els.lastUpdated.textContent = `Live sections updated ${new Date().toLocaleString()}`;
    initializeMenu();

    const [articles, projects] = await Promise.allSettled([
      fetchDevToArticles(),
      fetchTrendingProjects()
    ]);

    if (articles.status === 'fulfilled') {
      renderArticles(els.articleList, articles.value);
    } else {
      els.articleList.innerHTML =
        '<li>Could not load live articles right now. Please refresh later.</li>';
    }

    if (projects.status === 'fulfilled') {
      renderProjects(els.projectList, projects.value);
    } else {
      els.projectList.innerHTML =
        '<li>Could not load trending projects right now. Please refresh later.</li>';
    }
  } catch (error) {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<p class="fatal">Unable to load the learning hub content. Please try again.</p>'
    );
  }
}

initialize();
