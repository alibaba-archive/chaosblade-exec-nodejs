import { ModelSpecManager } from './ModelSpecManager';
import { LoggerFactory } from '../util/LoggerFactory';
import { ModelSpec } from '../model/ModelSpec';

export class DefaultModelSpecManager implements ModelSpecManager {
  private logger = LoggerFactory.getLogger('DefaultModelSpecManager');
  private modelSpecs: Map<string, ModelSpec> = new Map();

  getModelSpec(target: string): ModelSpec {
    return this.modelSpecs.get(target);
  }

  registerModelSpec(modelSpec: ModelSpec): void {
    const target = modelSpec.getTarget();

    if (this.modelSpecs.has(target)) {
      this.logger.warn(`${target} target model has been defined`);
      return;
    }

    this.modelSpecs.set(target, modelSpec);
  }

  load(): void {}

  unload(): void {
    this.modelSpecs.clear();
  }

}