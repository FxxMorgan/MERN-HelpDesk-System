/**
 * Script para generar JWT Secret seguro
 * Ejecutar: node generate-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generador de JWT Secret\n');
console.log('═'.repeat(60));

const secret = crypto.randomBytes(64).toString('hex');

console.log('\nTu nuevo JWT Secret (copia esto en .env):');
console.log('\n' + secret + '\n');

console.log('═'.repeat(60));
console.log('\n✅ Agrega esto a tu archivo .env:');
console.log(`JWT_SECRET=${secret}\n`);
