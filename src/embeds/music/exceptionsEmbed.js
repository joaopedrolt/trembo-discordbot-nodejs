export function getQueueEmptyEmbed() {
  return {
    embeds: [
      {
        author: {
          name: "joaopedrolt",
          url: "https://github.com/joaopedrolt",
          icon_url: "",
        },
        color: 16777215,
        type: "rich",
        description: `A lista de reprodução chegou ao fim. Trembo bot saiu do canal de voz! (queue ended).`,
        title: "Trembo",
      },
    ],
  };
}

export function getCooldownEmbed() {
  return {
    embeds: [
      {
        author: {
          name: "joaopedrolt",
          url: "https://github.com/joaopedrolt",
          icon_url: "",
        },
        color: 16777215,
        type: "rich",
        description: `Aguarde alguns segundos antes de enviar um novo comando (cooldown time)!`,
        title: "Trembo",
      },
    ],
    ephemeral: true
  };
}
