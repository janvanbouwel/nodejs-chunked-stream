import {
  createEncodeStream,
  createChunkedStream,
  createDecodeStream,
} from "./index.js";

import assert from "assert";
import { isUint8Array } from "util/types";

import { PassThrough } from "stream";

function testBuffer() {
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

function testDuplex() {
  const duplex = createChunkedStream(new PassThrough());

  const amount = 7;

  let i = 0;
  duplex.on("data", (data) => {
    assert(isUint8Array(data));
    assert(data.toString() === `${i}`, "Invalid message content.");
    i++;
  });

  duplex.on("close", () => {
    assert(i === amount, `Expected ${amount} messages but ${i} arrived.`);
  });

  for (let j = 0; j < amount; j++) {
    duplex.write(Buffer.from(`${j}`));
  }

  duplex.end();
}

function testArray() {
  const encode = createEncodeStream();
  const decode = createDecodeStream();

  const amount = 7;

  let i = 0;
  decode.on("data", (data) => {
    assert(isUint8Array(data));
    assert(data.toString() === `${i}${i}`, "Invalid message content.");
    i++;
  });

  decode.on("close", () => {
    assert(i === amount, `Expected ${amount} messages but ${i} arrived.`);
  });

  for (let j = 0; j < amount; j++) {
    encode.write([Buffer.from(`${j}`), Buffer.from(`${j}`)]);
  }

  encode.end();
  encode.pipe(decode);
}

testBuffer();
testDuplex();
testArray();
