# Deployment Guide

## Application Details

### Core Technologies
- Node.js (v18+)
- React 18.3.1
- Vite 5.4.2
- TypeScript 5.5.3

### Key Dependencies
```json
{
  "@supabase/supabase-js": "^2.39.7",
  "@tanstack/react-query": "^5.24.1",
  "axios": "^1.6.7",
  "chart.js": "^4.4.1",
  "i18next": "^23.10.1",
  "react": "^18.3.1",
  "react-chartjs-2": "^5.2.0",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.22.2",
  "zod": "^3.22.4"
}
```

## AWS EKS Deployment

### Prerequisites
- Docker
- kubectl
- AWS CLI configured
- Access to AWS EKS cluster
- Helm v3+

### Base Image Configuration

1. **Base Image Selection**
   ```dockerfile
   # Build stage
   FROM node:18-alpine as builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   # Production stage
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name _;
       root /usr/share/nginx/html;
       index index.html;

       # Security headers
       add_header X-Frame-Options "DENY";
       add_header X-XSS-Protection "1; mode=block";
       add_header X-Content-Type-Options "nosniff";
       add_header Referrer-Policy "strict-origin-when-cross-origin";
       add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;";

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, no-transform";
       }
   }
   ```

### Kubernetes Configuration

1. **Namespace Configuration**
   ```yaml
   # namespace.yaml
   apiVersion: v1
   kind: Namespace
   metadata:
     name: vestiva
     labels:
       name: vestiva
       environment: production
   ```

2. **ConfigMap for Environment Variables**
   ```yaml
   # configmap.yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: vestiva-config
     namespace: vestiva
   data:
     VITE_API_URL: "https://api.vestiva.com"
     VITE_ENVIRONMENT: "production"
   ```

3. **Secrets Management**
   ```yaml
   # secret.yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: vestiva-secrets
     namespace: vestiva
   type: Opaque
   data:
     VITE_AUTH_TOKEN: "base64_encoded_token"
   ```

4. **Deployment Configuration**
   ```yaml
   # deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: vestiva-web
     namespace: vestiva
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: vestiva-web
     template:
       metadata:
         labels:
           app: vestiva-web
       spec:
         containers:
         - name: vestiva-web
           image: your-registry.com/vestiva-web:latest
           ports:
           - containerPort: 80
           resources:
             requests:
               cpu: "100m"
               memory: "128Mi"
             limits:
               cpu: "200m"
               memory: "256Mi"
           envFrom:
           - configMapRef:
               name: vestiva-config
           - secretRef:
               name: vestiva-secrets
           livenessProbe:
             httpGet:
               path: /
               port: 80
             initialDelaySeconds: 10
             periodSeconds: 30
           readinessProbe:
             httpGet:
               path: /
               port: 80
             initialDelaySeconds: 5
             periodSeconds: 10
         imagePullSecrets:
         - name: regcred
   ```

5. **Service Configuration**
   ```yaml
   # service.yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: vestiva-web
     namespace: vestiva
   spec:
     type: ClusterIP
     ports:
     - port: 80
       targetPort: 80
       protocol: TCP
     selector:
       app: vestiva-web
   ```

6. **Ingress Configuration**
   ```yaml
   # ingress.yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: vestiva-web
     namespace: vestiva
     annotations:
       kubernetes.io/ingress.class: nginx
       cert-manager.io/cluster-issuer: letsencrypt-prod
       nginx.ingress.kubernetes.io/ssl-redirect: "true"
       nginx.ingress.kubernetes.io/proxy-body-size: "50m"
   spec:
     tls:
     - hosts:
       - vestiva.yourdomain.com
       secretName: vestiva-tls
     rules:
     - host: vestiva.yourdomain.com
       http:
         paths:
         - path: /
           pathType: Prefix
           backend:
             service:
               name: vestiva-web
               port:
                 number: 80
   ```

7. **HorizontalPodAutoscaler Configuration**
   ```yaml
   # hpa.yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: vestiva-web-hpa
     namespace: vestiva
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: vestiva-web
     minReplicas: 3
     maxReplicas: 10
     metrics:
     - type: Resource
       resource:
         name: cpu
         target:
           type: Utilization
           averageUtilization: 80
     - type: Resource
       resource:
         name: memory
         target:
           type: Utilization
           averageUtilization: 80
   ```

### Deployment Steps

