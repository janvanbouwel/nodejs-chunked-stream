import { Transform } from "node:stream";
import { MAX_BODY_LENGTH, BODY_LENGTH_LENGTH } from "./constants.js";
import { isUint8Array } from "node:util/types";
export function createEncodeStream() {
  return new Transform({
    transform(chunk, _, callback) {
      if (!isUint8Array(chunk)) {
        callback(Error("Invalid chunk"));
        return;
      }
      if (chunk.length >= MAX_BODY_LENGTH) {
        callback(Error("payload too large"));
        return;
      }
      const bodyLength = Buffer.alloc(BODY_LENGTH_LENGTH);
      bodyLength.writeUInt32BE(chunk.length);
      this.push(bodyLength);
      this.push(chunk);
      callback();
    },
    readableObjectMode: false,
    writableObjectMode: true,
  });
}
