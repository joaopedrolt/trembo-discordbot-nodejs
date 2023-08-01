import { getPlayButtonRow } from "./buttonRowEmbed.js";

export function getPlaySongEmbed(channel, isPlaying, song, addedBy) {
  const buttonRow = getPlayButtonRow();

  const embed = {
    footer: {
      text: `Duração (duration): ${song.duration}\nCanal (channel): ${channel}.\nAdicionado por (added by): ${addedBy}.`,
      icon_url: "",
    },
    image: {
      url: song.thumbnail,
    },
    thumbnail: {
      url: "",
    },
    author: {
      name: "joaopedrolt",
      url: "https://github.com/joaopedrolt",
      icon_url: "",
    },
    fields: [],
    color: 16777215,
    type: "rich",
    description: `**[${song.title}](${song.url})** foi adicionado à lista de reprodução (has been added to the playlist).`,
    title: "Trembo Bot",
  };

  return !isPlaying
    ? {
        embeds: [embed],
        components: [buttonRow],
      }
    : {
        embeds: [embed],
      };
}

export function getPlayPlaylistEmbed(
  playlistTitle,
  playlistLength,
  playlistUrl,
  playlistAuthor,
  playlistCurrentPosition,
  addedBy,
  currentTrack
) {
  const buttonRow = getPlayButtonRow();

  const embed = {
    footer: {
      text: `Duração (duration): ${currentTrack.durationFormatted}\nProgresso (progress): música ${playlistCurrentPosition} de ${playlistLength}.\nAutor (author): ${playlistAuthor}.\nAdicionado por (added by): ${addedBy}.`,
      icon_url: "",
    },
    image: {
      url: currentTrack.thumbnail.url,
    },
    thumbnail: {
      url: "",
    },
    author: {
      name: "joaopedrolt",
      url: "https://github.com/joaopedrolt",
      icon_url: "",
    },
    fields: [],
    color: 16777215,
    type: "rich",
    description: `Atualmente tocando **${currentTrack.title}** da playlist "**[${playlistTitle}](${playlistUrl})**".`,
    title: "Trembo Bot",
  };

  return {
    embeds: [embed],
    components: [buttonRow],
  };
}

export function getPlaylistAddedEmbed(playlist, addedBy) {
  const embed = {
    footer: {
      text: `Tamanho (lenght): ${playlist.tracks.length} músicas.\nAutor (author): ${playlist.author.name}.\nAdicionado por (added by): ${addedBy}.`,
      icon_url: "",
    },
    image: {
      url: playlist.thumbnail,
    },
    thumbnail: {
      url: "",
    },
    author: {
      name: "joaopedrolt",
      url: "https://github.com/joaopedrolt",
      icon_url: "",
    },
    fields: [],
    color: 16777215,
    type: "rich",
    description: `A playlist "**[${playlist.title}](${playlist.url})**" foi adicionada à lista de reprodução (playlist has been added).`,
    title: "Trembo Bot",
  };

  return {
    embeds: [embed],
  };
}