1. **Build and Push Docker Image**
   ```bash
   # Build image
   docker build -t your-registry.com/vestiva-web:latest .

   # Push to registry
   docker push your-registry.com/vestiva-web:latest
   ```

2. **Create Namespace and Apply Configurations**
   ```bash
   # Create namespace
   kubectl apply -f k8s/namespace.yaml

   # Create ConfigMap and Secrets
   kubectl apply -f k8s/configmap.yaml
   kubectl apply -f k8s/secret.yaml

   # Apply Kubernetes configurations
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   kubectl apply -f k8s/ingress.yaml
   kubectl apply -f k8s/hpa.yaml
   ```

3. **Verify Deployment**
   ```bash
   # Check deployment status
   kubectl get deployments -n vestiva

   # Check pods
   kubectl get pods -n vestiva

   # Check service
   kubectl get svc -n vestiva

   # Check ingress
   kubectl get ingress -n vestiva

   # Check HPA
   kubectl get hpa -n vestiva
   ```

### Resource Requirements

#### Compute Resources
- **CPU**:
  - Request: 100m per pod
  - Limit: 200m per pod
- **Memory**:
  - Request: 128Mi per pod
  - Limit: 256Mi per pod
- **Storage**: No persistent storage required
- **Network**: 
  - Ingress controller required
  - Load balancer for ingress
  - Network policies for pod isolation

#### Scaling Configuration
- Minimum replicas: 3
- Maximum replicas: 10
- Scale up threshold: 80% CPU/Memory utilization
- Scale down threshold: 60% CPU/Memory utilization

### Monitoring and Logging

1. **Prometheus Metrics**
   ```yaml
   # servicemonitor.yaml
   apiVersion: monitoring.coreos.com/v1
   kind: ServiceMonitor
   metadata:
     name: vestiva-web
     namespace: vestiva
   spec:
     selector:
       matchLabels:
         app: vestiva-web
     endpoints:
     - port: http
     - interval: 30s
   ```

2. **Logging Configuration**
   ```yaml
   # fluentd-config.yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: fluentd-config
     namespace: vestiva
   data:
     fluent.conf: |
       <source>
         @type tail
         path /var/log/containers/vestiva-web-*.log
         pos_file /var/log/fluentd-vestiva.log.pos
         tag vestiva.*
         read_from_head true
         <parse>
           @type json
         </parse>
       </source>
   ```

### Security Configuration

1. **Network Policies**
   ```yaml
   # network-policy.yaml
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: vestiva-web-policy
     namespace: vestiva
   spec:
     podSelector:
       matchLabels:
         app: vestiva-web
     policyTypes:
     - Ingress
     - Egress
     ingress:
     - from:
       - namespaceSelector:
           matchLabels:
             name: ingress-nginx
       ports:
       - protocol: TCP
         port: 80
     egress:
     - to:
       - namespaceSelector:
           matchLabels:
             name: kube-system
       ports:
       - protocol: UDP
         port: 53
   ```

2. **Pod Security Context**
   ```yaml
   # Update deployment.yaml
   spec:
     template:
       spec:
         securityContext:
           runAsNonRoot: true
           runAsUser: 1000
           fsGroup: 2000
         containers:
         - name: vestiva-web
           securityContext:
             allowPrivilegeEscalation: false
             readOnlyRootFilesystem: true
   ```

### Backup and Disaster Recovery

1. **Configuration Backup**
   - Store all Kubernetes manifests in Git
   - Regular backup of ConfigMaps and Secrets
   - Automated backup using Velero

2. **Recovery Procedures**
   ```bash
   # Restore from backup
   velero restore create --from-backup vestiva-backup

   # Verify restoration
   kubectl get all -n vestiva
   ```

### Production Checklist

- [ ] Environment variables configured
- [ ] TLS certificates installed
- [ ] Resource limits set
- [ ] Monitoring enabled
- [ ] Logging configured
- [ ] Backup procedures documented
- [ ] Security policies applied
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Rollback procedures tested
- [ ] High availability verified
- [ ] Network policies configured
- [ ] Pod security policies applied
- [ ] Ingress rules validated
- [ ] SSL/TLS certificates renewed
- [ ] Monitoring alerts configured
- [ ] Log retention policies set
- [ ] Disaster recovery tested
- [ ] Performance baselines established
- [ ] Scaling policies verified