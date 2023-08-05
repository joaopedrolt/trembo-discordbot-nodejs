import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

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

  buttonRow.addComponents(
    new ButtonBuilder()
      .setCustomId("pause")
      .setLabel("Pausar")
      .setStyle(ButtonStyle.Secondary)
  );

  buttonRow.addComponents(
    new ButtonBuilder()
      .setCustomId("resume")
      .setLabel("Resumir")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true)
  );

  return !embedUpdate
    ? buttonRow
    : {
        components: [buttonRow],
      };
}

export function getDisabledPlayButtonRow() {
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

  buttonRow.addComponents(
    new ButtonBuilder()
      .setCustomId("pause")
      .setLabel("Pausar")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );

  buttonRow.addComponents(
    new ButtonBuilder()
      .setCustomId("resume")
      .setLabel("Resumir")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true)
  );

  return {
    components: [buttonRow],
  };
}

export function getPausedButtonRow() {
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

  buttonRow.addComponents(
    new ButtonBuilder()
      .setCustomId("pause")
      .setLabel("Pausar")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );

  buttonRow.addComponents(
    new ButtonBuilder()
      .setCustomId("resume")
      .setLabel("Resumir")
      .setStyle(ButtonStyle.Success)
  );

  return {
    components: [buttonRow],
  };
}