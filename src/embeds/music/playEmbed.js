import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export function getPlayButtonRow(embedUpdate = false) {
  const buttonRow = new ActionRowBuilder();

  buttonRow.addComponents(
    new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("Parar")
      .setStyle(ButtonStyle.Danger)
  );

  buttonRow.addComponents(
    new ButtonBuilder()
      .setCustomId("skip")
      .setLabel("Pular")
      .setStyle(ButtonStyle.Primary)
  );

  return !embedUpdate
    ? buttonRow
    : {
        components: [buttonRow],
      };
}

export function getPlayEmbed(channel, isPlaying, song, userNickname) {
  const buttonRow = getPlayButtonRow();

  const embed = {
    footer: {
      text: `Duração (duration): ${song.duration}\nCanal (channel): ${channel}.\nAdicionado por (added by): ${userNickname}.`,
      icon_url: "",
    },
    image: {
      url: song.thumbnail,
    },
    thumbnail: {
      url: "",
    },
    author: {
      name: "joaopedrolt",
      url: "https://github.com/joaopedrolt",
      icon_url: "",
    },
    fields: [],
    color: 16777215,
    type: "rich",
    description: `**[${song.title}](${song.url})** foi adicionado à lista de reprodução (has been added to the playlist).`,
    title: "Trembo Bot",
  };

  return !isPlaying
    ? {
        embeds: [embed],
        components: [buttonRow],
      }
    : {
        embeds: [embed],
      };
}

export function disabledPlayButtonRow() {
  const buttonRow = new ActionRowBuilder();

  buttonRow.addComponents(
    new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("Parar")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true)
  );

  buttonRow.addComponents(
    new ButtonBuilder()
      .setCustomId("skip")
      .setLabel("Pular")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true)
  );

  return {
    components: [buttonRow],
  };
}
