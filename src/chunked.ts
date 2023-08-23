import { Duplex } from "node:stream";
import { createEncodeStream } from "./encode.js";
import { createDecodeStream } from "./decode.js";

/**
 * Wraps the provided duplex with an encode- and decodestream (see `createEncodeStream()` and `createDecodeStream()`).
 *
 *
 * @param duplex
 * @returns
 */
export function createChunkedStream(duplex: Duplex): Duplex {
  const encode = createEncodeStream();
  encode.pipe(duplex);
  encode.on("error", (err) => duplex.destroy(err));
  const decode = createDecodeStream();
  duplex.pipe(decode);
  duplex.on("error", (err) => decode.destroy(err));

  const chunked = Duplex.from({ writable: encode, readable: decode });
  chunked.allowHalfOpen = true;
  return chunked;
}
