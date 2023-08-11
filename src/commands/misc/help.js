import helpEmbed from "../../embeds/misc/helpEmbed.js";

export default {
  name: "trembohelp",
  description: "trembohelp!",

  callback: async (client, interaction) => {
    return await interaction.reply(helpEmbed());
  },
};
