import { Model } from '../model/Model';

export class StatusMetric {
  model: Model;
  hitCounts: number;

  constructor(model: Model) {
    this.model = model;
    this.hitCounts = 0;
  }

  increase(): void {
    this.hitCounts ++;
  }

  decrease(incrHitCountWhenMatched: boolean): void {
    if (this.hitCounts > 0 && incrHitCountWhenMatched) {
      this.hitCounts --;
    }
  }
}