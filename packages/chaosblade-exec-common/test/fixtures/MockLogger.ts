export class MockLogger {
  private topic: string;

  constructor(topic: string) {
    this.topic = topic;
  }

  info(msg) {
    console.log(`[${this.topic}] ${msg}`);
  }
}