# Especificación y Esquema de YAML Frontmatter para Custom Agents

En Google Antigravity, la configuración de un agente personalizado se define en el bloque inicial de **YAML frontmatter** delimitado por triple guion (`---`). Este bloque define el runtime, las herramientas autorizadas, los permisos de ejecución y los modelos de IA asignados.

---

## Esquema de Campos

### `name` *(Obligatorio)*
- **Tipo:** `string`
- **Formato:** `kebab-case` (letras minúsculas, números y guiones). No usar espacios ni caracteres especiales.
- **Descripción:** Identificador único del agente en el sistema. Se utiliza al invocarlo por CLI (`agy --agent <name>`), por GUI y en llamadas a subagentes.
- **Ejemplo:** `name: dependency-modernizer`

### `description` *(Obligatorio)*
- **Tipo:** `string`
- **Descripción:** Resumen claro y conciso del propósito del agente. Esta descripción es evaluada por el agente orquestador para determinar cuándo delegar tareas a este agente como subagente.
- **Ejemplo:** `description: "Especialista en actualizar paquetes npm y resolver breaking changes."`

### `model` *(Opcional)*
- **Tipo:** `string`
- **Valores comunes:** `pro`, `flash`, o nombres específicos de modelos compatibles en Antigravity.
- **Predeterminado:** Modelo por defecto del entorno si no se especifica.
- **Uso:** Asignar modelos de alta capacidad (`pro`) a tareas complejas de arquitectura o modelos más rápidos (`flash`) para tareas ligeras de formateo o inspección.

### `tools` *(Opcional)*
- **Tipo:** `string[]` (Lista de strings)
- **Descripción:** Lista blanca explícita de herramientas que el agente tiene permitido invocar. Aislar las herramientas reduce el espacio de estados y previene acciones fuera de contexto.
- **Herramientas habituales:**
  - `view_file`: Ver contenido de archivos.
  - `replace_file_content`: Editar archivos existentes.
  - `multi_replace_file_content`: Ediciones no contiguas en archivos.
  - `write_to_file`: Crear o sobreescribir archivos.
  - `run_command`: Ejecutar comandos en terminal.
  - `list_dir`: Listar directorios.
  - `grep_search`: Búsqueda por expresiones regulares.
  - `search_web`: Consultar fuentes web.
  - `invoke_subagent`: Delegar en otros subagentes.
- **Ejemplo:**
  ```yaml
  tools:
    - view_file
    - grep_search
    - list_dir
  ```

### `skills` *(Opcional)*
- **Tipo:** `string[]` (Lista de strings)
- **Descripción:** Habilidades (`skills`) que este agente puede consultar y cargar en su contexto mediante *progressive disclosure*.
- **Ejemplo:**
  ```yaml
  skills:
    - agy-customizations
    - testing-framework
  ```

### `mainAgent` *(Opcional)*
- **Tipo:** `boolean`
- **Predeterminado:** `false`
- **Descripción:** Indica si el agente puede seleccionarse como agente primario en la interfaz gráfica (selector desplegable) o iniciarse directamente con el comando `agy --agent <nombre>`.

### `subagent` *(Opcional)*
- **Tipo:** `boolean`
- **Predeterminado:** `false`
- **Descripción:** Determina si el agente puede ser descubierto y activado como un subagente por el agente orquestador principal mediante `invoke_subagent`.

### `commandExecutionPolicy` *(Opcional)*
- **Tipo:** `string`
- **Valores comunes:**
  - `auto`: Permite la ejecución autónoma de comandos terminales no destructivos (ej. compilación, linters, tests) sin requerir confirmación interactiva continua.
  - `manual`: Solicita confirmación explícita del usuario para cada comando ejecutado.
- **Seguridad:** Aún con `auto`, comandos de alto riesgo (como borrado masivo o comandos destructivos) permanecen sujetos a las reglas de seguridad de Antigravity.

### `permissionMode` *(Opcional)*
- **Tipo:** `string`
- **Valores comunes:**
  - `acceptEdits`: Aprueba y aplica automáticamente las ediciones de archivos creados o modificados sin pausar en cada paso.
  - `review`: Requiere revisión manual previa de los diffs antes de persistir los cambios en disco.

### `mcpServers` *(Opcional)*
- **Tipo:** `string[]` (Lista de nombres de servidores configurados)
- **Descripción:** Lista de servidores Model Context Protocol (MCP) autorizados para conectarse a este agente.
- **Ejemplo:**
  ```yaml
  mcpServers:
    - postgres-database
    - github-tools
  ```

---

## Validación

Al guardar un agente:
1. El archivo debe poseer extensión `.md`.
2. Las claves del frontmatter deben tener sangría válida de 2 espacios.
3. Si se define `mainAgent: true` o `subagent: true`, al menos uno de los dos debe estar habilitado para que el agente sea accesible.
