# ¿Quién Quiere Ser Millonario? - ¡Tu App Educativa Personalizable!

Este repositorio contiene una versión modular del famoso juego **¿Quién Quién Quiere Ser Millonario?**, diseñada específicamente para fines educativos. Lo mejor de todo es que puedes adaptar fácilmente el contenido del juego a **cualquier tema** que desees, ¡simplemente proporcionando un nuevo banco de preguntas!

---

## 🚀 Pruébala y Conoce la Versión Original

* **Aplicación Original (en vivo):** 🌐 <https://eboixader.github.io/magnitunid/>

* **Código Fuente Original:** 🔗 <https://github.com/eboixader/magnitunid>

* **Comunidad:** Este proyecto fue compartido por @Ernesto Boixader en el grupo de Vibe Coding Educativo. ¡Únete a la conversación! 📣 <https://t.me/vceduca>

---

## 🛠️ ¿Cómo funciona?

La aplicación está centrada en el tema de **magnitudes y unidades**, pero su estructura modular permite reutilizar la lógica del juego con diferentes conjuntos de preguntas. Esto significa que puedes transformarla en un juego de "¿Quién Quiere Ser Millonario?" sobre historia, geografía, matemáticas o ¡lo que se te ocurra!

**¡Novedad!** Ahora, las preguntas no están almacenadas localmente en el proyecto. En su lugar, la aplicación carga las preguntas dinámicamente desde una URL externa (¡idealmente un Gist de GitHub con un archivo JSON!). Esto te permite cambiar el conjunto de preguntas sin modificar el código fuente de la aplicación.

---

## 📂 Estructura del Proyecto

Para entender cómo funciona la app, aquí tienes un desglose de los archivos clave:

* `index.html`: La base de la aplicación. Contiene la estructura principal del juego.
* `styles.css`: Define la apariencia visual de la app, controlando colores, fuentes y disposición.
* `main.js`: El corazón de la lógica del juego. Maneja el flujo del juego, la interacción con las preguntas, los botones de control, la **carga de preguntas desde URL externa** y el estado general.
* `ui.js`: Contiene funciones relacionadas con la interfaz de usuario, como cargar preguntas en la pantalla, actualizar la escalera de premios y marcar respuestas.
* `helpers.js`: Un módulo con funciones de utilidad, como mezclar arrays y mostrar/ocultar mensajes modales.
* `lifelines.js`: Implementa la lógica de las ayudas del juego (50:50, Llamada a un Amigo, y Voto del Público).
* `questions.js`: **(Ahora opcional/ejemplo)** Originalmente contenía las preguntas. Ahora la aplicación carga las preguntas dinámicamente desde una URL que tú proveas. Puedes mantener este archivo como un ejemplo de formato o para un conjunto de preguntas de respaldo si lo deseas.

---

## 💻 Primeros Pasos: Clona el Repositorio

Para empezar a trabajar en tu propia versión de esta aplicación, el primer paso es clonar este repositorio a tu máquina local.

1.  **Haz un "Fork" del repositorio (si aún no lo has hecho):**
    * Ve al repositorio original en GitHub: `https://github.com/eboixader/magnitunid`
    * En la esquina superior derecha, haz clic en el botón **"Fork"**. Esto creará una copia de este repositorio en tu propia cuenta de GitHub (`https://github.com/tu-usuario/magnitunid`).

2.  **Clona tu "Fork" a tu máquina local:**
    * Ve a **tu nuevo repositorio forkeado** en GitHub (el que está bajo tu cuenta, no el original de Ernesto).
    * Haz clic en el botón **"Code"** (Código).
    * Copia la URL HTTPS de tu fork (ej., `https://github.com/tu-usuario/magnitunid.git`).
    * Abre tu **terminal** o **Git Bash**.
    * Navega a la carpeta donde quieres guardar el proyecto. Por ejemplo, para ir a tu Escritorio en Windows:
        ```bash
        cd C:/Users/TuUsuario/Desktop
        # O en macOS/Linux: cd ~/Desktop
        ```
    * Ejecuta el comando `git clone` seguido de la URL que copiaste:
        ```bash
        git clone [https://github.com/tu-usuario/magnitunid.git](https://github.com/tu-usuario/magnitunid.git)
        ```
    * Navega dentro de la carpeta del proyecto recién clonado:
        ```bash
        cd magnitunid # o quien-quiere-ser-millonario-page si lo renombraste
        ```

