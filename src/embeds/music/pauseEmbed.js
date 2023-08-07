export default (songTitle, userNickname) => {
  return {
    embeds: [
      {
        footer: {
          text: `Pausada por (paused by): ${userNickname}.`,
          icon_url: "",
        },
        author: {
          name: "joaopedrolt",
          url: "https://github.com/joaopedrolt",
          icon_url: "",
        },
        color: 16777215,
        type: "rich",
        description: `A música **${songTitle}** foi pausada! (the song has been paused).`,
        title: "Trembo Bot",
      },
    ],
  };
};
