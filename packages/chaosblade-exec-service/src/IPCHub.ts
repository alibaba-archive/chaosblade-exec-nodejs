/**
 * IPC Hub wrapper, should export like this.
 */
export class IPCHub {
  /**
   * start IPC Hub, include server and client
   */
  async start(): Promise<void> {}
  /**
   * stop IPC Hub, include server and client
   */
  async stop(): Promise<void> {}
  /**
   * publish data to client
   */
  async publish(topic: string, data): Promise<void> {}
  /**
   * subscribe data from server
   */
  async subscribe(topic: string, handler: DataHandler): Promise<void> {}
}

export interface ChaosbladeExperiment {
  suid: string;
  target: string;
  action: string;
}
export type DataHandler = (data) => {};