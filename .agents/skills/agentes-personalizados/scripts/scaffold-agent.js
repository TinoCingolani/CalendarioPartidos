#!/usr/bin/env node
/**
 * Scaffold Agent Script for Antigravity
 * Usage:
 *   node scaffold-agent.js <name> [description] [--global]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Uso: node scaffold-agent.js <nombre-agente> ["descripción"] [--global]');
  console.log('Ejemplo: node scaffold-agent.js tester-automatizado "Ejecuta pruebas unitarias y e2e"');
  process.exit(1);
}

const isGlobal = args.includes('--global');
const filteredArgs = args.filter(a => a !== '--global');

const agentName = filteredArgs[0].toLowerCase().replace(/[^a-z0-9-]/g, '-');
const description = filteredArgs[1] || `Agente especializado en tareas de ${agentName}.`;

const targetDir = isGlobal
  ? path.join(os.homedir(), '.gemini', 'config', 'agents')
  : path.join(process.cwd(), '.agents', 'agents');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetFile = path.join(targetDir, `${agentName}.md`);

if (fs.existsSync(targetFile)) {
  console.error(`Error: El agente "${agentName}" ya existe en: ${targetFile}`);
  process.exit(1);
}

const template = `---
name: ${agentName}
description: ${description}
model: pro
tools:
  - view_file
  - replace_file_content
  - write_to_file
  - run_command
  - list_dir
mainAgent: true
subagent: true
commandExecutionPolicy: auto
permissionMode: acceptEdits
---

# ${agentName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}

Eres un agente especializado con las siguientes responsabilidades:

## Objetivo
${description}

## Directivas
1. Analizar el contexto antes de actuar.
2. Mantener la consistencia con las convenciones del proyecto.
3. Validar los cambios antes de finalizar.
`;

fs.writeFileSync(targetFile, template, 'utf8');

console.log(`✅ Agente "${agentName}" creado exitosamente.`);
console.log(`📄 Archivo: ${targetFile}`);
console.log(`🚀 Para usarlo: agy --agent ${agentName}`);
