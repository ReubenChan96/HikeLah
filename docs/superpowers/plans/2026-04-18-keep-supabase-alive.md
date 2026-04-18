# Keep Supabase Alive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GitHub Actions workflow that pings the Supabase REST API on a schedule to prevent the free-tier database from pausing due to inactivity.

**Architecture:** A scheduled GitHub Actions workflow runs Node.js inline to make a plain `fetch()` request to `{SUPABASE_URL}/rest/v1/` twice a week. Credentials are stored as GitHub repository secrets. No new npm packages are required — Node 18+ has `fetch` built in.

**Tech Stack:** GitHub Actions (YAML cron), Node.js 20 (built-in fetch)

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `.github/workflows/keep-supabase-alive.yml` | Scheduled GitHub Actions workflow that pings the Supabase REST endpoint |

No other files need to be created or modified.

---

### Task 1: Create the GitHub Actions workflow

**Files:**
- Create: `.github/workflows/keep-supabase-alive.yml`

- [ ] **Step 1: Create the `.github/workflows` directory and workflow file**

Create `.github/workflows/keep-supabase-alive.yml` with the following content:

```yaml
name: Keep Supabase Alive

on:
  schedule:
    # Runs at 09:00 UTC every Monday and Thursday
    - cron: "0 9 * * 1,4"
  workflow_dispatch: # allow manual trigger from GitHub UI

jobs:
  ping:
    name: Ping Supabase REST API
    runs-on: ubuntu-latest

    steps:
      - name: Ping Supabase to prevent DB pause
        run: |
          node -e "
          (async () => {
            const url = process.env.SUPABASE_URL;
            const key = process.env.SUPABASE_ANON_KEY;

            if (!url || !key) {
              console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY secret');
              process.exit(1);
            }

            console.log('Pinging:', url);
            console.log('Timestamp:', new Date().toISOString());

            const start = Date.now();
            const res = await fetch(\`\${url}/rest/v1/\`, {
              headers: {
                apikey: key,
                Authorization: \`Bearer \${key}\`,
              },
            });
            const duration = Date.now() - start;

            // 200, 404, or 401 all mean the server is alive
            if (!res.ok && res.status !== 404 && res.status !== 401) {
              console.error('Unexpected status:', res.status);
              process.exit(1);
            }

            console.log('Success! Status:', res.status, '| Response time:', duration + 'ms');
          })();
          "
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

- [ ] **Step 2: Add the two GitHub repository secrets**

Go to your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret name | Value | Where to find it |
|-------------|-------|-----------------|
| `SUPABASE_URL` | `https://<your-project-ref>.supabase.co` | Supabase dashboard → Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | `eyJ...` (anon/public key) | Supabase dashboard → Project Settings → API → Project API keys → `anon public` |

> Use the **anon** key (not the service role key) — it has minimal permissions and is safe to expose in GitHub Actions secrets.

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/keep-supabase-alive.yml
git commit -m "feat: add GitHub Actions workflow to keep Supabase alive"
git push origin main
```

Expected: Vercel auto-deploy is not triggered (no app code changed). GitHub Actions tab shows the new workflow.

- [ ] **Step 4: Verify via manual trigger**

In GitHub → Actions → "Keep Supabase Alive" → **Run workflow** → click green button.

Expected output in the job logs:
```
Pinging: https://<ref>.supabase.co
Timestamp: 2026-04-18T09:00:00.000Z
Success! Status: 200 | Response time: 312ms
```

If you see `Status: 404` that is also fine — it still means the server is alive and accepting requests.

---

## Self-Review

**Spec coverage:**
- ✅ Pings Supabase REST API to prevent DB pause — covered by Task 1
- ✅ Runs on a schedule — `cron: "0 9 * * 1,4"` (Mon + Thu, 9 AM UTC)
- ✅ Manual trigger — `workflow_dispatch`
- ✅ Credentials via secrets — `SUPABASE_URL` + `SUPABASE_ANON_KEY`
- ✅ No new npm packages — uses Node 20 built-in `fetch`

**Placeholder scan:** None — full YAML content is provided inline.

**Type consistency:** N/A — single-file YAML, no cross-task type references.
