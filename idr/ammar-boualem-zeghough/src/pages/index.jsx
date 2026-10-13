import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const cards = [
  ['Career pathway', '/plan/pathway/', 'Move from design into a technical path with staged evidence gates.'],
  ['12-month roadmap', '/plan/roadmap/', 'A phased plan covering foundations, software engineering, cybersecurity and AI.'],
  ['12-week sprint', '/plan/12-week-sprint/', 'A practical first-quarter sprint with weekly deliverables.'],
  ['Curriculum', '/plan/curriculum/', 'Structured learning modules, sequence and completion evidence.'],
  ['Labs', '/plan/labs/', 'Hands-on practice for coding, web development, security and AI.'],
  ['Portfolio projects', '/plan/projects/', 'Capstones designed to demonstrate employable technical capability.'],
  ['KPIs', '/plan/kpis/', 'Measurable progress indicators and review gates.'],
  ['Download & review', '/plan/download-and-review/', 'Download the complete IDR PDF and prepare for mentor reviews.']
];

export default function Home() {
  const pdf = '/idr/ammar-boualem-zeghough/downloads/Ammar_Boualem_Zeghough_Individual_Development_Roadmap.pdf';
  return (
    <Layout title="Ammar Boualem Zeghough IDR" description="Individual Development Roadmap for Ammar Boualem Zeghough">
      <main>
        <section className="heroBlock">
          <div className="container heroGrid">
            <div>
              <p className="eyebrow">Individual Development Roadmap · Respondent 49</p>
              <h1 className="heroTitle">Ammar Boualem Zeghough</h1>
              <p className="lead">
                A structured transition from graphic design into software development,
                cybersecurity and applied AI - built around instructor-led learning,
                practical labs and demonstrable portfolio evidence.
              </p>
              <div className="actionRow">
                <Link className="button button--primary button--lg" to="/plan/12-week-sprint/">Start the 12-week sprint</Link>
                <Link className="button button--secondary button--lg" to="/plan/roadmap/">Open roadmap</Link>
                <a className="button button--secondary button--lg" href={pdf} download>Download full IDR PDF</a>
              </div>
            </div>
            <div className="metricGrid">
              <div className="metric"><span>Current role</span><strong>Designer</strong><small>Graphic Designer</small></div>
              <div className="metric"><span>Learning capacity</span><strong>17-25h</strong><small>potential weekly total</small></div>
              <div className="metric"><span>Primary mode</span><strong>ILT</strong><small>instructor-led learning</small></div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <p className="eyebrow">Development system</p>
            <h2>Build technical depth through evidence, not course completion alone.</h2>
            <div className="cardGrid">
              {cards.map(([title,to,body]) => (
                <Link key={to} className="cardBox routeCard" to={to}>
                  <h3>{title}</h3><p>{body}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
