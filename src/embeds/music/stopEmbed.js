export function stopButtonClickEmbed(userNickname) {
  return {
    embeds: [
      {
        footer: {
          text: `Parado por (stopped by): ${userNickname}.`,
          icon_url: "",
        },
        author: {
          name: "joaopedrolt",
          url: "https://github.com/joaopedrolt",
          icon_url: "",
        },
        color: 16777215,
        type: "rich",
        description: "Trembo bot parou a reprodução e saiu do canal de voz! (stopped music playback and left the voice channel).",
        title: "Trembo Bot",
      },
    ],
  };
}
