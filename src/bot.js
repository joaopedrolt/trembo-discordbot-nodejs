import { REST } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import { Player } from "discord-player";

import eventHandler from "./handlers/eventHandler.js"; //temp
import config from "./config.js";

const token = config.token;
const rest = new REST({ version: "10" }).setToken(token);
const client = new Client({
  intents: [GatewayIntentBits.Guilds | GatewayIntentBits.GuildVoiceStates],
});

/* const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("play a song from YouTube.")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("search")
      .setDescription("Searches for a song and plays it")
      .addStringOption((option) =>
        option
          .setName("searchterms")
          .setDescription("search keywords")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("playlist")
      .setDescription("Plays a playlist from YT")
      .addStringOption((option) =>
        option
          .setName("url")
          .setDescription("the playlist's url")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("song")
      .setDescription("Plays a single song from YT")
      .addStringOption((option) =>
        option.setName("url").setDescription("the song's url").setRequired(true)
      )
  );

console.log(data); */

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

await client.player.extractors.loadDefault();

eventHandler(client, rest);

client.login(token);