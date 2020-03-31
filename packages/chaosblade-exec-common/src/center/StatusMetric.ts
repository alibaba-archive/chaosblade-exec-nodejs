import { Model } from '../model/Model';

export class StatusMetric {
  private model: Model;
  private hitCounts: number;

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

  getCount(): number {
    return this.hitCounts;
  }

  getModel(): Model {
    return this.model;
  }
}