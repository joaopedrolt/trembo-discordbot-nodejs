export default (songTitle, userNickname) => {
  return {
    embeds: [
      {
        footer: {
          text: `Pulada por (skipped by): ${userNickname}.`,
          icon_url: "",
        },
        author: {
          name: "joaopedrolt",
          url: "https://github.com/joaopedrolt",
          icon_url: "",
        },
        color: 16777215,
        type: "rich",
        description: `A música **${songTitle}** foi pulada! (the song has been skipped).`,
        title: "Trembo",
      },
    ],
  };
};
