import GuildQueueController from "../../controllers/guildQueueController.js";
import { getPausedButtonRow } from "../../embeds/music/buttonRowEmbed.js";
import skipEmbed from "../../embeds/music/skipEmbed.js";
import checkMemberName from "../../utils/checkMemberName.js";

export default {
  name: "pause",
  description: "Pausa a música atual (Pauses the current song)",

  callback: async (client, interaction) => {
    const queue = client.player.nodes.get(interaction.guild);

    if (!queue) {
      await interaction.reply(
        "Não há músicas na fila! (there are no songs in the queue)."
      );
      return;
    }

    const queueController = GuildQueueController.getGuildQueueController(
      interaction.guildId
    ).queueController;

    if (queue.node.isPlaying()) {
      queue.node.pause();

      const currentReply =
        queueController.queueReply[queueController.currentTrackIndex];

      currentReply.edit(getPausedButtonRow());

      return await interaction.reply("Pausado");
    } else {
      return await interaction.reply("Bot ja pausado");
    }
  },
};
