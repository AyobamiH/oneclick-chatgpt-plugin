# Production deployment

The `Deploy` workflow publishes `src/worker.js` to the `oneclick-chatgpt` Cloudflare Worker and runs the production smoke check.

Required GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

This initial release is anonymous and does not require One Click account or Supabase secrets. Cloudflare configuration uses a current compatibility date, `nodejs_compat`, observability and Analytics Engine binding in line with the [Workers best-practices guidance](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/).
