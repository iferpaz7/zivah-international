#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# SonarQube Local Scanner for ZIVAH International Website
# Linux/macOS Bash equivalent of sonarqube-scan.ps1
# ==============================================================================

TOKEN="${1:-${SONAR_TOKEN:-}}"
SERVER_URL="${2:-${SONAR_HOST_URL:-http://localhost:9000}}"
PROJECT_KEY="${3:-zivah-international-website}"
PROJECT_NAME="${4:-ZIVAH International Website}"

if [ -z "$TOKEN" ]; then
  echo "❌ Error: SonarQube token is required."
  echo "Uso: ./scripts/sonarqube-scan.sh <TOKEN> [SERVER_URL] [PROJECT_KEY] [PROJECT_NAME]"
  echo "Ejemplo: ./scripts/sonarqube-scan.sh squ_xxxxxxxxxxxx"
  exit 1
fi

echo "=================================================="
echo "🚀 Iniciando SonarQube Scan local"
echo "🌐 Servidor: $SERVER_URL"
echo "🔑 Proyecto: $PROJECT_KEY"
echo "=================================================="

# 1. Verificar prerequisitos
echo -e "\n── Verificando prerequisitos"
command -v node >/dev/null 2>&1 || { echo "❌ Node.js no encontrado"; exit 1; }
echo "  ✓ Node.js $(node -v)"

# Scanner
SCANNER_BIN=""
if [ -f "./node_modules/.bin/sonar-scanner-npm" ]; then
  SCANNER_BIN="./node_modules/.bin/sonar-scanner-npm"
elif command -v sonar-scanner >/dev/null 2>&1; then
  SCANNER_BIN="sonar-scanner"
else
  SCANNER_BIN="npx @sonar/scan"
fi
echo "  ✓ Scanner tool: $SCANNER_BIN"

# Check SonarQube server reachable
echo -n "  Verificando $SERVER_URL ... "
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SERVER_URL/api/system/status" || echo "000")
if [ "$HTTP_STATUS" != "200" ]; then
  echo -e "\n❌ No se puede conectar a SonarQube en $SERVER_URL (HTTP $HTTP_STATUS)"
  echo "Asegúrate de que el contenedor esté corriendo y accesible."
  exit 1
fi
echo "OK ✓"

# Check Token
AUTH_HEADER="Authorization: Basic $(echo -n "${TOKEN}:" | base64)"
VALID_RES=$(curl -s -H "$AUTH_HEADER" "$SERVER_URL/api/authentication/validate" || echo "{}")
IS_VALID=$(node -e "try { const d = JSON.parse(process.argv[1]); console.log(d.valid === true ? 'true' : 'false'); } catch { console.log('false'); }" "$VALID_RES")
if [ "$IS_VALID" != "true" ]; then
  echo "❌ Token inválido. Genera uno en $SERVER_URL → My Account → Security → Generate Tokens"
  exit 1
fi
echo "  ✓ Token autenticado correctamente"

# 2. Verificar o crear proyecto
echo -e "\n── Verificando proyecto '$PROJECT_KEY' en SonarQube"
SEARCH_RES=$(curl -s -H "$AUTH_HEADER" "$SERVER_URL/api/projects/search?projects=$PROJECT_KEY" || echo "{}")
EXISTS=$(node -e "try { const d = JSON.parse(process.argv[1]); const exists = (d.components || []).some(c => c.key === '$PROJECT_KEY'); console.log(exists ? 'true' : 'false'); } catch { console.log('false'); }" "$SEARCH_RES")

if [ "$EXISTS" = "true" ]; then
  echo "  ✓ Proyecto ya existe en SonarQube"
else
  echo -n "  Creando proyecto '$PROJECT_KEY' ... "
  curl -s -X POST -H "$AUTH_HEADER" -d "project=$PROJECT_KEY&name=$(echo -n "$PROJECT_NAME" | python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read()))')&mainBranch=main" "$SERVER_URL/api/projects/create" >/dev/null
  echo "OK ✓"
fi

# 3. Ejecutar Sonar Scanner
echo -e "\n── Ejecutando escaneo con Sonar Scanner"
$SCANNER_BIN \
  -Dsonar.host.url="$SERVER_URL" \
  -Dsonar.token="$TOKEN" \
  -Dsonar.projectKey="$PROJECT_KEY" \
  -Dsonar.projectName="$PROJECT_NAME"

echo "  ✓ Escaneo completado y enviado a SonarQube"

# 4. Esperar análisis
echo -e "\n── Esperando procesamiento en SonarQube"
MAX_WAIT=120
INTERVAL=5
WAITED=0
PROCESSED=false

while [ $WAITED -lt $MAX_WAIT ]; do
  sleep $INTERVAL
  WAITED=$((WAITED + INTERVAL))
  echo -ne "  Esperando... ($WAITED/$MAX_WAIT s)\r"

  ANALYSIS_RES=$(curl -s -H "$AUTH_HEADER" "$SERVER_URL/api/project_analyses/search?project=$PROJECT_KEY&ps=1" || echo "{}")
  TOTAL=$(node -e "try { const d = JSON.parse(process.argv[1]); console.log(d.paging?.total || 0); } catch { console.log(0); }" "$ANALYSIS_RES")
  if [ "$TOTAL" -gt 0 ]; then
    PROCESSED=true
    break
  fi
done

echo ""
if [ "$PROCESSED" != "true" ]; then
  echo "⚠️ El análisis está tardando en procesarse. Consulta en: $SERVER_URL/dashboard?id=$PROJECT_KEY"
  exit 0
fi
echo "  ✓ Análisis procesado exitosamente"

# 5. Mostrar métricas
echo -e "\n── Métricas de Calidad del Proyecto"
METRICS="bugs,vulnerabilities,code_smells,coverage,sqale_rating,reliability_rating,security_rating,ncloc,duplicated_lines_density"
MEASURES_RES=$(curl -s -H "$AUTH_HEADER" "$SERVER_URL/api/measures/component?component=$PROJECT_KEY&metricKeys=$METRICS" || echo "{}")

node -e "
const d = JSON.parse(process.argv[1]);
const ratingMap = { '1.0': 'A ✅', '2.0': 'B 🟡', '3.0': 'C 🟠', '4.0': 'D 🔴', '5.0': 'E ⛔' };
const getRating = r => ratingMap[r] || r || 'N/A';
const m = {};
for (const measure of (d.component?.measures || [])) {
  m[measure.metric] = measure.value;
}
console.log('--------------------------------------------------');
console.log('📊 Líneas de Código:   ' + (m['ncloc'] || '0'));
console.log('🐛 Bugs:               ' + (m['bugs'] || '0') + ' (' + getRating(m['reliability_rating']) + ')');
console.log('🔓 Vulnerabilidades:   ' + (m['vulnerabilities'] || '0') + ' (' + getRating(m['security_rating']) + ')');
console.log('👃 Code Smells:        ' + (m['code_smells'] || '0') + ' (' + getRating(m['sqale_rating']) + ')');
console.log('🛡️ Cobertura:          ' + (m['coverage'] ? m['coverage'] + '%' : 'N/A'));
console.log('📄 Líneas Duplicadas:  ' + (m['duplicated_lines_density'] ? m['duplicated_lines_density'] + '%' : '0%'));
console.log('--------------------------------------------------');
" "$MEASURES_RES"

echo -e "\n🔗 Dashboard SonarQube: $SERVER_URL/dashboard?id=$PROJECT_KEY\n"
