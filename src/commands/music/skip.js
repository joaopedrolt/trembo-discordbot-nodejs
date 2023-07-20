export default {
  name: "skip",
  description: "Pula a música atual (skips the current song)",

  callback: async (client, interaction) => {
    const queue = client.player.nodes.get(interaction.guild);

    if (!queue) {
      await interaction.reply("Não há músicas na fila! (there are no songs in the queue).");
      return;
    }

    queue.node.skip();
  },
};
