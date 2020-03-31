import { ManagerService } from './ManagerService';
import { Model } from '../model/Model';
import { StatusMetric } from '../center/StatusMetric';
import { RegisterResult } from './RegisterResult';

export interface StatusManager extends ManagerService {

  /**
   * Register method enhancer name
   *
   * @param enhancerName
   */
  registerEnhancer(enhancerName: string): void;

  /**
   * Register the experiment rule
   *
   * @param model
   * @return
   */
  registerExp(uid: string, model: Model): RegisterResult;

  /**
   * Remove the experiment by exp uid
   *
   * @param uid
   * @return
   */
  removeExp(uid: string): Model;

  /**
   * List all experiments
   *
   * @return
   */
  listExps(): Map<string, StatusMetric[]>;

  /**
   * List experiments by the exp target
   *
   * @param targetName
   * @return
   */
  getExpByTarget(targetName: string): StatusMetric[];

  /**
   * Assert the target experiment exist or not
   *
   * @param targetName
   * @return
   */
  expExists(targetName: string): boolean;

  actionExists(targetName: string, actionName: string): boolean;

  getStatusMetricByUid(uid: string): StatusMetric;

  getUidByModel(model: Model): string;

  getAllUids(): Set<string>;

  listUids(target: string, action: string): Set<string>;

}