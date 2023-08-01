import {
  disabledPlayButtonRow,
  getPlayButtonRow,
} from "../embeds/music/buttonRowEmbed.js";
import { queueEmptyEmbed } from "../embeds/music/exceptionsEmbed.js";
import { getPlayPlaylistEmbed } from "../embeds/music/playEmbed.js";

export default class QueueController {
  static queueReply = [];
  static currentTrackIndex = 0;
  static nextTrackIndex = QueueController.currentTrackIndex + 1;
  static stopButtonPressed = false;

  static currentTrack = {};

  static anyPlaylistOngoing = false;
  static playlists = [];
  static movingIntoPlaylist = false;
  static playlistTrackCounter = 0;

  static moveActiveRow(lastTrack = false) {
    const currentReply =
      QueueController.queueReply[QueueController.currentTrackIndex];

    currentReply.edit(disabledPlayButtonRow());

    if (lastTrack) return;

    const nextTrackReply =
      QueueController.queueReply[QueueController.nextTrackIndex];

    const embedUpdate = getPlayButtonRow(true);

    nextTrackReply.edit(embedUpdate);

    if (
      QueueController.movingIntoPlaylist &&
      QueueController.anyPlaylistOngoing
    ) {
      QueueController.movingIntoPlaylist = false;
    }

    QueueController.currentTrackIndex++;
    QueueController.nextTrackIndex = QueueController.currentTrackIndex + 1;
  }

  static setTrackMoveEventListener(queue) {
    queue.dispatcher.on("finish", () => {
      if (QueueController.playlists.length != 0) {
        if (QueueController.anyPlaylistOngoing) {
          QueueController.playlistTrackCounter++;

          if (
            QueueController.playlists[0].length ==
            QueueController.playlistTrackCounter
          ) {
            QueueController.anyPlaylistOngoing = false;
            QueueController.playlists.shift();
            QueueController.playlistTrackCounter = 0;

            if (QueueController.playlists.length != 0) {
              if (QueueController.queueReply[QueueController.nextTrackIndex]) {
                if (
                  QueueController.nextTrackIndex ==
                  QueueController.playlists[0].startIndex
                ) {
                  QueueController.movingIntoPlaylist = true;
                  QueueController.anyPlaylistOngoing = true;
                }
              }
            }
          }
        } else {
          if (QueueController.queueReply[QueueController.nextTrackIndex]) {
            if (
              QueueController.nextTrackIndex ==
              QueueController.playlists[0].startIndex
            ) {
              QueueController.movingIntoPlaylist = true;
              QueueController.anyPlaylistOngoing = true;
            }
          }
        }
      }

      if (
        !(
          !QueueController.queueReply[QueueController.nextTrackIndex] &&
          !QueueController.anyPlaylistOngoing
        )
      ) {
        QueueController.currentTrack = queue.history.queue.__current.raw;
      }

      if (QueueController.anyPlaylistOngoing) {
        QueueController.playlists[0].reply.edit(
          getPlayPlaylistEmbed(
            QueueController.playlists[0].title,
            QueueController.playlists[0].length,
            QueueController.playlists[0].url,
            QueueController.playlists[0].author,
            QueueController.playlistTrackCounter + 1,
            QueueController.playlists[0].addedBy,
            QueueController.currentTrack
          )
        );
      }

      if (QueueController.anyPlaylistOngoing) {
        if (
          !(
            !QueueController.movingIntoPlaylist &&
            QueueController.anyPlaylistOngoing
          )
        ) {
          QueueController.moveActiveRow();
        }
      } else {
        if (QueueController.queueReply[QueueController.nextTrackIndex]) {
          QueueController.moveActiveRow();
        } else {
          if (!QueueController.stopButtonPressed) {
            QueueController.moveActiveRow(true);

            QueueController.queueReply[QueueController.currentTrackIndex].reply(
              queueEmptyEmbed()
            );
          } else {
            QueueController.stopButtonPressed = false;
          }

          QueueController.queueReply = [];
          QueueController.currentTrackIndex = 0;
          QueueController.nextTrackIndex =
            QueueController.currentTrackIndex + 1;
          QueueController.stopButtonPressed = false;
          QueueController.anyPlaylistOngoing = false;
          QueueController.playlists = [];
          QueueController.movingIntoPlaylist = false;
          QueueController.playlistTrackCounteQueueController;
          QueueController.currentTrack = {};
        }
      }
    });
  }
}
