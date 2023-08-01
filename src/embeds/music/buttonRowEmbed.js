import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

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