export const labs = [
  {id:'L01', module:'A01', title:'Authorization decision review', method:'GET', path:'/api/profile/1?viewer=alice', objective:'Map subject, action, resource and context for profile access.', steps:['Open the profile endpoint in the local lab.', 'Record the viewer and record owner assumptions.', 'Write a server-side decision rule.', 'Create positive and negative verification checks.'], evidence:'Decision rule, observed result and verification checks.'},
  {id:'L02', module:'A02', title:'Hardening baseline review', method:'GET', path:'/api/debug', objective:'Review diagnostics and define production hardening rules.', steps:['Open the debug route.', 'List fields that should not be public.', 'Map controls to configuration, authorization and deployment policy.', 'Write a hardening checklist.'], evidence:'Exposed fields, risk note and hardening checklist.'},
  {id:'L03', module:'A03', title:'Dependency governance review', method:'FILE', path:'./vulnerable-app/package.json', objective:'Review package metadata and release governance.', steps:['Inspect package metadata.', 'Review scripts and runtime requirements.', 'Define dependency review expectations.', 'Document update and rollback steps.'], evidence:'Dependency policy and release-control notes.'},
  {id:'L04', module:'A04', title:'Token design review', method:'GET', path:'/api/token-demo?user=alice', objective:'Assess training-token behaviour and write safe token requirements.', steps:['Request the token demo.', 'Compare repeated output.', 'Explain the risk in design terms.', 'Write requirements for randomness, expiry and validation.'], evidence:'Token observations and safe design requirements.'},
  {id:'L05', module:'A05', title:'Input and output boundary review', method:'GET', path:'/api/orders?customer=alice', objective:'Map input, interpreter boundary and output handling.', steps:['Open the orders route.', 'Identify the bound input value.', 'Explain the difference between validation and safe APIs.', 'Write output-handling guidance.'], evidence:'Input map, boundary notes and remediation guidance.'},
  {id:'L06', module:'A06', title:'Business-rule design review', method:'POST', path:'/api/transfer', objective:'Define secure workflow rules for transfer-style operations.', steps:['Review the transfer scenario.', 'List misuse cases.', 'Define owner, amount, limit and approval controls.', 'Write secure acceptance criteria.'], evidence:'Business rules and acceptance tests.'},
  {id:'L07', module:'A07', title:'Session lifecycle review', method:'GET', path:'/api/session-demo', objective:'Define safe session lifecycle and monitoring requirements.', steps:['Open the session demo.', 'Identify claims that require integrity protection.', 'Write session requirements.', 'List authentication monitoring events.'], evidence:'Session requirements and monitoring event list.'},
  {id:'L08', module:'A08', title:'Profile import allow-list review', method:'POST', path:'/api/import-profile', objective:'Define safe field mapping for profile imports.', steps:['Review normal profile fields.', 'Identify protected fields.', 'Create an allow-list mapping.', 'Define rejection logging.'], evidence:'Allow-list map and protected-field handling.'},
  {id:'L09', module:'A09', title:'Security logging review', method:'GET', path:'/api/log?event=login_failed', objective:'Create structured logging and alerting requirements.', steps:['Send a normal event.', 'Review structured output.', 'Define alert threshold and owner.', 'Write retention and escalation notes.'], evidence:'Structured event, alert rule and escalation owner.'},
  {id:'L10', module:'A10', title:'Safe failure-path review', method:'GET', path:'/api/calculate?items=abc', objective:'Validate safe error responses and fail-closed security decisions.', steps:['Trigger an invalid input case.', 'Review the safe user response.', 'Define protected diagnostic handling.', 'Write failure-path verification checks.'], evidence:'Safe error, diagnostic location and fail-closed rule.'}
];

export const finalAssessment = [
  ['A learner sees another learner record after changing an ID. Category?', ['A01 Broken Access Control','A03 Supply Chain','A09 Logging'], 0],
  ['A public diagnostic page exposes runtime details. Category?', ['A02 Security Misconfiguration','A04 Crypto','A08 Integrity'], 0],
  ['No dependency review or repeatable release process. Category?', ['A03 Software Supply Chain Failures','A05 Injection','A10 Exceptions'], 0],
  ['Predictable reset or invitation values. Category?', ['A04 Cryptographic Failures','A06 Design','A09 Logging'], 0],
  ['Untrusted input reaches an interpreter boundary. Category?', ['A05 Injection','A02 Misconfiguration','A08 Integrity'], 0],
  ['A workflow lacks limit and approval rules. Category?', ['A06 Insecure Design','A07 Authentication','A04 Crypto'], 0],
  ['Session claims lack integrity validation. Category?', ['A07 Authentication Failures','A03 Supply Chain','A10 Exceptions'], 0],
  ['Profile import accepts protected fields. Category?', ['A08 Software or Data Integrity Failures','A02 Misconfiguration','A04 Crypto'], 0],
  ['No alerting on repeated security events. Category?', ['A09 Logging and Alerting Failures','A01 Access Control','A05 Injection'], 0],
  ['A security decision becomes permissive during service failure. Category?', ['A10 Mishandling of Exceptional Conditions','A03 Supply Chain','A07 Authentication'], 0],
  ['A good finding includes:', ['Observation, impact, root cause, remediation and verification','Only a screenshot','Only a tool name'], 0],
  ['Best default for a protected operation is:', ['Deny unless explicitly allowed','Allow unless hidden','Allow then review later'], 0]
];

export const resources = [
  ['OWASP Top 10:2025','https://owasp.org/Top10/2025/'],
  ['OWASP Top Ten Project','https://owasp.org/www-project-top-ten/'],
  ['OWASP ASVS','https://owasp.org/www-project-application-security-verification-standard/'],
  ['OWASP WSTG','https://owasp.org/www-project-web-security-testing-guide/'],
  ['OWASP Cheat Sheet Series','https://cheatsheetseries.owasp.org/'],
  ['NIST SSDF SP 800-218','https://csrc.nist.gov/publications/detail/sp/800-218/final']
];
