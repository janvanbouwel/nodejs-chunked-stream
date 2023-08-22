/// <reference types="node" resolution-mode="require"/>
import { Duplex } from "node:stream";
export declare function createChunkedStream(duplex: Duplex): Duplex;
