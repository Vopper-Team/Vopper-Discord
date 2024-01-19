/**
 * Load event handlers and attach them to the Discord.js client.
 * @param {Client} client - The Discord.js client instance.
 */
async function loadEvents(client) {
  // Import necessary modules
  const AsciiTable = require("ascii-table");
  const fs = require("node:fs");

  // Create an ASCII table to display the loaded events
  const table = new AsciiTable().setHeading("Events", "Status");

  // Clear existing event handlers from the client
  await client.events.clear();

  // Read event folders from the ./events directory
  const folders = fs.readdirSync("./events");

  // Iterate through event folders
  for (const folder of folders) {
    // Read event files from each folder
    const files = fs
      .readdirSync(`./events/${folder}`)
      .filter((file) => file.endsWith(".js"));

    // Iterate through event files
    for (const file of files) {
      // Load the event module
      const event = require(`../events/${folder}/${file}`);

      // Create an event handler function
      const eventHandler = (...args) => event.execute(...args, client);

      // Attach the event handler to the appropriate event
      if (event.rest) {
        if (event.once) client.rest.once(event.name, eventHandler);
        else client.rest.on(event.name, eventHandler);
      } else if (event.once) {
        client.once(event.name, eventHandler);
      } else {
        client.on(event.name, eventHandler);
      }

      // Add the event to the ASCII table
      table.addRow(file, "Loaded");
      continue;
    }
  }

  // Log the loaded events using the ASCII table
  return console.log(table.toString(), "\nLoaded Events");
}

module.exports = { loadEvents };
