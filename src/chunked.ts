import { Duplex } from "node:stream";
import { createEncodeStream } from "./encode.js";
import { createDecodeStream } from "./decode.js";

/**
 * Wraps the provided duplex with an encode- and decode stream (see `createEncodeStream()` and `createDecodeStream()`).
 *
 * ```typescript
// original duplex stream, for example a TCP connection
const duplex = new PassThrough()

// wrap duplex
const chunked = createChunkedStream(duplex);

// handle messages, object mode
chunked.on("data", (data) => {
  console.log(data)
});

// write data as either a Buffer or an array of Buffers.
duplex.write(Buffer.from("abc"));
duplex.write([Buffer.from("abc"), Buffer.from("def")])

```
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
