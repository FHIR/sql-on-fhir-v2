# SQL on FHIR Helm Chart

This Helm chart deploys the SQL on FHIR server on a Kubernetes cluster.

## Features

- Health probes for reliable deployments (startup, liveness, readiness)
- Optional persistent storage for the SQLite database
- ConfigMap support for non-sensitive configuration
- Resource requests and limits configuration
- Pod scheduling controls (node selector, tolerations, affinity)
- Runs as non-root user for security

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+

## Installation

### Basic installation

Install the chart with the release name `my-sql-on-fhir`:

```bash
helm install my-sql-on-fhir ./helm
```

### Installation with custom values

Create a `custom-values.yaml` file:

```yaml
sqlOnFhir:
  image: "sql-on-fhir-server:1.0.0"

  persistence:
    enabled: true
    size: "5Gi"
    storageClass: "standard"

  resources:
    requests:
      memory: "512Mi"
      cpu: "250m"
    limits:
      memory: "1Gi"
      cpu: "500m"

  config:
    LOG_LEVEL: "debug"
    NODE_ENV: "production"
```

Install with custom values:

```bash
helm install my-sql-on-fhir ./helm -f custom-values.yaml
```

### Installation in a specific namespace

```bash
kubectl create namespace sql-on-fhir
helm install my-sql-on-fhir ./helm -n sql-on-fhir
```

## Configuration

The following table lists the configurable parameters and their default values.

| Parameter                                                 | Description                                            | Default                      |
|-----------------------------------------------------------|--------------------------------------------------------|------------------------------|
| `sqlOnFhir.image`                                         | Container image to use                                 | `sql-on-fhir-server:latest`  |
| `sqlOnFhir.imagePullPolicy`                               | Image pull policy                                      | `IfNotPresent`               |
| `sqlOnFhir.resources`                                     | Resource requests and limits                           | `{}` (unset)                 |
| `sqlOnFhir.config`                                        | Non-sensitive environment variables as key-value pairs | `{}`                         |
| `sqlOnFhir.persistence.enabled`                           | Enable persistent storage for database                 | `false`                      |
| `sqlOnFhir.persistence.storageClass`                      | Storage class for PVC                                  | `""` (default storage class) |
| `sqlOnFhir.persistence.size`                              | Size of persistent volume                              | `1Gi`                        |
| `sqlOnFhir.persistence.accessMode`                        | Access mode for PVC                                    | `ReadWriteOnce`              |
| `sqlOnFhir.service.type`                                  | Kubernetes service type                                | `ClusterIP`                  |
| `sqlOnFhir.service.port`                                  | Service port                                           | `3000`                       |
| `sqlOnFhir.healthProbes.enabled`                          | Enable health probes                                   | `true`                       |
| `sqlOnFhir.healthProbes.path`                             | HTTP path for health checks                            | `/metadata`                  |
| `sqlOnFhir.healthProbes.startupProbe.initialDelaySeconds` | Initial delay for startup probe                        | `10`                         |
| `sqlOnFhir.healthProbes.startupProbe.periodSeconds`       | Period for startup probe                               | `5`                          |
| `sqlOnFhir.healthProbes.startupProbe.failureThreshold`    | Failure threshold for startup probe                    | `30`                         |
| `sqlOnFhir.healthProbes.livenessProbe.periodSeconds`      | Period for liveness probe                              | `30`                         |
| `sqlOnFhir.healthProbes.livenessProbe.failureThreshold`   | Failure threshold for liveness probe                   | `3`                          |
| `sqlOnFhir.healthProbes.readinessProbe.periodSeconds`     | Period for readiness probe                             | `10`                         |
| `sqlOnFhir.healthProbes.readinessProbe.failureThreshold`  | Failure threshold for readiness probe                  | `3`                          |
| `sqlOnFhir.nodeSelector`                                  | Node selector for pod assignment                       | `{}`                         |
| `sqlOnFhir.tolerations`                                   | Tolerations for pod assignment                         | `[]`                         |
| `sqlOnFhir.affinity`                                      | Affinity rules for pod assignment                      | `{}`                         |

## Examples

### Example 1: Development deployment

Simple deployment for development without persistence:

```bash
helm install dev-sql-on-fhir ./helm
```

Access the service:

```bash
kubectl port-forward svc/dev-sql-on-fhir-service 3000:3000
```

Then open http://localhost:3000 in your browser.

### Example 2: Deployment with persistence

Create `custom-values.yaml`:

```yaml
sqlOnFhir:
  image: "sql-on-fhir-server:1.0.0"
  imagePullPolicy: "Always"

  persistence:
    enabled: true
    size: "10Gi"
    storageClass: "fast-ssd"

  resources:
    requests:
      memory: "1Gi"
      cpu: "500m"
    limits:
      memory: "2Gi"
      cpu: "1000m"

  config:
    LOG_LEVEL: "info"

  service:
    type: "LoadBalancer"
```

Deploy:

```bash
helm install my-sql-on-fhir ./helm -f custom-values.yaml
```

### Example 3: Deployment with node affinity

Deploy to nodes with SSD storage:

```yaml
sqlOnFhir:
  persistence:
    enabled: true
    size: "5Gi"

  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: storage-type
            operator: In
            values:
            - ssd
```

## Upgrading

### Upgrade to a new version

```bash
helm upgrade my-sql-on-fhir ./helm
```

### Upgrade with new values

```bash
helm upgrade my-sql-on-fhir ./helm -f custom-values.yaml
```

## Uninstalling

To uninstall the chart:

```bash
helm uninstall my-sql-on-fhir
```

This removes all resources created by the chart. If persistence was enabled, the PVC will remain and must be deleted manually:

```bash
kubectl delete pvc my-sql-on-fhir-pvc
```

## Troubleshooting

### Check pod status

```bash
kubectl get pods -l app=my-sql-on-fhir
```

### View pod logs

```bash
kubectl logs -l app=my-sql-on-fhir
```

### Check service endpoints

```bash
kubectl get endpoints my-sql-on-fhir-service
```

### Test connectivity

```bash
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- curl http://my-sql-on-fhir-service:3000/metadata
```
