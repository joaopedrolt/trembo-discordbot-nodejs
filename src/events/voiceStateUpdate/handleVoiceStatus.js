export default ({ client, args }) => {
  if (args.id == client.application.id) {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear());

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const formattedDateTime = `${month}/${day}/${year} at ${hours}:${minutes}`;

    if (client.voice.adapters.size > 0) {
      console.log(
        `\nTrembo Bot started playing on server: "${args.guild.name}" - Id: ${args.guild.id}. On ${formattedDateTime}.`
      );
    } else {
      console.log(
        `\nTrembo Bot left voice channel on server: "${args.guild.name}" / Id: ${args.guild.id}. On ${formattedDateTime}.`
      );
    }
  }
};
