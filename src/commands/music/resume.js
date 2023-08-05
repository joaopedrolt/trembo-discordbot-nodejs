import GuildQueueController from "../../controllers/guildQueueController.js";
import { getPlayButtonRow } from "../../embeds/music/buttonRowEmbed.js";
import skipEmbed from "../../embeds/music/skipEmbed.js";
import checkMemberName from "../../utils/checkMemberName.js";

export default {
  name: "resume",
  description: "Resume a música atual (Resumes the current song)",

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

    if (queue.node.isPaused()) {
      queue.node.resume();

      const currentReply =
        queueController.queueReply[queueController.currentTrackIndex];

      currentReply.edit(getPlayButtonRow(true));

      return await interaction.reply("Resumido");
    } else {
      return await interaction.reply("Musica ja esta tocando");
    }
  },
};
