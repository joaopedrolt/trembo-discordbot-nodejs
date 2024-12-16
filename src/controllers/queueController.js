import {
  getDisabledPlayButtonRow,
  getPlayButtonRow,
} from "../embeds/music/buttonRowEmbed.js";
import { getQueueEmptyEmbed } from "../embeds/music/exceptionsEmbed.js";
import { getPlayPlaylistEmbed } from "../embeds/music/playEmbed.js";

export default class QueueController {
  constructor() { }

  guildId = "";

  queueReply = [];
  currentTrackIndex = 0;
  nextTrackIndex = this.currentTrackIndex + 1;

  currentTrack = {};

  anyPlaylistOngoing = false;
  playlists = [];
  movingIntoPlaylist = false;
  playlistTrackCounter = 0;

  stopCommandIssued = false;

  moveActiveRow(lastTrack = false) {
    const currentReply = this.queueReply[this.currentTrackIndex];

    currentReply.edit(getDisabledPlayButtonRow());

    if (lastTrack) return;

    const nextTrackReply = this.queueReply[this.nextTrackIndex];

    const embedUpdate = getPlayButtonRow(true);

    nextTrackReply.edit(embedUpdate);

    if (this.movingIntoPlaylist && this.anyPlaylistOngoing) {
      this.movingIntoPlaylist = false;
    }

    this.currentTrackIndex++;
    this.nextTrackIndex = this.currentTrackIndex + 1;
  }

  setTrackMoveEventListener(queue) {
    const finishListenersCount = queue.dispatcher.listenerCount("finish");

    if (finishListenersCount < 2) {
      queue.dispatcher.on("finish", () => {

        if (this.stopCommandIssued) {
          this.moveActiveRow(true);

          this.clear();
          return;
        }

        if (this.playlists.length != 0) {
          if (this.anyPlaylistOngoing) {
            if (this.playlists[0].length == this.playlistTrackCounter) {
              this.anyPlaylistOngoing = false;
              this.playlists.shift();
              this.playlistTrackCounter = 0;

              if (this.playlists.length != 0) {
                if (this.queueReply[this.nextTrackIndex]) {
                  if (this.nextTrackIndex == this.playlists[0].startIndex) {
                    this.movingIntoPlaylist = true;
                    this.anyPlaylistOngoing = true;
                  }
                }
              }
            }

            this.playlistTrackCounter++;
          } else {
            if (this.queueReply[this.nextTrackIndex]) {
              if (this.nextTrackIndex == this.playlists[0].startIndex) {
                this.movingIntoPlaylist = true;
                this.anyPlaylistOngoing = true;
              }
            }
          }
        }

        if (
          (this.queueReply[this.nextTrackIndex])
        ) {
          this.currentTrack = queue.currentTrack;
        }

        if (this.anyPlaylistOngoing) {
          this.currentTrack = queue.__current;

          this.playlists[0].reply.edit(
            getPlayPlaylistEmbed(
              this.playlists[0].title,
              this.playlists[0].length,
              this.playlists[0].url,
              this.playlists[0].author,
              this.playlistTrackCounter,
              this.playlists[0].addedBy,
              this.currentTrack
            )
          );

          if (!(!this.movingIntoPlaylist && this.anyPlaylistOngoing)) {
            this.moveActiveRow();
          }
        }

        if (!this.anyPlaylistOngoing) {
          if (this.queueReply[this.nextTrackIndex]) {
            this.moveActiveRow();
          } else {
            this.moveActiveRow(true);

            this.queueReply[this.currentTrackIndex].reply(getQueueEmptyEmbed());
            this.clear();
          }
        }
      });
    }
  }

  clear() {
    this.queueReply = [];
    this.currentTrackIndex = 0;
    this.nextTrackIndex = this.currentTrackIndex + 1;
    this.stopCommandIssued = false;
    this.anyPlaylistOngoing = false;
    this.playlists = [];
    this.movingIntoPlaylist = false;
    this.playlistTrackCountethis;
    this.currentTrack = {};
  }
}
