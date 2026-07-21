# Plan de Trabajo — Deploy a Producción (AWS EC2 Free Tier)

## Objetivo
Subir Crumbs a la nube con costo $0, online al menos 1 semana después del 27 de julio, escalable a futuro.

---

## ¿Por qué EC2 y no otra cosa?

| Opción | Costo (1 semana) | ¿Corre frontend + backend + DB? | Escalable | Problema |
|---|---|---|---|---|
| **EC2 t2.micro** | **$0** | ✅ Sí, todo junto con Docker | ✅ Migra a ECS | **Ninguno — elegida** |
| S3 + CloudFront | $0 | ❌ Solo frontend (archivos estáticos) | ✅ | No corre backend ni DB |
| ECS / Fargate | $5-10 | ✅ | ✅ | No tiene free tier real |
| Lambda + API Gateway | $0 | ⚠️ Requiere reescribir backend como funciones individuales | ✅ | Reescritura de código |
| Amplify | $0 | ❌ Solo frontend, backend limitado a AppSync/Lambda | ⚠️ | No soporta tu backend Python con Docker |
| Lightsail | $3.50 | ✅ | ⚠️ Limitado | No es free tier |
| Railway / Render | $5-7 | ✅ | ✅ | Cuesta desde el día 1 |

---

## Fase 1: Preparación local (25 de julio)
**Tiempo: 1-2 horas**

- [ ] Verificar que `docker compose up` funcione con frontend + backend completos
- [ ] Crear perfil de producción en el docker-compose (`--profile prod`)
- [ ] Configurar variables de entorno de producción (API URL, DB, secrets)
- [ ] Hacer build de producción local y verificar que Nginx sirve correctamente
- [ ] Asegurarse de que el repo en GitHub tenga todo comiteado y limpio

---

## Fase 2: Crear infraestructura en AWS (25-26 de julio)
**Tiempo: 30-45 minutos**

- [ ] Crear cuenta AWS (o usar existente) — necesitan tarjeta, no cobra
- [ ] Lanzar instancia EC2 t2.micro:
  - AMI: Amazon Linux 2023 o Ubuntu 24.04
  - Storage: 30 GB (gratis)
  - Security Group: abrir puertos 22 (SSH), 80 (HTTP), 443 (HTTPS)
- [ ] Asignar Elastic IP (IP fija gratuita mientras la instancia esté corriendo)
- [ ] Guardar el archivo `.pem` (llave SSH) en lugar seguro

---

## Fase 3: Deploy (26 de julio)
**Tiempo: 20-30 minutos**

Conectarse a la EC2 y ejecutar:

```bash
# 1. Instalar Docker
sudo yum install docker git -y
sudo systemctl start docker && sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# 2. Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Clonar y levantar
git clone https://github.com/Selcouthei/Crumbs.git
cd Crumbs
docker compose --profile prod up -d
```

App disponible en: `http://<IP-ELÁSTICA>`

---

## Fase 4: Verificación (26-27 de julio)
**Tiempo: 30 minutos**

- [ ] Probar login/register desde el navegador con la IP pública
- [ ] Verificar que el backend responde correctamente
- [ ] Probar desde otro dispositivo/red (celular con datos)
- [ ] Opcional: apuntar un dominio gratuito

---

## Fase 5: Monitoreo (27 julio — 3 agosto)
**Tiempo: 5 min/día**

- [ ] Verificar que la instancia sigue corriendo
- [ ] Si se cayó: `docker compose up -d` la levanta de nuevo
- [ ] Revisar espacio en disco: `df -h`

---

## Costos

| Recurso | Costo |
|---|---|
| EC2 t2.micro (750 hrs/mes) | $0 |
| EBS 30 GB | $0 |
| Elastic IP (asociada) | $0 |
| Transferencia (<100 GB) | $0 |
| **Total** | **$0** |

---

## Escalabilidad futura (mismo Docker, diferente infraestructura)

| Etapa | Infraestructura | Costo | Usuarios |
|---|---|---|---|
| Demo/universidad | EC2 t2.micro (todo junto) | $0 | 1-50 |
| MVP real | EC2 t3.small + RDS | ~$30/mes | 50-5,000 |
| Producción | ECS Fargate + RDS + CloudFront | ~$80-200/mes | 5,000+ |

**El código y los Dockerfiles no cambian. Solo cambia dónde los corres.**

---

## Riesgos y mitigación

| Riesgo | Solución |
|---|---|
| La instancia se reinicia | `restart: always` en compose |
| Se llena el disco | `.dockerignore` + no guardar logs excesivos |
| Free tier expira | 12 meses de vigencia, suficiente |
| Olvidan apagar después | Alarma de billing en $1 (AWS avisa) |
