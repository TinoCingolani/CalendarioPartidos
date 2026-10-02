# Arquitectura, Políticas de Seguridad y Ciclo de Vida de Custom Agents

## 1. Motivación y Arquitectura

En los flujos de desarrollo modernos con inteligencia artificial, un agente monolítico enfrenta dos cuellos de botella:

1. **Contexto Saturado (Context Bloat):** Incorporar todas las directivas de pruebas, linters, bases de datos y convenciones en un único prompt agota la memoria de trabajo del modelo y disminuye su precisión.
2. **Ambigüedad de Permisos:** Ciertas tareas (como ejecutar tests) requieren ejecutar comandos frecuentemente, mientras que otras (como análisis de código) deben ser estrictamente de solo lectura.

Los **Custom Agents** proporcionan aislamiento modular: cada agente cuenta con su propia definición de herramientas, políticas de permisos, instrucciones del sistema y habilidades asociadas.

```
┌─────────────────────────────────────────────────────────────┐
│                      Google Antigravity                     │
│                                                             │
│   ┌─────────────────────────┐     ┌─────────────────────┐   │
│   │   Agente Principal      │     │  Custom Agent       │   │
│   │   (Orquestador)         │────▶│  (Especializado)    │   │
│   │                         │     │  - Contexto Limpio  │   │
│   │   - Contexto general    │     │  - Herramientas     │   │
│   │   - Vista global        │     │    acotadas         │   │
│   └─────────────────────────┘     │  - Políticas auto   │   │
│                                   └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Principio de Simetría (True Symmetry)

A diferencia de muchos frameworks de agentes donde un agente personalizado solo puede ser un ejecutor subordinado (subagente), Antigravity introduce **simetría completa**:

- **Como Main Agent:** Puedes arrancar tu jornada de trabajo directamente interactuando con tu agente especializado.
  - Vía CLI:
    ```bash
    agy --agent modernizador-dependencias
    ```
  - Vía Desktop App / GUI: Seleccionándolo en el dropdown de agentes principales.
- **Como Subagent:** El agente principal puede delegar una subtarea a este agente especializado mediante su ID.

---

## 3. Motor de Permisos y Políticas

Antigravity opera bajo una jerarquía estricta de evaluación de permisos:

$$\text{Deny} > \text{Ask} > \text{Allow}$$

### `permissionMode: acceptEdits`
- Cuando se establece `acceptEdits`, el agente tiene autorización previa para crear (`write_to_file`) o modificar (`replace_file_content`, `multi_replace_file_content`) archivos dentro del espacio de trabajo sin pausar la ejecución para pedir aprobación humana en cada edición.
- Permite iteraciones rápidas de refactorización o corrección de errores.

### `commandExecutionPolicy: auto`
- Autoriza la ejecución desatendida de comandos seguros definidos en el perfil de desarrollo (ej. `npm test`, `git status`, linters).
- Protecciones automáticas: Cualquier comando clasificado como potencialmente destructivo (eliminación de repositorios, operaciones forzadas) requerirá confirmación explícita independientemente de esta bandera.

---

## 4. Prioridad de Resolución y Carga

Cuando se invoca un agente por nombre (ej. `mi-agente`), Antigravity busca en el siguiente orden de precedencia:

1. **Agentes del Proyecto (Workspace):** `.agents/agents/mi-agente.md` o `.agents/agents/mi-agente/agent.md` en la raíz del repositorio.
2. **Agentes de Plugins Activos:** `plugins/<plugin_name>/agents/mi-agente.md`
3. **Agentes Globales del Usuario:** `~/.gemini/config/agents/mi-agente.md`

Si existe un agente con el mismo nombre en el proyecto local y en la configuración global, **el del proyecto local tiene prioridad**, permitiendo sobreescribir comportamientos específicos para un repositorio sin alterar la configuración global del usuario.