¡Listo! Ya tienes una copia local del proyecto y puedes empezar a hacer tus modificaciones.

---

## 💡 Cómo Personalizar el Contenido (¡Tus Preguntas!)

La clave para personalizar este juego es tu **archivo de preguntas JSON**.

1.  **Crea tu archivo JSON de Preguntas:**
    * Este archivo debe ser un **array de objetos JSON**, donde cada objeto representa una pregunta. El formato debe ser el siguiente:

        ```json
        [
          {
            "question": "¿Cuál es la capital de Francia?",
            "options": { "A": "Berlín", "B": "Londres", "C": "París", "D": "Roma" },
            "correct": "C",
            "difficulty": "easy"
          },
          // ... más preguntas
        ]
        ```
    * **`question`**: El texto de la pregunta.
    * **`options`**: Un objeto con claves `A`, `B`, `C`, `D` y sus respectivos textos de respuesta.
    * **`correct`**: La letra (`"A"`, `"B"`, `"C"`, `"D"`) de la opción correcta.
    * **`difficulty`**: La dificultad de la pregunta (valores permitidos: `"easy"`, `"medium"`, `"hard"`, `"very-hard"`, `"expert"`).

2.  **Genera tus Preguntas (opcional, pero útil):**
    * ¿Necesitas generar preguntas rápidamente? Puedes usar herramientas como **Gemini** o **ChatGPT** para generarlas automáticamente. Aquí te dejamos un **prompt sugerido** (adapta `[REEMPLAZA ESTO CON TU TEMA]`):

        ```
        Quiero que generes un banco de preguntas y respuestas en formato JSON. Cada pregunta debe tener las siguientes propiedades: question (la pregunta en sí), options (un objeto con 4 opciones de respuesta etiquetadas A, B, C, D), correct (la letra de la opción correcta), y difficulty (la dificultad de la pregunta, que puede ser "easy", "medium", "hard", "very-hard" o "expert").

        El tema de las preguntas debe ser "[REEMPLAZA ESTO CON TU TEMA]".

        Necesito un total de 60 preguntas, distribuidas de la siguiente manera:

        - 12 preguntas de dificultad "easy"
        - 12 preguntas de dificultad "medium"
        - 12 preguntas de dificultad "hard"
        - 12 preguntas de dificultad "very-hard"
        - 12 preguntas de dificultad "expert"

        Asegúrate de que las preguntas sean variadas dentro del tema y que las opciones de respuesta sean plausibles para dificultar la elección sin que sean trampas evidentes.

        Aquí tienes un ejemplo del formato que espero:

        [
          {
            "question": "¿Cuál es la unidad de medida estándar de la longitud en el Sistema Internacional (SI)?",
            "options": { "A": "Kilogramo", "B": "Segundo", "C": "Metro", "D": "Amperio" },
            "correct": "C",
            "difficulty": "easy"
          }
        ]
        ```

3.  **Aloja tu archivo JSON en una URL pública (¡Recomendado Gist!):**
    * Una vez que tengas tu archivo JSON, súbelo a un servicio que te proporcione una URL pública directa al contenido del archivo. **GitHub Gist** es una excelente opción:
        1.  Ve a `gist.github.com`.
        2.  Pega el contenido de tu JSON.
        3.  Dale un nombre de archivo (ej., `preguntas.json`).
        4.  Haz clic en "Create public gist".
        5.  Una vez creado, haz clic en el botón **"Raw"** para obtener la URL directa al archivo JSON. Esta URL se verá algo como `https://gist.githubusercontent.com/TU_USUARIO/TU_ID_DEL_GIST/raw/nombre_del_archivo.json`. ¡Copia esta URL!

---

## ▶️ Cómo Ejecutar el Juego (¡Importante!)

Debido a las políticas de seguridad del navegador (CORS - Cross-Origin Resource Sharing), la forma en que ejecutes el juego es crucial para que cargue las preguntas desde una URL externa.

### 1. En tu máquina local (para desarrollo)

No puedes simplemente abrir `index.html` directamente desde tu sistema de archivos (`file://`) y esperar que cargue preguntas de una URL externa (`https://`). Necesitas un servidor web local.

