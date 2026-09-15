# Skunkworks Academy assessment AI service

This Cloudflare Worker provides the server-side boundary for the four public Academy assessment chats. It calls the OpenAI Responses API from the Worker; the browser never receives an API key.

## Deploy

1. Create the `api.skunkworksacademy.com` DNS custom domain in the Cloudflare zone.
2. From this directory, authenticate with Cloudflare and set the secret:

   ```bash
   npx wrangler secret put OPENAI_API_KEY
   ```

3. Deploy the Worker:

   ```bash
   npx wrangler deploy
   ```

4. Verify with an allowed-origin POST to `https://api.skunkworksacademy.com/v1/assessment/chat`. The request must include one of: `member-profile`, `professional-preferences`, `career-goals`, or `learning-readiness`.

The Worker uses `store: false`, limits message and transcript sizes, limits the allowed origin, and only accepts known assessment modes. Apply Cloudflare WAF rate limiting and Turnstile before public launch. `OPENAI_MODEL` may be changed without modifying the client.

## Privacy and governance

- The browser keeps in-progress conversations in its own session storage only.
- This Worker does not persist responses or add them to a learner record.
- Do not make an assessment result an automated employment, admission, performance or funding decision.
- Collect consent and a retention notice before connecting a completed summary to Microsoft 365, CRM or another system of record.
