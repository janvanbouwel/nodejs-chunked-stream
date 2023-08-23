import { Transform } from "node:stream";
import { MAX_BODY_LENGTH, BODY_LENGTH_LENGTH } from "./constants.js";
import { isUint8Array } from "node:util/types";

export class Encoder extends Transform {}

/**
 * Creates an object mode Transform stream that encodes written buffers into a binary stream.
 *
 * Data may be provided as a Buffer or a list of Buffers.
 *
 * ```typescript
 *   const encode = createEncodeStream();
 *
 *   encode.write(Buffer.from("abc"));
 *   encode.write([Buffer.from("abc"), Buffer.from("def")]);
 * ```
 *
 * @returns chunk encoding transform stream
 */
export function createEncodeStream(): Encoder {
  return new Encoder({
    transform(chunks, _, callback) {
      if (!Array.isArray(chunks)) chunks = [chunks];

      let bodyLength = 0;
      for (const chunk of chunks) {
        if (!isUint8Array(chunk)) {
          callback(new Error("Invalid payload"));
          return;
        }
        bodyLength += chunk.length;
      }

      if (bodyLength >= MAX_BODY_LENGTH) {
        callback(Error("payload too large"));
        return;
      }

      const lengthBuffer = Buffer.alloc(BODY_LENGTH_LENGTH);
      lengthBuffer.writeUInt32BE(bodyLength);

      this.push(lengthBuffer);
      for (const chunk of chunks) this.push(chunk);

      callback();
    },
    readableObjectMode: false,
    writableObjectMode: true,
  });
}
