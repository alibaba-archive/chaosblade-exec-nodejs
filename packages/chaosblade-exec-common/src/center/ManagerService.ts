export interface ManagerService {

  /**
   * Load service
   */
  load(): void;

  /**
   * Close service, release resource
   */
  unload(): void;
}
