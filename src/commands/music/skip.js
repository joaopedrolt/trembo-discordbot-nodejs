import skipEmbed from "../../embeds/music/skipEmbed.js";
import checkMemberName from "../../utils/checkMemberName.js";

export default {
  name: "skip",
  description: "Pula a música atual (skips the current song)",

  callback: async (client, interaction) => {
    const queue = client.player.nodes.get(interaction.guild);

    if (!queue) {
      await interaction.reply(
        "Não há músicas na fila! (there are no songs in the queue)."
      );
      return;
    }

    queue.node.skip();

    await interaction.reply(
      skipEmbed(
        queue.currentTrack.raw.title,
        checkMemberName(
          interaction.member.nickname,
          interaction.member.user.username
        )
      )
    );
  },
};
