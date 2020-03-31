import { ManagerService } from './ManagerService';
import { ModelSpec } from '../model/ModelSpec';

export interface ModelSpecManager extends ManagerService {

  /**
   * Get experiment model specification
   *
   * @param target
   * @return
   */
  getModelSpec(target: string): ModelSpec;

  /**
   * Register experiment model
   *
   * @param modelSpec
   */
  registerModelSpec(modelSpec: ModelSpec): void;

}