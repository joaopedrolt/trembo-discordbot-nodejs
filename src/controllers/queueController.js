import { queueEmptyEmbed } from "../embeds/music/exceptionsEmbed.js";
import {
  disabledPlayButtonRow,
  getPlayButtonRow,
} from "../embeds/music/playEmbed.js";


export default class QueueController {
  static queueReply = [];
  static nextTrackIndex = 0;

  static moveActiveRow(lastTrack = false) {
    const oldReply =
      QueueController.queueReply[QueueController.nextTrackIndex - 1];

    oldReply.edit(disabledPlayButtonRow());

    if (lastTrack) return;

    const nextTrackReply =
      QueueController.queueReply[QueueController.nextTrackIndex];

    const embedUpdate = getPlayButtonRow(true);

    nextTrackReply.edit(embedUpdate);

    QueueController.nextTrackIndex++;
  }

  static setTrackMoveEventListener(queue) {
    queue.dispatcher.on("finish", () => {
      if (QueueController.queueReply[QueueController.nextTrackIndex]) {
        QueueController.moveActiveRow();
      } else {
        QueueController.moveActiveRow(true);
        QueueController.queueReply[QueueController.nextTrackIndex - 1].reply(
          queueEmptyEmbed()
        );
      }
    });
  }
}
