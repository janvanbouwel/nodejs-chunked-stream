import { Transform } from 'node:stream';
import { BODY_LENGTH_LENGTH } from './constants.js';

export function createDecodeStream(): Transform {
    let buffer = Buffer.alloc(0);
    let step = 0;

    let bodyLength = 0;

    return new Transform({
        transform(chunk, _, callback) {
            buffer = Buffer.concat([buffer, chunk]);
            let offset = 0;
            let cont = true;

            while (cont) {
                switch (step) {
                    case 0:
                        if (buffer.length >= BODY_LENGTH_LENGTH + offset) {
                            bodyLength = buffer.readUInt32BE(offset);
                            offset += BODY_LENGTH_LENGTH;
                            step = +1;
                        } else cont = false;
                        break;
                    case 1:
                        if (buffer.length >= bodyLength + offset) {
                            const body = buffer.subarray(offset, bodyLength + offset);

                            buffer = buffer.subarray(offset + bodyLength);
                            offset = 0;
                            bodyLength = 0;
                            step = 0;

                            this.push(body);

                        } else cont = false;
                        break;
                }
            }
            buffer = buffer.subarray(offset);

            callback();
        },
        readableObjectMode: true,
        writableObjectMode: false
    });
}