* **Usando la extensión "Live Server" (Recomendado para usuarios de VS Code):**
    * Si usas Visual Studio Code, instala la extensión "Live Server".
    * Abre la carpeta de tu proyecto en VS Code.
    * Haz clic derecho en `index.html` en el explorador de archivos y selecciona **"Open with Live Server"**.
    * Esto abrirá el juego en tu navegador con una URL como `http://127.0.0.1:5500/index.html`.

* **Usando Python (si tienes Python instalado):**
    * Abre tu terminal (Git Bash, Símbolo del Sistema o PowerShell).
    * Navega a la carpeta raíz de tu proyecto (la que clonaste, ej., `magnitunid`).
    * Ejecuta el comando: `python -m http.server 8000`
    * Abre tu navegador y ve a `http://localhost:8000/index.html`.

**Una vez que el juego esté abierto a través de un servidor local (con `http://...`):**

* **Añade el parámetro `?preguntas=` a la URL en tu navegador.**
    * Copia la URL "Raw" de tu Gist (la que obtuviste en el paso 3 de "Cómo Personalizar").
    * Edita la URL en la barra de direcciones del navegador. Por ejemplo:

        ```
        [http://127.0.0.1:5500/index.html?preguntas=https://gist.githubusercontent.com/TU_USUARIO/TU_ID_DEL_GIST/raw/tu_archivo_de_preguntas.json](http://127.0.0.1:5500/index.html?preguntas=https://gist.githubusercontent.com/TU_USUARIO/TU_ID_DEL_GIST/raw/tu_archivo_de_preguntas.json)
        ```
    * Presiona Enter para recargar la página con las nuevas preguntas.

### 2. En GitHub Pages (para uso público y resolver CORS)

GitHub Pages es la forma ideal de desplegar tu juego para que sea accesible públicamente y para que la carga de preguntas desde Gists funcione sin problemas de CORS, ya que se servirá desde `https://` en lugar de `file://`.

**a. Configura GitHub Pages para tu repositorio:**

1.  **Asegúrate de que tus cambios estén subidos a tu repositorio de GitHub:**
    * Abre tu terminal en la carpeta raíz de tu proyecto.
    * Añade los archivos modificados a la zona de preparación: `git add .`
    * Confirma tus cambios: `git commit -m "feat: Implementa carga de preguntas desde URL externa y actualiza README"`
    * Sube tus cambios a tu repositorio remoto: `git push origin main` (o `master` si tu rama principal se llama así).

2.  **Activa GitHub Pages:**
    * Ve a tu repositorio en GitHub (el que está en tu cuenta, ej., `https://github.com/tu-usuario/magnitunid`).
    * Haz clic en la pestaña **"Settings"** (Configuración) en la parte superior.
    * En el menú lateral izquierdo, haz clic en **"Pages"**.
    * En la sección "Build and deployment" (Construcción y despliegue), bajo "Source" (Origen):
        * En el menú desplegable **"Branch" (Rama)**, selecciona la rama que contiene tu código (normalmente `main`).
        * En el menú desplegable **"folder" (carpeta)**, selecciona `/root` (ya que tu `index.html` está en la raíz de tu proyecto).
    * Haz clic en el botón **"Save"** (Guardar).

**b. Accede y Juega en GitHub Pages:**

1.  GitHub Pages tardará unos minutos en desplegar tu sitio. Una vez listo, verás un mensaje verde en la sección "Pages" indicando la URL de tu sitio. Será algo como:
    `https://tu-usuario.github.io/magnitunid/` (reemplaza `tu-usuario` y `magnitunid` con tus datos).

2.  Para jugar con tus preguntas personalizadas, simplemente **añade el parámetro `?preguntas=`** a esa URL, usando la URL "Raw" de tu Gist:

    ```
    [https://tu-usuario.github.io/magnitunid/index.html?preguntas=https://gist.githubusercontent.com/TU_USUARIO/TU_ID_DEL_GIST/raw/tu_archivo_de_preguntas.json](https://tu-usuario.github.io/magnitunid/index.html?preguntas=https://gist.githubusercontent.com/TU_USUARIO/TU_ID_DEL_GIST/raw/tu_archivo_de_preguntas.json)
    ```
    * ¡Comparte esta URL con quien quieras para que jueguen con tus preguntas personalizadas!

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes ideas para mejoras o nuevas características, no dudes en abrir un "issue" o enviar un "pull request".
