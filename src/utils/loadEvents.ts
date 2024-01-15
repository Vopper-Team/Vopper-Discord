import customClient from "../interfaces/CustomClient";
import path from 'path';
import fs from 'fs/promises';  // Utilizamos fs.promises en lugar de fs para aprovechar las funciones asíncronas

export async function loadEvents(client: customClient) {
  const AsciiTable = require('ascii-table');
  const table = new AsciiTable().setHeading('Events', 'Status');
  await client.events?.clear();

  // Utilizamos path.join para construir rutas de manera segura y consistente
  const eventsDir = path.join(__dirname, '../events');

  try {
    const folders = await fs.readdir(eventsDir);

    for (const folder of folders) {
      const folderPath = path.join(eventsDir, folder);
      const files = await fs.readdir(folderPath);

      for (const file of files) {
        const eventPath = path.join(folderPath, file);
        const event = require(eventPath);

        if (event.rest) {
          if (event.once) client.rest.once(event.name, (...args: any[]) => event.execute(...args, client));
          else client.rest.on(event.name, (...args: any[]) => event.execute(...args, client));
        } else if (event.once) {
          client.once(event.name, (...args: any[]) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args: any[]) => event.execute(...args, client));
        }

        table.addRow(file, 'Loaded');
        continue;
      }
    }

    console.log(table.toString(), '\nLoaded Events');
  } catch (error) {
    console.error('Error reading events:', error);
  }
}

module.exports = { loadEvents };
