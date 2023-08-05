import { QueryType } from "discord-player";
import { ComponentType } from "discord.js";
import {
  getPlayPlaylistEmbed,
  getPlaySongEmbed,
  getPlaylistAddedEmbed,
} from "../../embeds/music/playEmbed.js";
import skipEmbed from "../../embeds/music/skipEmbed.js";
import stopEmbed from "../../embeds/music/stopEmbed.js";
import isYoutubePlaylist from "../../utils/urlTools/isYoutubePlaylist.js";
import isValidUrl from "../../utils/urlTools/isValidUrl.js";
import GuildQueueController from "../../controllers/guildQueueController.js";
import checkMemberName from "../../utils/checkMemberName.js";
import { getPausedButtonRow, getPlayButtonRow } from "../../embeds/music/buttonRowEmbed.js";

export default {
  name: "play",
  description: "Toca uma música do YouTube (plays a song from YouTube)",
  options: [
    {
      type: 1,
      name: "search",
      description:
        "Busca uma música e a toca (searches for a song and plays it)",
      options: [
        {
          type: 3,
          name: "songname",
          description: "search keywords",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "playlist",
      description:
        "Toca uma playlist do YouTube (plays a playlist from YouTube)",
      options: [
        {
          type: 3,
          name: "playlisturl",
          description: "the playlist's url",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "url",
      description:
        "Toca uma música de um Url do YouTube (plays a song from a YouTube Url)",
      options: [
        {
          type: 3,
          name: "songurl",
          description: "the song's url",
          required: true,
        },
      ],
    },
  ],

  callback: async (client, interaction) => {
    const channel = interaction.member.voice.channel;

    const queueController = GuildQueueController.getGuildQueueController(
      interaction.guildId
    ).queueController;

    if (!channel)
      return interaction.reply(
        "Você precisa estar em um canal de voz para reproduzir uma música (you need to be in a voice channel to play a song)."
      );

    let queue;

    if (!client.player.nodes.has(interaction.guild)) {
      queue = client.player.nodes.create(interaction.guild);
    } else {
      queue = client.player.nodes.get(interaction.guild);
    }

    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed;
    let playlist;

    const searchParameters = interaction.options.getSubcommand();

    if (searchParameters == "url") {
      const songUrl = interaction.options.getString("songurl");

      if (!isValidUrl(songUrl)) {
        return interaction.reply(
          "O parametro fornecido não é uma url (the provided parameter is not a url)."
        );
      }

      if (isYoutubePlaylist(songUrl)) {
        return interaction.reply(
          `Essa opção não suporta link de playlist, utilize "/play playlist" (this option does not support playlist links, use /play playlist instead).`
        );
      }

      const result = await client.player.search(songUrl, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      if (result.tracks.length === 0) {
        return interaction.reply(
          "Nenhum resultado encontrado nesse link! (no results found on this link!)."
        );
      }

      const song = result.tracks[0];
      queue.addTrack(song);

      embed = getPlaySongEmbed(
        interaction.member.voice.channel.name,
        queue.isPlaying(),
        song,
        checkMemberName(
          interaction.member.nickname,
          interaction.member.user.username
        )
      );
    }

    if (searchParameters == "search") {
      const songName = interaction.options.getString("songname");

      const result = await client.player.search(songName, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0) {
        return interaction.reply(
          "Nenhum resultado encontrado! (no results found)."
        );
      }

      const song = result.tracks[0];
      queue.addTrack(song);

      embed = getPlaySongEmbed(
        interaction.member.voice.channel.name,
        queue.isPlaying(),
        song,
        checkMemberName(
          interaction.member.nickname,
          interaction.member.user.username
        )
      );
    }

    if (searchParameters == "playlist") {
      const playlistUrl = interaction.options.getString("playlisturl");

      if (!isValidUrl(playlistUrl)) {
        return interaction.reply(
          "O parametro fornecido não é uma url (the provided parameter is not a url)."
        );
      }

      if (!isYoutubePlaylist(playlistUrl)) {
        return interaction.reply(
          "Essa opção apenas suporta links de playlist do youtube. (this option only supports youtube playlist links)."
        );
      }

      const result = await client.player.search(playlistUrl, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0) {
        return interaction.reply(
          "Nenhum resultado encontrado nesse link! (no results found on this link!)."
        );
      }

      playlist = result._data.playlist;

      await queue.addTrack(playlist);

      if (!queue.isPlaying()) {
        queueController.anyPlaylistOngoing = true;

        embed = getPlayPlaylistEmbed(
          playlist.title,
          playlist.tracks.length,
          playlist.url,
          playlist.author.name,
          1,
          checkMemberName(
            interaction.member.nickname,
            interaction.member.user.username
          ),
          playlist.tracks[0].raw
        );
      } else {
        embed = getPlaylistAddedEmbed(
          playlist,
          checkMemberName(
            interaction.member.nickname,
            interaction.member.user.username
          )
        );
      }
    }

    await interaction.deferReply();

    try {
      if (!queue.isPlaying()) {
        await queue.node.play();

        queueController.setTrackMoveEventListener(queue, client);
      }

      const reply = await interaction.followUp(embed);

      queueController.queueReply.push(reply);

      if (playlist) {
        queueController.playlists.push({
          id: queueController.playlists.length + 1,
          startIndex: queueController.queueReply.length - 1,
          length: playlist.tracks.length,
          author: playlist.author.name,
          title: playlist.title,
          url: playlist.url,
          reply,
          addedBy: checkMemberName(
            interaction.member.nickname,
            interaction.member.user.username
          ),
        });
      }

      const collector = await reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
      });

      collector.on("collect", async (interaction) => {
        if (!queue) {
          await interaction.reply(
            "Não há músicas na fila! (there are no songs in the queue)."
          );
          return;
        }

        if (interaction.customId == "stop") {
          try {
            queueController.stopCommandIssued = true;

            queue.delete();

            return interaction.reply(
              stopEmbed(
                checkMemberName(
                  interaction.member.nickname,
                  interaction.member.user.username
                )
              )
            );
          } catch (error) {
            console.log(
              `\nStop button was pressed while there was no queue available on the server: ${interaction.guild.name} / Id: ${interaction.guild.id}.`
            );
            return;
          }
        }

        if (interaction.customId == "skip") {
          try {
            queue.node.skip();

            return interaction.reply(
              skipEmbed(
                queue.currentTrack.raw.title,
                checkMemberName(
                  interaction.member.nickname,
                  interaction.member.user.username
                )
              )
            );
          } catch (error) {
            console.log(
              `\nSkip button was pressed while there was no queue available on the server: ${interaction.guild.name} / Id: ${interaction.guild.id}.`
            );
            return;
          }
        }

        if (interaction.customId == "pause") {
          try {
            if (queue.node.isPlaying()) {
              queue.node.pause();

              const currentReply =
                queueController.queueReply[queueController.currentTrackIndex];

              currentReply.edit(getPausedButtonRow());

              return await interaction.reply("Pausado");
            } else {
              return await interaction.reply("Bot ja pausado");
            }
          } catch (error) {
            console.log(
              `\nPause button was pressed while there was no queue available on the server: ${interaction.guild.name} / Id: ${interaction.guild.id}. error: ${error}`
            );
            return;
          }
        }

        if (interaction.customId == "resume") {
          try {
            if (queue.node.isPaused()) {
              queue.node.resume();

              const currentReply =
                queueController.queueReply[queueController.currentTrackIndex];

              currentReply.edit(getPlayButtonRow(true));

              return await interaction.reply("Resumido");
            } else {
              return await interaction.reply("Musica ja esta tocando");
            }
          } catch (error) {
            console.log(
              `\nResume button was pressed while there was no queue available on the server: ${interaction.guild.name} / Id: ${interaction.guild.id}.`
            );
            return;
          }
        }
      });

      return;
    } catch (error) {
      console.log(error);

      return interaction.followUp(
        `Ocorreu um erro, tente novamente. Se persistir, reporte ao desenvolvedor! (There was an error, please try again. If it persists, report to the developer!).`
      );
    }
  },
};
