# Frontend GCP Deployment + CI/CD

This guide deploys the LegalFam React/Vite frontend to Firebase Hosting and sets up CI/CD from GitHub Actions.

Firebase Hosting is the recommended GCP-native target for this frontend because the app builds to static files in `dist/`. The browser should call only the backend API. It should not connect directly to RabbitMQ, n8n, PostgreSQL, Cloud SQL, or the processing API sidecar.

## Target Architecture

```text
Firebase Hosting
  serves React/Vite static files
  -> browser calls Cloud Run backend
      -> Cloud SQL
      -> RabbitMQ VM
      -> n8n Cloud Run webhook
          -> processing-api sidecar
```

## 1. Confirm Values

Confirm these before setup:

```sh
export PROJECT_ID="legalfam-497502"
export PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
export FRONTEND_REPO="LegalFam/frontend"
export DEPLOY_SA_NAME="legalfam-frontend-deployer"
export DEPLOY_SA="$DEPLOY_SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

export BACKEND_URL="https://replace-with-backend-cloud-run-url"
export VITE_API_BASE_URL="$BACKEND_URL/api/v1"

gcloud config set project "$PROJECT_ID"
```

Use the real GitHub repository full name in `FRONTEND_REPO`. In a workflow run, this must match `GITHUB_REPOSITORY`.

## 2. Enable Required Services

```sh
gcloud services enable \
  firebase.googleapis.com \
  firebasehosting.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iamcredentials.googleapis.com
```

## 3. Initialize Firebase Hosting

Open Firebase Console for the same GCP project and enable Firebase if it is not already enabled.

Then initialize Hosting from the `frontend` directory:

```sh
cd frontend
npm install
npm install -g firebase-tools
firebase login
firebase init hosting
```

Use these answers:

```text
Project: legalfam-497502
Public directory: dist
Configure as a single-page app: Yes
Set up automatic builds and deploys with GitHub: No
Overwrite index.html: No
```

The generated `firebase.json` should look like this:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

The SPA rewrite is required so routes such as `/chat` load `index.html` instead of returning a 404.

## 4. Create The Frontend Deployer Service Account

```sh
gcloud iam service-accounts create "$DEPLOY_SA_NAME" \
  --display-name="LegalFam frontend GitHub deployer"
```

Grant Firebase Hosting deployment permissions:

```sh
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$DEPLOY_SA" \
  --role="roles/firebasehosting.admin"
```

The workflow also needs to read project metadata:

```sh
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$DEPLOY_SA" \
  --role="roles/viewer"
```

## 5. Configure Workload Identity Federation

If `agentic-flow` or `backend` already configured the GitHub Workload Identity pool, reuse it.

Existing expected resources:

```text
github-pool
github-provider
```

Inspect the current provider condition:

```sh
gcloud iam workload-identity-pools providers describe github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --format="value(attributeCondition)"
```

Update the provider condition so it allows the frontend repository from `main`.

```sh
export AGENTIC_FLOW_REPO="LegalFam/agentic-flow"
export BACKEND_REPO="LegalFam/backend"
export FRONTEND_REPO="LegalFam/frontend"

gcloud iam workload-identity-pools providers update-oidc github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --attribute-condition="(assertion.repository=='$AGENTIC_FLOW_REPO' || assertion.repository=='$BACKEND_REPO' || assertion.repository=='$FRONTEND_REPO') && assertion.ref=='refs/heads/main'"
```

Allow the frontend GitHub repo to impersonate the deployer service account:

```sh
gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SA" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/$FRONTEND_REPO"
```

Get the provider resource name for GitHub Actions:

```sh
gcloud iam workload-identity-pools providers describe github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --format="value(name)"
```

## 6. Configure GitHub Repository Variables

In the frontend GitHub repository, go to:

```text
Settings > Secrets and variables > Actions > Variables
```

Create these repository variables:

```text
GCP_PROJECT_ID=legalfam-497502
GCP_WORKLOAD_IDENTITY_PROVIDER=<provider-resource-name-from-step-5>
GCP_DEPLOY_SERVICE_ACCOUNT=legalfam-frontend-deployer@legalfam-497502.iam.gserviceaccount.com
VITE_API_BASE_URL=https://replace-with-backend-cloud-run-url/api/v1
```

Do not store frontend Firebase deployment credentials as GitHub secrets. Use Workload Identity Federation instead.

Do not add these backend/internal values to the frontend:

