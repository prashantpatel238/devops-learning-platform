# Complete CI/CD Pipeline

This repository includes a full CI/CD pipeline implemented via GitHub Actions in `.github/workflows/full-cicd.yml`.

## Pipeline stages

1. **Build & Test**
   - JavaScript syntax checks for frontend and backend modules.
   - JSON content validation.
   - Content watcher script execution.

2. **Docker Build & Push**
   - Builds frontend image from `Dockerfile.frontend`.
   - Builds backend image from `Dockerfile.backend`.
   - Pushes both images to GHCR with tags:
     - `${GITHUB_SHA}`
     - `latest`

3. **Terraform Infra Changes**
   - Runs `terraform init`, `fmt -check`, `validate`, and `plan`.
   - Optional apply via workflow dispatch input:
     - `terraform_apply=true`

4. **Helm Deploy to Kubernetes**
   - Deploys frontend + backend via Helm chart `helm/devops-learning`.
   - Uses `KUBE_CONFIG_DATA` secret for cluster auth.
   - Injects image repository/tag values from current commit.

5. **Failure Notifications**
   - On any pipeline failure, sends a Slack message if `SLACK_WEBHOOK_URL` is configured.

---

## Required secrets

- `KUBE_CONFIG_DATA` (base64 kubeconfig)
- `SLACK_WEBHOOK_URL` (optional but recommended)

---

## Helm chart structure

- `helm/devops-learning/Chart.yaml`
- `helm/devops-learning/values.yaml`
- `helm/devops-learning/templates/frontend-deployment.yaml`
- `helm/devops-learning/templates/frontend-service.yaml`
- `helm/devops-learning/templates/backend-deployment.yaml`
- `helm/devops-learning/templates/backend-service.yaml`
- `helm/devops-learning/templates/ingress.yaml`

---

## Terraform structure

- `infra/terraform/environments/prod/*`
- `infra/terraform/modules/network/*`

This is a baseline scaffold that can be expanded with EKS node groups, IAM, and supporting infrastructure.
