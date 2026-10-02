---
name: agentes-personalizados
description: >-
  Guía completa para diseñar, estructurar, configurar y desplegar Custom Agents (agentes personalizados) en Google Antigravity (v2.0+). Utiliza esta habilidad cuando el usuario necesite crear un nuevo agente especializado, configurar herramientas y permisos específicos, estructurar agentes de proyecto o globales, o entender la arquitectura de agentes personalizados introducida en el blog de Google Antigravity.
---

# Habilidad: Agentes Personalizados (Custom Agents) en Antigravity

Esta habilidad proporciona las directrices oficiales, especificaciones de configuración y mejores prácticas para crear y gestionar **Custom Agents** en Google Antigravity, basándose en la funcionalidad presentada en [Introducing Custom Agents](https://antigravity.google/blog/introducing-custom-agents).

---

## 1. ¿Qué es un Custom Agent?

Los **Custom Agents** resuelven dos problemas fundamentales en asistentes de codificación de propósito general:
1. **Falta de especialización:** Evitan tener que repetir constantemente convenciones de proyecto, arquitecturas, comandos de test o flujos específicos.
2. **Saturación del contexto (Context Window Bloat):** Reducen el desperdicio de tokens al acotar el prompt del sistema, las herramientas disponibles y las restricciones únicamente a lo que ese rol específico necesita.

### Diferencias clave: Rules vs. Skills vs. Custom Agents

| Tipo | Archivo / Ubicación | Propósito | Cuándo se usa |
| :--- | :--- | :--- | :--- |
| **Rules** | `AGENTS.md`, `.agents/rules/*.md` | Guías de estilo, restricciones locales y directivas que se inyectan en el contexto. | Para fijar convenciones de código transversales a cualquier agente. |
| **Skills** | `.agents/skills/<nombre>/SKILL.md` | Procedimientos paso a paso ("runbooks") y flujos cargados bajo demanda (*progressive disclosure*). | Cuando cualquier agente necesita aprender a realizar una tarea procedural concreta. |
| **Custom Agents** | `.agents/agents/<nombre>.md` | Un bucle de agente independiente con sus propias herramientas, modelo, permisos y prompt del sistema. | Cuando se requiere un rol especializado (ej. Modernizador de dependencias, Revisor de código, Diseñador de BD). |

---

## 2. Ubicaciones de Almacenamiento

Antigravity descubre agentes automáticamente en dos niveles:

- **A nivel de Proyecto (Workspace):**
  - Ruta: `.agents/agents/`
  - Uso: Agentes compartidos con el equipo mediante el control de versiones (Git).
  - Formatos admitidos:
    - Archivo individual: `.agents/agents/<nombre-agente>.md`
    - Directorio modular: `.agents/agents/<nombre-agente>/agent.md`

- **A nivel Global (Usuario):**
  - Ruta: `~/.gemini/config/agents/` (en Windows: `%USERPROFILE%\.gemini\config\agents\`)
  - Uso: Agentes personales disponibles en cualquier proyecto del desarrollador.

---

## 3. Estructura de un Custom Agent

Un agente se define mediante un archivo Markdown (`.md`) compuesto por un encabezado **YAML Frontmatter** (metadatos y configuración del entorno de ejecución) y un cuerpo Markdown (instrucciones del sistema y rol).

### Plantilla Básica

```markdown
---
name: mi-agente-especializado
description: Descripción clara del rol del agente y cuándo debe ser invocado.
model: pro
tools:
  - view_file
  - replace_file_content
  - run_command
skills:
  - agy-customizations
mainAgent: true
subagent: true
commandExecutionPolicy: auto
permissionMode: acceptEdits
---

# Instrucciones del Sistema

Eres un agente especializado en...

## Responsabilidades
1. Analizar...
2. Ejecutar...

## Directrices y Limitaciones
- Mantén siempre...
- No modifiques archivos fuera de...
```

---

## 4. Configuración del YAML Frontmatter

Consulta la [Guía Completa del Esquema Frontmatter](./references/frontmatter-schema.md) para conocer todos los detalles de cada campo.

| Campo | Tipo | Obligatorio | Descripción |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Sí | Identificador único en minúsculas y guiones (kebab-case). |
| `description` | `string` | Sí | Resumen del rol y propósito del agente. |
| `model` | `string` | No | Modelo asignado (`pro`, `flash`, etc.). |
| `tools` | `string[]` | No | Lista explícita de herramientas permitidas. Si se omite, hereda herramientas estándar. |
| `skills` | `string[]` | No | Lista de habilidades accesibles para este agente. |
| `mainAgent` | `boolean` | No | `true` si puede seleccionarse como agente principal en la UI o CLI. |
| `subagent` | `boolean` | No | `true` si otros agentes pueden delegarle tareas como subagente. |
| `commandExecutionPolicy` | `string` | No | Política de comandos (ej. `auto` para ejecución desatendida segura). |
| `permissionMode` | `string` | No | Nivel de permisos de archivos (ej. `acceptEdits` para aplicar cambios sin confirmación paso a paso). |
| `mcpServers` | `string[]` | No | Servidores de protocolo MCP que este agente puede utilizar. |

---

## 5. Simetría: Uso en CLI y GUI

A diferencia de otros entornos donde los agentes personalizados solo actúan como subagentes subordinados, en Antigravity existe **simetría total**:

1. **Como Agente Principal desde CLI:**
   ```bash
   agy --agent dependency-modernizer
   ```
2. **Como Agente Principal desde Antigravity 2.0 (GUI):**
   - Selecciona el agente directamente desde el menú desplegable de agentes en la interfaz.
3. **Como Subagente:**
   - Un agente principal puede invocar al agente personalizado mediante la herramienta `invoke_subagent` cuando `subagent: true`.

Para más detalles sobre la arquitectura y el ciclo de vida, consulta la [Guía de Arquitectura y Ciclo de Vida](./references/architecture-and-lifecycle.md).

---

## 6. Procedimiento para Crear un Agente

1. **Definir el alcance:** Identifica qué herramientas y permisos estrictamente necesita para no sobrecargar el contexto.
2. **Crear el directorio si no existe:**
   - En el proyecto: `.agents/agents/`
3. **Escribir el archivo del agente:**
   - Ej: `.agents/agents/mi-agente.md`
4. **Verificar la sintaxis YAML y los permisos:**
   - Valida que `name` no tenga espacios.
   - Ajusta `permissionMode` y `commandExecutionPolicy` según la criticidad de la tarea.
5. **Comprobar la disponibilidad:**
   - Reinicia la sesión de Antigravity o verifica con `agy --agent <nombre>`.

---

## 7. Referencias y Ejemplos

- [Esquema y Referencia de Frontmatter](./references/frontmatter-schema.md)
- [Arquitectura, Políticas de Seguridad y Ciclo de Vida](./references/architecture-and-lifecycle.md)
- [Ejemplo 1: Modernizador de Dependencias](./examples/dependency-modernizer.md)
- [Ejemplo 2: Revisor de Código Estricto](./examples/code-reviewer.md)
- [Script Utilidad: Generador de Agentes](./scripts/scaffold-agent.js)
