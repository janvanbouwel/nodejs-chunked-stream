import { createEncodeStream } from "./encode.js";
import { createDecodeStream } from "./decode.js";
import assert from "assert";
import { isUint8Array } from "util/types";
function test() {
  const encode = createEncodeStream();
  const decode = createDecodeStream();
  const amount = 7;
  let i = 0;
  decode.on("data", (data) => {
    assert(isUint8Array(data));
    assert(data.toString() === `${i}`, "Invalid message content.");
    i++;
  });
  decode.on("close", () => {
    assert(i === amount, `Expected ${amount} messages but ${i} arrived.`);
  });
  for (let j = 0; j < amount; j++) {
    encode.write(Buffer.from(`${j}`));
  }
  encode.end();
  encode.pipe(decode);
}
test();
