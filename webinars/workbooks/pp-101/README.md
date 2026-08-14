# PP-101 Personal Productivity Workbook

Static, responsive Skunkworks Academy workbook deployment for:

`https://skunkworksacademy.com/webinars/workbooks/pp-101/`

## Included

- Mandatory participant contact capture before workbook access
- 14 workbook exercises plus the final commitment page
- Tile-based workbook wall navigation
- Responsive desktop, tablet and mobile layout
- Required-field and grouped-choice validation
- Local autosave, restore and clear-draft controls
- Progress tracking that handles the optional seven-day reset correctly
- Light/dark theme control
- Text response counters and limits
- Keyboard shortcuts and accessible completion modal
- Structured PP-101 JSON submission payload
- Coordinator target: `training@skunkworksacademy.com`

## Email delivery

GitHub Pages is a static host and cannot execute email code. Deploy `api-handler.js` to a secure serverless Node.js runtime, configure its environment variables, then set the resulting HTTPS URL in `config.js`.

```js
window.PP101_CONFIG = Object.freeze({
  submissionEndpoint: 'https://your-secure-api.example/api/submit-workbook',
  coordinatorEmail: 'training@skunkworksacademy.com',
  storageKey: 'skunkworks-pp-101-workbook-v2',
  maximumResponseCharacters: 4000
});
```

Never place an email API secret in `config.js` or `index.html`.

Required server environment variables:

```text
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
WORKBOOK_FROM_EMAIL=Skunkworks Academy <workbooks@verified-domain.example>
WORKBOOK_RECIPIENT=training@skunkworksacademy.com
```

Until `submissionEndpoint` is configured, the workbook preserves entries locally and displays a clear configuration message instead of losing responses.
