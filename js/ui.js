export function initializeQuestionPicker(roleSelect, questions = []) {
  const roles = ['all', ...new Set(questions.map((q) => q.role))];
  roleSelect.innerHTML = roles.map((role) => `<option value="${role}">${role}</option>`).join('');
  roleSelect.value = 'all';
}

export function pickQuestion(roleSelect, questionCard, questions = []) {
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

export function initializeMenu() {
  const menuToggle = document.querySelector('#menu-toggle');
  const menuLinks = document.querySelector('#menu-links');
  const links = document.querySelectorAll('.menu-link');

  menuToggle?.addEventListener('click', () => {
    menuLinks.classList.toggle('open');
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      menuLinks.classList.remove('open');
      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', () => {
    const sections = ['skills', 'interview', 'tools', 'labs', 'articles', 'projects'];
    let current = 'skills';

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section && window.scrollY >= section.offsetTop - 120) {
        current = id;
      }
    });

    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
    });
  });
}
