import { IPCHub } from './IPCHub';

export interface ServiceOptions {
  host: string;
  port: number;
  prefix?: string;
  ipc?: boolean;
  IPCHubKlass?: new() => IPCHub;
}