Vopper-Bot
==========

Bienvenido a **Vopper-Bot**, un bot programado en _Node.js_ y _JavaScript_ para mejorar la experiencia en tu servidor de Discord.

Requisitos
----------

Asegúrate de tener la versión adecuada de _Node.js_ antes de instalar las dependencias.

### Versión recomendada de Node.js: v19.9.0

    node -v
    

### Versión recomendada de npm: 9.6.3

    npm -v
    

Configuración
-------------

Antes de iniciar el bot, es importante revisar y configurar correctamente las variables de entorno y los archivos de configuración.

*   **Variables de Entorno:** Asegúrate de configurar las variables de entorno necesarias en un archivo `.env` en la raíz del proyecto. Incluye al menos la variable `TOKEN_BOT` con el token de tu bot Discord.
*   **Roles y Canales:** Los roles y canales utilizados por el bot se configuran en el archivo `config.json`. Asegúrate de revisar y ajustar la configuración según tus necesidades.

**Nota:** No olvides quitar el sufijo "-examples" de los nombres de los archivos de configuración para que funcionen correctamente.

Instalación
-----------

Para instalar todas las dependencias de forma correcta, ejecuta el siguiente comando:

    npm install
    

Iniciar el Proyecto
-------------------

Una vez que todas las dependencias estén instaladas, puedes iniciar el proyecto con el siguiente comando:

    npm run start
    

Este comando iniciará el bot y estará listo para responder en tu servidor de Discord.

Tecnologías Utilizadas
----------------------

El proyecto está programado en Node.js y utiliza JavaScript. Además, hace uso de Discord.js en su versión 14 para interactuar con la API de Discord y proporcionar funcionalidades en tu servidor.

¡Disfruta de Vopper-Bot en tu servidor de Discord!