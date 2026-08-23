/* Current Cisco Networking Academy offerings, refreshed from the Academy export on 2026-08-23. */
(() => {
  'use strict';

  const OFFERINGS = Object.freeze([
    { title: 'AI Fundamentals with IBM SkillsBuild', subject: 'AI & Data Science' },
    { title: 'AP Cybersecurity', subject: 'Cybersecurity' },
    { title: 'Apply AI: Analyze Customer Reviews', subject: 'AI & Data Science' },
    { title: 'Apply AI: Update Your Resume', subject: 'AI & Data Science' },
    { title: 'C Advanced', subject: 'Programming' },
    { title: 'C Essentials 1', subject: 'Programming' },
    { title: 'C Essentials 2', subject: 'Programming' },
    { title: 'C++ Advanced', subject: 'Programming' },
    { title: 'C++ Essentials 1', subject: 'Programming' },
    { title: 'C++ Essentials 2', subject: 'Programming' },
    { title: 'CCNA: Enterprise Networking, Security, and Automation', subject: 'Networking' },
    { title: 'CCNA: Introduction to Networks', subject: 'Networking' },
    { title: 'CCNA: Switching, Routing, and Wireless Essentials', subject: 'Networking' },
    { title: 'CCNP Enterprise: Advanced Routing', subject: 'Networking' },
    { title: 'CCNP Enterprise: Advanced Routing (v9)', subject: 'Networking' },
    { title: 'CCNP Enterprise: Core Networking', subject: 'Networking' },
    { title: 'CCNP Enterprise: Core Networking (v9)', subject: 'Networking' },
    { title: 'CSS Essentials', subject: 'Programming' },
    { title: 'Computer Hardware Basics', subject: 'Information Technology' },
    { title: 'Create Digital Content, Communicate and Collaborate Online', subject: 'Digital Literacy' },
    { title: 'Creating Compelling Reports', subject: 'Professional Skills' },
    { title: 'Cyber Threat Management', subject: 'Cybersecurity' },
    { title: 'Cybersecurity Essentials', subject: 'Cybersecurity' },
    { title: 'Data Analytics Essentials', subject: 'AI & Data Science' },
    { title: 'Data Science Essentials with Python', subject: 'AI & Data Science' },
    { title: 'Data and Tools for Defense Analysts', subject: 'Cybersecurity' },
    { title: 'DevNet Associate', subject: 'Networking' },
    { title: 'Digital Awareness', subject: 'Digital Literacy' },
    { title: 'Digital Safety and Security Awareness', subject: 'Digital Literacy' },
    { title: 'Discovering Entrepreneurship', subject: 'Professional Skills' },
    { title: 'Endpoint Security', subject: 'Cybersecurity' },
    { title: 'Engaging Stakeholders for Success', subject: 'Professional Skills' },
    { title: 'English for IT 1', subject: 'Professional Skills' },
    { title: 'English for IT 2', subject: 'Professional Skills' },
    { title: 'English for IT: Advice and Time', subject: 'Professional Skills' },
    { title: 'English for IT: Describing and Comparing', subject: 'Professional Skills' },
    { title: 'English for IT: Needs and Responsibilities', subject: 'Professional Skills' },
    { title: 'English for IT: People and Quantities', subject: 'Professional Skills' },
    { title: 'Ethical Hacker', subject: 'Cybersecurity' },
    { title: 'Exploring Internet of Things with Cisco Packet Tracer', subject: 'Cisco Packet Tracer' },
    { title: 'Exploring Networking with Cisco Packet Tracer', subject: 'Cisco Packet Tracer' },
    { title: 'Fundamentos de Linux', subject: 'Information Technology' },
    { title: 'Getting Started with Cisco Packet Tracer', subject: 'Cisco Packet Tracer' },
    { title: 'HTML Essentials', subject: 'Programming' },
    { title: 'Hardware and Upgrade Support', subject: 'Information Technology' },
    { title: 'IT Customer Support Basics', subject: 'Information Technology' },
    { title: 'IT Essentials - Bridge to version 8.0', subject: 'Information Technology' },
    { title: 'IT Essentials 7', subject: 'Information Technology' },
    { title: 'IT Essentials 8', subject: 'Information Technology' },
    { title: 'IT Support Essentials', subject: 'Information Technology' },
    { title: 'Industrial Cybersecurity Essentials', subject: 'Cybersecurity' },
    { title: 'Industrial IoT and Control Systems in Energy', subject: 'Networking' },
    { title: 'Industrial IoT and Control Systems in Manufacturing', subject: 'Networking' },
    { title: 'Industrial Networking Essentials', subject: 'Networking' },
    { title: 'Introduction to Cybersecurity', subject: 'Cybersecurity' },
    { title: 'Introduction to Data Science', subject: 'AI & Data Science' },
    { title: 'Introduction to Greenhouse Gas Accounting for IT', subject: 'Sustainability' },
    { title: 'Introduction to IoT and Digital Transformation', subject: 'Digital Literacy' },
    { title: 'Introduction to Modern AI', subject: 'AI & Data Science' },
    { title: 'Introduction to Splunk', subject: 'Cybersecurity' },
    { title: 'JavaScript Essentials 1', subject: 'Programming' },
    { title: 'JavaScript Essentials 2', subject: 'Programming' },
    { title: 'Launching a Business Venture', subject: 'Professional Skills' },
    { title: 'Linux 1', subject: 'Information Technology' },
    { title: 'Linux 2', subject: 'Information Technology' },
    { title: 'Linux Essentials', subject: 'Information Technology' },
    { title: 'Linux Unhatched', subject: 'Information Technology' },
    { title: 'Managing a Business Venture', subject: 'Professional Skills' },
    { title: 'Network Addressing and Basic Troubleshooting', subject: 'Networking' },
    { title: 'Network Defense', subject: 'Cybersecurity' },
    { title: 'Network Security', subject: 'Cybersecurity' },
    { title: 'Network Support and Security', subject: 'Networking' },
    { title: 'Networking Basics', subject: 'Networking' },
    { title: 'Networking Devices and Initial Configuration', subject: 'Networking' },
    { title: 'Networking Essentials', subject: 'Networking' },
    { title: 'Operating Systems Basics', subject: 'Information Technology' },
    { title: 'Operating Systems Support', subject: 'Information Technology' },
    { title: 'Python Essentials 1', subject: 'Programming' },
    { title: 'Python Essentials 2', subject: 'Programming' },
    { title: 'SOC Essentials: Introduction to Threat Hunting', subject: 'Cybersecurity' },
    { title: 'SOC Essentials: Investigating with Splunk', subject: 'Cybersecurity' },
    { title: 'Security Operations and the Defense Analyst', subject: 'Cybersecurity' },
    { title: 'Security and Connectivity Support', subject: 'Information Technology' },
    { title: 'The Art of Investigation', subject: 'Cybersecurity' },
    { title: 'The Cybersecurity Landscape', subject: 'Cybersecurity' },
    { title: 'Understanding Threats and Attacks', subject: 'Cybersecurity' },
    { title: 'Using Computer and Mobile Devices', subject: 'Digital Literacy' },
    { title: '[BETA] College Board AP Career Kickstart Networking', subject: 'Networking' },
    { title: '[BETA] Subnetting Mastery', subject: 'Networking' }
  ]);

  const DISPLAY_LIMIT = 18;

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function initialiseCatalogue() {
    const form = document.querySelector('.cisco-catalogue__controls');
    const search = document.getElementById('cisco-course-search');
    const subject = document.getElementById('cisco-subject-filter');
    const summary = document.getElementById('cisco-catalogue-summary');
    const results = document.getElementById('cisco-course-results');
    const more = document.getElementById('cisco-catalogue-more');
    if (!form || !search || !subject || !summary || !results || !more) return;

    [...new Set(OFFERINGS.map((offering) => offering.subject))]
      .sort((a, b) => a.localeCompare(b))
      .forEach((name) => subject.append(new Option(name, name)));

    let visible = DISPLAY_LIMIT;

    function matchingOfferings() {
      const query = search.value.trim().toLocaleLowerCase();
      return OFFERINGS.filter((offering) => {
        const matchingSubject = !subject.value || offering.subject === subject.value;
        const matchingQuery = !query || `${offering.title} ${offering.subject}`.toLocaleLowerCase().includes(query);
        return matchingSubject && matchingQuery;
      });
    }

    function render() {
      const matches = matchingOfferings();
      const shown = matches.slice(0, visible);
      results.replaceChildren();

      shown.forEach((offering) => {
        const isBeta = offering.title.startsWith('[BETA] ');
        const title = isBeta ? offering.title.replace('[BETA] ', '') : offering.title;
        const card = makeElement('article', 'cisco-course-card');
        card.setAttribute('data-sk-component', 'card');
        const heading = makeElement('h3', 'cisco-course-card__title', title);
        const metadata = makeElement('div', 'cisco-course-card__metadata');
        metadata.append(makeElement('span', 'cisco-course-card__subject', offering.subject));
        metadata.append(makeElement('span', 'cisco-course-card__status', 'Accredited'));
        if (isBeta) metadata.append(makeElement('span', 'cisco-course-card__beta', 'Beta'));
        card.append(heading, metadata);
        results.append(card);
      });

      if (!matches.length) {
        results.append(makeElement('p', 'cisco-catalogue__empty', 'No offerings match that search. Try a different course name or subject area.'));
      }

      summary.textContent = matches.length === OFFERINGS.length
        ? `Showing ${Math.min(shown.length, matches.length)} of ${OFFERINGS.length} current course offerings.`
        : `Showing ${shown.length} of ${matches.length} matching course offerings.`;
      more.hidden = shown.length >= matches.length;
      more.textContent = `Show ${Math.min(DISPLAY_LIMIT, matches.length - shown.length)} more offerings`;
    }

    function resetAndRender() {
      visible = DISPLAY_LIMIT;
      render();
    }

    form.addEventListener('submit', (event) => event.preventDefault());
    search.addEventListener('input', resetAndRender);
    subject.addEventListener('change', resetAndRender);
    more.addEventListener('click', () => {
      visible += DISPLAY_LIMIT;
      render();
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialiseCatalogue, { once: true });
  else initialiseCatalogue();
})();
