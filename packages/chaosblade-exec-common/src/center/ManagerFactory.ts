import { StatusManager } from './StatusManager';
import { ModelSpecManager } from './ModelSpecManager';
import { DefaultStatusManager } from './DefaultStatusManager';
import { DefaultModelSpecManager } from './DefaultModelSpecManager';

export class ManagerFactory {
  /**
   * Experiment status manager
   */
  private static statusManager: StatusManager = new DefaultStatusManager();
  /**
   * Experiment model manager
   */
  private static modelSpecManager: ModelSpecManager = new DefaultModelSpecManager();


  static getStatusManager(): StatusManager {
    return this.statusManager;
  }

  static getModelSpecManager(): ModelSpecManager {
    return this.modelSpecManager;
  }

  static load(): void {
    this.modelSpecManager.load();
    this.statusManager.load();
  }

  /**
   * Close manager service
   */
  static unload(): void {
    this.modelSpecManager.unload();
    this.statusManager.unload();
  }
}