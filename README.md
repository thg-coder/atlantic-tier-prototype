# Atlantic — Booking Widget Prototype

Atlantic is the **mid-tier** prototype of a med-spa booking widget product. It supports paid
consultation booking, direct service booking, returning-patient flow, optional same-day
procedure deposits, and card-on-file capture for post-visit billing. It is **frontend-only**
— no real backend, payments, emails, or calendar integrations. Everything is simulated with
mock data so the widget can be embedded as an iframe on a marketing site as a sales
showcase.

The widget is locked to a ~420px mobile-style layout at every viewport.

## Stack

- Vite + React 18 + Tailwind CSS
- Lucide React for icons
- No external services, no env vars, no API calls
- State via React Context + `useReducer`, mirrored to `sessionStorage` with graceful
  fallback when storage is blocked (e.g. cross-origin iframe privacy)

## Local development

```bash
npm install
npm run dev
```

The widget runs at <http://localhost:5173>. To preview a production build:

```bash
npm run build
npm run preview
```

## Local container test

Build and run the same image used in production:

```bash
npm run docker:build
npm run docker:run
```

Then open <http://localhost:8080>. To verify iframe-friendly headers:

```bash
curl -sI http://localhost:8080 | grep -iE 'content-security-policy|referrer-policy|cache-control'
```

You should see `Content-Security-Policy: frame-ancestors *;` and **no** `X-Frame-Options`.

To test embedded:

```html
<iframe src="http://localhost:8080" width="420" height="800" style="border:0"></iframe>
```

## Deploy to Cloud Run

### Manual deploy

```bash
PROJECT_ID=your-gcp-project
REGION=us-central1
SERVICE=atlantic-prototype
REPO=atlantic

# One-time: create the Artifact Registry repo
gcloud artifacts repositories create "$REPO" \
    --repository-format=docker \
    --location="$REGION" \
    --project="$PROJECT_ID"

# Build & push
gcloud builds submit \
    --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$SERVICE:latest" \
    --project="$PROJECT_ID"

# Deploy
gcloud run deploy "$SERVICE" \
    --image "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$SERVICE:latest" \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --memory 256Mi --cpu 1 \
    --min-instances 0 --max-instances 10 \
    --concurrency 80 --timeout 60s \
    --project "$PROJECT_ID"
```

### Cloud Build pipeline

```bash
gcloud builds submit --config cloudbuild.yaml \
    --substitutions=_SERVICE_NAME=atlantic-prototype,_REGION=us-central1,_REPOSITORY=atlantic
```

Edit `cloudbuild.yaml` to change defaults. `PROJECT_ID` is supplied by Cloud Build at runtime.

### Recommended Cloud Run settings

| Setting        | Value         |
| -------------- | ------------- |
| Memory         | 256 MiB       |
| CPU            | 1             |
| Min instances  | 0             |
| Max instances  | 10            |
| Concurrency    | 80            |
| Timeout        | 60s           |
| Authentication | Allow unauth. |

## Iframe embedding

The Nginx config sets `Content-Security-Policy: frame-ancestors *;` and intentionally **does
not** set `X-Frame-Options`, so the widget can be embedded from any origin. `index.html` is
served `Cache-Control: no-cache` while hashed assets in `/assets/` are served
`Cache-Control: public, max-age=31536000, immutable`.

## Project layout

```
src/
  main.jsx, App.jsx, index.css
  mockData.js                     # services, practitioner, availability generator
  state/                          # reducer, context, path utilities
  utils/                          # storage, format, validation, ics
  components/                     # banner, progress, calendar, choice cards, ...
  screens/                        # one screen per booking step
Dockerfile, nginx.conf, docker-entrypoint.sh, cloudbuild.yaml
```

## Notes

- All copy uses placeholders for the spa: `[Med Spa Name]`, `[Spa Phone Number]`,
  `[Med Spa Address]`. The only proper noun is the practitioner, **Dr. Sarah Chen**, kept
  consistent across all flows.
- Availability is deterministic per session via a seeded PRNG in `mockData.js`. The seed is
  stored in `sessionStorage` so reloads keep the same calendar.
- The Stripe-styled checkout is purely visual — accepts any reasonable input. Demo card
  `4242 4242 4242 4242` works.
