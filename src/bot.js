import { REST } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import { YoutubeiExtractor } from "discord-player-youtubei"
import { Player } from "discord-player";

import eventHandler from "./handlers/eventHandler.js";
import config from "./config.js";

const token = config.token;
const rest = new REST({ version: "10" }).setToken(token);
const client = new Client({
  intents: [GatewayIntentBits.Guilds | GatewayIntentBits.GuildVoiceStates],
});

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

//client.player.extractors.loadDefault();
client.player.extractors.register(YoutubeiExtractor, {
  cookies: "./cookies.txt",
});

// client.player = new Player();
// client.player.extractors.register(YoutubeiExtractor, {});

eventHandler(client, rest);

client.login(token);