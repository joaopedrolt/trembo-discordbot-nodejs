export default () => {
  return {
    embeds: [
      {
        author: {
          name: `joaopedrolt`,
          url: "https://github.com/joaopedrolt",
          icon_url: "",
        },
        color: 16777215,
        type: "rich",
        description: `:syringe: **Trembo bot** suporta links, pesquisas e playlists do Youtube\n(supports youtube links, queries and playlists).`,
        title: "Trembo",
        fields: [
          {
            name: "Comandos",
            value: `\n:loud_sound: **/play url** - Cole o link.\n**:loud_sound: /play search** - Pesquise a música.\n:loud_sound: **/play playlist** - Cole o link de uma playlist.\n:pause_button: **/pause** - Pausar.\n:play_pause: **/resume** - Resumir.\n:track_next: **/skip** - Pular.\n:x: **/stop** - Parar.`,
          },
        ],
      },
    ],
    ephemeral: true,
  };
};
