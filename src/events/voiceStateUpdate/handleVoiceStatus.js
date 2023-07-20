export default ({ client, args }) => {
  if (client.voice.adapters.size > 0) {
    console.log(
      `\nTrembo Bot started playing on server: "${args.guild.name}" - Id: ${args.guild.id}.`
    );
  } else {
    console.log(
      `\nTrembo Bot left voice channel on server: "${args.guild.name}" / Id: ${args.guild.id}.`
    );
  }
};
