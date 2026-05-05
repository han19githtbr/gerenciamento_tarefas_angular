// Script executado antes do build para gerar os arquivos de environment
// a partir das variáveis de ambiente configuradas no Vercel
const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, 'src', 'environments');

// Garante que o diretório existe
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const apiUrl = process.env.API_URL || 'https://desafio-backend-java.onrender.com';
const googleClientId = process.env.GOOGLE_CLIENT_ID || '384430334755-i64ira308qkl8egqp0bb4k6i89fuf4tr.apps.googleusercontent.com';
const adminEmail = process.env.ADMIN_EMAIL || 'milliance23@gmail.com';

// Gera environment.ts (desenvolvimento)
const envDev = `export const environment = {
  production: false,
  apiUrl: 'http://localhost:8090',
  googleClientId: '${googleClientId}',
  adminEmail: '${adminEmail}'
};
`;

// Gera environment.prod.ts (produção)
const envProd = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  googleClientId: '${googleClientId}',
  adminEmail: '${adminEmail}'
};
`;

fs.writeFileSync(path.join(envDir, 'environment.ts'), envDev);
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), envProd);

console.log('✅ Environment files generated successfully!');
console.log('   apiUrl:', apiUrl);
