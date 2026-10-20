# Cloudflare D1 Portfolio Database Migration Guide

This guide walks you through migrating your portfolio database (projects, credentials, certifications, and release metadata) from static GitHub files to **Cloudflare D1 (Serverless Edge SQLite Database)**.

---

## 1. Why Migrate to Cloudflare D1?

| Feature | Current (GitHub Static JSON) | Migrated (Cloudflare D1 + Workers) |
|---|---|---|
| **Storage & Queries** | Raw static JSON files | Full relational SQL (`SELECT`, `WHERE`, `ORDER BY`) |
| **Edge Performance** | Served from GitHub Pages origin | Executed at the edge in < 15ms globally |
| **Updating Content** | Requires Git commit & deployment | Direct SQL `INSERT` or authenticated API call |
| **Rate Limits** | 60 unauthenticated requests/hr | 5 Million reads/day on Cloudflare Free Tier |
| **Integration** | Disconnected from Cloudflare Workers | Unified with your existing `contact-gate-worker` & R2 |

---

## 2. Deployment Steps

### Step 1: Create the Cloudflare D1 Database
From your terminal in `cloudflare-d1-migration/`:
```powershell
npx wrangler d1 create portfolio-db
```
*Wrangler will output your unique `database_id`.*

### Step 2: Configure `wrangler.toml`
Paste the `database_id` into `wrangler.toml`:
```toml
name = "irfanfahmi-portfolio-api"
main = "worker.js"
compatibility_date = "2026-10-01"

[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "<PASTE_YOUR_DATABASE_ID_HERE>"
```

### Step 3: Run the Schema & Seed Data
Execute the schema creation and data migration:
```powershell
# 1. Create tables and indices
npx wrangler d1 execute portfolio-db --file=schema.sql --remote

# 2. Populate 26 credentials and 6 core projects
npx wrangler d1 execute portfolio-db --file=seed.sql --remote
```

### Step 4: Deploy the Cloudflare Worker API
```powershell
npx wrangler deploy
```

---

## 3. Public API Endpoints Provided

Once deployed, your Cloudflare Worker serves:
- `GET /api/projects`: Returns all 6 projects with parsed stacks and links.
- `GET /api/credentials`: Returns credentials registry (supports `?category=cisco`, `?category=awards`, etc.).
- `GET /api/credentials/categories`: Returns list of distinct categories for filtering.
- `GET /api/releases/latest`: Returns current live SMC release metadata.

---

## 4. Frontend Integration in `lab/main.js`

To switch `lab/main.js` from local `certificates/registry.json` to Cloudflare D1, simply point the fetch call:

```javascript
// In lab/main.js:
const response = await fetch('https://irfanfahmi-portfolio-api.<your-subdomain>.workers.dev/api/credentials');
const data = await response.json();
```
*(The fallback to local `certificates/registry.json` remains preserved in case of offline browsing).*
