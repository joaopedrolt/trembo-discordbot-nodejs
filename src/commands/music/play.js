import { QueryType, useMainPlayer } from "discord-player";
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
import tryExtractStandaloneVideo from "../../utils/urlTools/tryExtractStandaloneVideo.js";

import GuildQueueController from "../../controllers/guildQueueController.js";
import checkMemberName from "../../utils/checkMemberName.js";
import {
  getPausedButtonRow,
  getPlayButtonRow,
} from "../../embeds/music/buttonRowEmbed.js";
import pauseEmbed from "../../embeds/music/pauseEmbed.js";
import resumeEmbed from "../../embeds/music/resumeEmbed.js";
import isUserConnectedToBotChannel from "../../utils/isUserConnectedToBotChannel.js";
import CooldownController from "../../controllers/cooldownController.js";
import { getCooldownEmbed } from "../../embeds/music/exceptionsEmbed.js";

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

    if (!channel)
      return interaction.reply({
        content:
          "Você precisa estar em um canal de voz para reproduzir uma música (you need to be in a voice channel to play a song).",
        ephemeral: true,
      });

    if (!channel.permissionsFor(client.user).has("ViewChannel")) {
      return await interaction.reply({
        content:
          "O Bot não tem permissão para tocar nesse canal (Bot is not allowed to play on this channel)!",
        ephemeral: true,
      });
    }

    let queue;

    if (!client.player.nodes.has(interaction.guild)) {
      queue = client.player.nodes.create(interaction.guild);
    } else {
      queue = client.player.nodes.get(interaction.guild);

      if (!isUserConnectedToBotChannel(client.user.id, channel)) {
        return await interaction.reply({
          content:
            "Você precisa estar no mesmo canal do bot (You must be on the same channel as the bot)!",
          ephemeral: true,
        });
      }
    }

    const queueController = GuildQueueController.getGuildQueueController(
      interaction.guildId
    ).queueController;

    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed;
    let playlist;

    const searchParameters = interaction.options.getSubcommand();
    let userSongInput;

    if (searchParameters == "url") {
      userSongInput = interaction.options.getString("songurl");

      if (!isValidUrl(userSongInput)) {
        return interaction.reply({
          content:
            "O parametro fornecido não é uma url (the provided parameter is not a url).",
          ephemeral: true,
        });
      }

      if (isYoutubePlaylist(userSongInput)) {
        userSongInput = tryExtractStandaloneVideo(userSongInput);

        if (!userSongInput)
          return interaction.reply({
            content: `Essa opção não suporta link de playlist, utilize "/play playlist" (this option does not support playlist links, use /play playlist instead).`,
            ephemeral: true,
          });
      }

      const result = await client.player.search(userSongInput, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      console.log(result)

      if (!result._data.tracks || result._data.tracks.length === 0) {
        return interaction.reply({
          content:
            "Nenhum resultado encontrado nesse link! (no results found on this link!).",
          ephemeral: true,
        });
      }

      const song = result._data.tracks[0];
      userSongInput = song.url; // Url mais correta

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
      userSongInput = interaction.options.getString("songname");

      const result = await client.player.search(userSongInput, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (!result._data.tracks || result._data.tracks.length === 0) {
        return interaction.reply({
          content: "Nenhum resultado encontrado! (no results found).",
          ephemeral: true,
        });
      }

      const song = result._data.tracks[0];
      userSongInput = song.url; // Url mais correta
      //queue.addTrack(song);

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

    if (searchParameters == "playlist") { // Arrumar o Playlist
      userSongInput = interaction.options.getString("playlisturl");

      if (!isValidUrl(userSongInput)) {
        return interaction.reply({
          content:
            "O parametro fornecido não é uma url (the provided parameter is not a url).",
          ephemeral: true,
        });
      }

      if (!isYoutubePlaylist(userSongInput)) {
        return interaction.reply({
          content:
            "Essa opção apenas suporta links de playlist do youtube. (this option only supports youtube playlist links).",
          ephemeral: true,
        });
      } else if (tryExtractStandaloneVideo(userSongInput)) {
        return interaction.reply({
          content:
            "Essa opção apenas suporta links de playlist do youtube. (this option only supports youtube playlist links. Standalone).",
          ephemeral: true,
        });
      }

      const result = await client.player.search(userSongInput, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (!result._data.tracks || result._data.tracks.length === 0) {
        return interaction.reply({
          content:
            "Nenhum resultado encontrado nesse link! (no results found on this link!).",
          ephemeral: true,
        });
      }

      playlist = result._data.playlist;
      // await queue.addTrack(playlist);

      if (!queue.isPlaying()) {
        queueController.anyPlaylistOngoing = true;
        queueController.playlistTrackCounter = 1;

        embed = getPlayPlaylistEmbed(
          playlist.title,
          playlist.tracks.length,
          playlist.url,
          playlist.author.name,
          queueController.playlistTrackCounter,
          checkMemberName(
            interaction.member.nickname,
            interaction.member.user.username
          ),
          playlist.tracks[0]
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
      const { track } = await client.player.play(channel, userSongInput, {
        nodeOptions: {
          metadata: {
            channel: interaction.channel
          },
          volume: 100,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 60000,
          leaveOnEnd: true,
          leaveOnEndCooldown: 60000,
        },
      })

      queueController.setTrackMoveEventListener(queue, client);

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
        if (CooldownController.isOnCooldown(interaction.guildId)) {
          return interaction.reply(getCooldownEmbed());
        }

        if (!queue) {
          return await interaction.reply({
            content:
              "Não há músicas na fila! (there are no songs in the queue).",
            ephemeral: true,
          });
        }

        if (interaction.member.voice.channel) {
          if (
            !isUserConnectedToBotChannel(
              client.user.id,
              interaction.member.voice.channel
            )
          ) {
            return await interaction.reply({
              content:
                "Você precisa estar no mesmo canal do bot (You must be on the same channel as the bot)!",
              ephemeral: true,
            });
          }
        } else {
          return await interaction.reply({
            content:
              "Você precisa estar no servidor para interagir com o bot (You need to be on the server to interact with the bot)!",
            ephemeral: true,
          });
        }

        CooldownController.applyCooldown(interaction.guildId);

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
              `\nError while stop button was pressed on the server: ${interaction.guild.name} / Id: ${interaction.guild.id}. Error: ${error}`
            );
            return;
          }
        }

        if (interaction.customId == "skip") {
          try {
            queue.node.skip();

            return interaction.reply(
              skipEmbed(
                queue.currentTrack.title,
                checkMemberName(
                  interaction.member.nickname,
                  interaction.member.user.username
                )
              )
            );
          } catch (error) {
            console.log(
              `\nError while skip button was pressed on the server: ${interaction.guild.name} / Id: ${interaction.guild.id}. Error: ${error}`
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

              return await interaction.reply(
                pauseEmbed(
                  queue.currentTrack.title,
                  checkMemberName(
                    interaction.member.nickname,
                    interaction.member.user.username
                  )
                )
              );
            } else {
              return await interaction.reply({
                content: "Bot já pausado (Bot is already paused)!",
                ephemeral: true,
              });
            }
          } catch (error) {
            console.log(
              `\nError while pause button was pressed on the server: ${interaction.guild.name} / Id: ${interaction.guild.id}. Error: ${error}`
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

              return await interaction.reply(
                resumeEmbed(
                  queue.currentTrack.title,
                  checkMemberName(
                    interaction.member.nickname,
                    interaction.member.user.username
                  )
                )
              );
            } else {
              return await interaction.reply({
                content: "Bot já está tocando (Bot is already playing)!",
                ephemeral: true,
              });
            }
          } catch (error) {
            console.log(
              `\nError while resume button was pressed on the server: ${interaction.guild.name} / Id: ${interaction.guild.id}. Error: ${error}`
            );
            return;
          }
        }
      });

      return;
    } catch (error) {
      console.log(error);

      return interaction.reply({
        content: `Ocorreu um erro, tente novamente. Se persistir, reporte ao desenvolvedor! (There was an error, please try again. If it persists, report to the developer!).`,
        ephemeral: true,
      });
    }
  },
};
