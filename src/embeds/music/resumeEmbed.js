export default (songTitle, userNickname) => {
  return {
    embeds: [
      {
        footer: {
          text: `Resumido por (resumed by): ${userNickname}.`,
          icon_url: "",
        },
        author: {
          name: "joaopedrolt",
          url: "https://github.com/joaopedrolt",
          icon_url: "",
        },
        color: 16777215,
        type: "rich",
        description: `A música **${songTitle}** foi resumida! (the song has been resumed).`,
        title: "Trembo",
      },
    ],
  };
};
