import stopEmbed from "../../embeds/music/stopEmbed.js";
import QueueController from "../../controllers/queueController.js";

export default {
  name: "stop",
  description: "Encerra a fila de reprodução (stops current queue)",

  callback: async (client, interaction) => {
    const queue = client.player.nodes.get(interaction.guild);

    if (!queue) {
      await interaction.reply(
        "Não há músicas na fila! (there are no songs in the queue)."
      );
      return;
    }

    QueueController.stopCommandIssued = true;

    try {
      queue.delete();

      return interaction.reply(stopEmbed(interaction.member.nickname));
    } catch (error) {
      console.log(
        `\nError when the /stop command was issued on the server: ${interaction.guild.name} / Id: ${interaction.guild.id}. Error: ${error}`
      );
      return;
    }
  },
};
