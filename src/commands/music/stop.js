import stopEmbed from "../../embeds/music/stopEmbed.js";
import GuildQueueController from "../../controllers/guildQueueController.js";
import checkMemberName from "../../utils/checkMemberName.js";

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

    const queueController = GuildQueueController.getGuildQueueController(
      interaction.guildId
    ).queueController;

    queueController.stopCommandIssued = true;

    try {
      queue.delete();

      return interaction.reply(
        stopEmbed(
          checkMemberName(
            interaction.member.nickname,
            interaction.member.user.username
          )
        )
      );
    } catch (error) {
      console.log(
        `\nError when the /stop command was issued on the server: ${interaction.guild.name} / Id: ${interaction.guild.id}. Error: ${error}`
      );
      return;
    }
  },
};
