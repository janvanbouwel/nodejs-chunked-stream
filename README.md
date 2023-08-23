# Chunked Stream

Transforms a binary stream into an Object mode stream.

## Usage

```typescript
// original duplex stream, for example a TCP connection
const duplex = new PassThrough();

// wrap duplex
const chunked = createChunkedStream(duplex);

// handle messages, object mode
chunked.on("data", (data) => {
  console.log(data);
});

// write data as either a Buffer or an array of Buffers.
duplex.write(Buffer.from("abc"));
duplex.write([Buffer.from("abc"), Buffer.from("def")]);
```
