// customClient.ts

import { Client, Collection } from 'discord.js';

interface CustomClient extends Client {
  menus?: Collection<any, any>;
  commands?: Collection<any, any>;
  events?: Collection<any, any>;
}

export default CustomClient;
