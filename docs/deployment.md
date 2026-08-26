# Production deployment

The `Deploy` workflow publishes `src/worker.js` to the `oneclick-chatgpt` Cloudflare Worker and runs the production smoke check.

Required GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Optional secrets enable authenticated Full Mode:

- `ONECLICK_SUPABASE_URL`
- `ONECLICK_SUPABASE_PUBLISHABLE_KEY`

The workflow treats a missing optional pair as a safe Basic Mode deployment. It never prints secret values. Cloudflare configuration uses the current compatibility date, `nodejs_compat`, observability and Analytics Engine binding in line with the [Workers best-practices guidance](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/).