```text
DB_HOST
RABBITMQ_HOST
N8N_WEBHOOK_URL
N8N_AUTH_TOKEN
PROCESSING_API_BASE_URL
JWT_SECRET
```

## 7. Add GitHub Actions Workflow

Create this file in the frontend repository:

```text
.github/workflows/deploy-frontend.yml
```

```yaml
name: Deploy frontend to Firebase Hosting

on:
  push:
    branches:
      - main
    paths:
      - "**"
  workflow_dispatch:

permissions:
  contents: read
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ vars.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ vars.GCP_DEPLOY_SERVICE_ACCOUNT }}

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ vars.VITE_API_BASE_URL }}

      - name: Deploy to Firebase Hosting
        run: npx firebase-tools deploy --only hosting --project "${{ vars.GCP_PROJECT_ID }}"
```

## 8. Manual First Deploy

Before relying on CI/CD, test one local build:

```sh
cd frontend
npm ci
$env:VITE_API_BASE_URL="https://replace-with-backend-cloud-run-url/api/v1"
npm run build
```

Deploy manually:

```sh
npx firebase-tools deploy --only hosting --project legalfam-497502
```

Firebase will print the Hosting URL after deployment.

## 9. Update Backend CORS

After Firebase Hosting gives the frontend URL, update the backend Cloud Run configuration:

```sh
gcloud run services update legalfam-backend \
  --region us-central1 \
  --set-env-vars CORS_ALLOWED_ORIGINS="https://replace-with-frontend-domain"
```

If the backend is deployed through GitHub Actions, update the backend repository variable instead:

```text
CORS_ALLOWED_ORIGINS=https://replace-with-frontend-domain
```

Then rerun the backend deployment workflow.

For first smoke tests, `CORS_ALLOWED_ORIGINS=*` works, but production should use the exact Firebase Hosting or custom domain.

## 10. Verify

Open the deployed Firebase Hosting URL.

Verify the frontend can reach the backend:

1. Sign up or log in.
2. Create a chat session.
3. Send a chat message.
4. Confirm the browser Network tab calls:

```text
https://replace-with-backend-cloud-run-url/api/v1/auth/...
https://replace-with-backend-cloud-run-url/api/v1/chat/...
```

The frontend should not call:

```text
RabbitMQ
n8n webhook directly
Cloud SQL
processing-api
```

## 11. CI/CD Flow

After the workflow is committed:

1. Push to `main`.
2. GitHub Actions authenticates to GCP through Workload Identity Federation.
3. The workflow installs frontend dependencies.
4. The workflow builds the Vite app with `VITE_API_BASE_URL`.
5. The generated `dist/` directory is deployed to Firebase Hosting.

## 12. Cost Notes

Firebase Hosting belongs to the Firebase/GCP ecosystem and uses the linked Google Cloud billing account when the project is on the Blaze plan.

For this project, frontend hosting should usually be low cost because it serves static HTML, CSS, JavaScript, and images. The higher-cost services are more likely to be Cloud SQL, Cloud Run backend, n8n, RabbitMQ VM, Document AI, and Gemini usage.

Use Firebase Hosting unless you specifically need lower-level infrastructure control through Cloud Storage, HTTPS Load Balancing, and Cloud CDN.

## 13. Common Issues

### Frontend calls `/api/v1` on the Firebase domain

This means `VITE_API_BASE_URL` was not set at build time.

Fix the GitHub repository variable:

```text
VITE_API_BASE_URL=https://replace-with-backend-cloud-run-url/api/v1
```

Then rerun the frontend deployment.

### Browser shows CORS errors

Update the backend `CORS_ALLOWED_ORIGINS` to include the Firebase Hosting URL or custom domain, then redeploy the backend.

### Refreshing `/chat` returns 404

Confirm `firebase.json` has the SPA rewrite:

```json
{
  "source": "**",
  "destination": "/index.html"
}
```

### GitHub Actions authentication fails

Confirm:

- `GCP_WORKLOAD_IDENTITY_PROVIDER` is the full provider resource name.
- `GCP_DEPLOY_SERVICE_ACCOUNT` is the frontend deployer service account email.
- The Workload Identity provider condition allows the exact `GITHUB_REPOSITORY`.
- The workflow runs from `refs/heads/main`.

### Firebase deploy fails with permission denied

Confirm the frontend deployer service account has:

```text
roles/firebasehosting.admin
roles/viewer
```
