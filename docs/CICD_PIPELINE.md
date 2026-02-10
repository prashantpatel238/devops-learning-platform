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

---

## Production Kubernetes requirements and why they matter

### 1) Horizontal Pod Autoscaler (HPA)
- **Why required:** Production traffic is bursty. HPA prevents manual scaling bottlenecks and reduces downtime risk during spikes.
- **Implemented:** `frontend-hpa.yaml`, `backend-hpa.yaml` using CPU utilization targets.

### 2) Resource requests and limits
- **Why required:** Prevents noisy-neighbor issues and enforces fair scheduling. Limits stop runaway workloads from starving cluster nodes.
- **Implemented:** `values.yaml` resource blocks for frontend/backend and deployment templates.

### 3) Liveness/readiness probes
- **Why required:** Readiness prevents traffic to unhealthy pods; liveness restarts stuck processes automatically.
- **Implemented:** HTTP health probes in frontend/backend Deployments.

### 4) Secrets management
- **Why required:** API keys/signing values must never be hardcoded in images or plaintext config maps.
- **Implemented:** `backend-secret.yaml` and `envFrom.secretRef` in backend deployment.

### 5) Separate namespaces (dev/stage/prod)
- **Why required:** Environment isolation reduces blast radius, simplifies RBAC/policy boundaries, and enables safe promotion.
- **Implemented:**
  - Namespace template (`namespace.yaml`)
  - environment values files (`values-dev.yaml`, `values-stage.yaml`, `values-prod.yaml`)
  - CI deploy defaults to prod values.
