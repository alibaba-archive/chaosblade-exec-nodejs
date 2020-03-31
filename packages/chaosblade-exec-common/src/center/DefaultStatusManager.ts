import { StatusManager } from './StatusManager';
import { StatusMetric } from './StatusMetric';
import { RegisterResult } from './RegisterResult';
import { Model } from '../model/Model';
import { ModelUtil } from '../util/ModelUtil';

export class DefaultStatusManager implements StatusManager {

  private logger = console;

  private enhancers: Map<string, boolean> = new Map();

  private models: Map<string, Map<string, StatusMetric>> = new Map();

  private experiments: Map<string, string> = new Map();

  private modelIdentifierToUid: Map<string, string> = new Map();

  private closed: boolean;

  setLogger(logger: any): void {
    this.logger = logger;
  }

  registerEnhancer(enhancerName: string): void {
    if (this.closed) {
      return;
    }

    if (!this.enhancers.has(enhancerName)) {
      this.enhancers.set(enhancerName, true);
      this.logger.info(`register enhancer: ${enhancerName}`);
    }
  }

  registerExp(suid: string, model: Model): RegisterResult {
    const metricMap = this.getMetricMap(model.getTarget());
    const identifier = ModelUtil.getIdentifier(model);
    const metric = new StatusMetric(model);

    if (!metricMap.has(identifier)) {
      metricMap.set(identifier, metric);
    } else {
      this.logger.warn(`${model.toString()} exists`);
      return RegisterResult.fail(metric.getModel());
    }

    this.experiments.set(suid, identifier);
    this.modelIdentifierToUid.set(identifier, suid);
    return RegisterResult.success();
  }

  removeExp(suid: string): Model {
    const identifier = this.experiments.get(suid);

    if (!identifier) {
      return null;
    }

    this.experiments.delete(suid);
    this.modelIdentifierToUid.delete(identifier);
    const target = ModelUtil.getTarget(identifier);
    const metricMap = this.models.get(target);

    if (!metricMap || metricMap.size === 0) {
      return null;
    }

    const metric = metricMap.get(identifier);

    if (metric) {
      metricMap.delete(identifier);
      return metric.getModel();
    }

    return null;
  }

  listExps(): Map<string, StatusMetric[]> {
    const map: Map<string, StatusMetric[]> = new Map();

    this.models.forEach((metricMap, targetName) => {
      let statusMetrics = map.get(targetName);

      if (!statusMetrics) {
        statusMetrics = [];
        map.set(targetName, statusMetrics);
      }

      metricMap.forEach((statusMetric) => {
        statusMetrics.push(statusMetric);
      });
    });

    return map;
  }

  listUids(target: string, action: string): Set<string> {
    const uids = new Set<string>();

    const metricMap = this.models.get(target);
    if (!metricMap) {
      return uids;
    }

    const identifiers = new Set();
    metricMap.forEach((value, key) => {
      identifiers.add(key);
    });

    this.experiments.forEach((value, key) => {
      if (identifiers.has(value)) {
        uids.add(key);
      }
    });

    return uids;
  }

  getExpByTarget(targetName: string): StatusMetric[] {
    const metricMap = this.models.get(targetName);

    if (!metricMap) {
      return [];
    }

    const statusMetrics = [];

    metricMap.forEach((statusMetric) => {
      statusMetrics.push(statusMetric);
    });

    return statusMetrics;
  }

  private getMetricMap(targetName: string): Map<string, StatusMetric> {
    let metricMap = this.models.get(targetName);

    if (!metricMap) {
      metricMap = new Map();
      this.models.set(targetName, metricMap);
    }

    return metricMap;
  }

  expExists(targetName: string): boolean {
    return this.models.has(targetName);
  }

  actionExists(targetName: string, actionName: string): boolean {
    if (!actionName) {
      return false;
    }

    const statusMetrics = this.getExpByTarget(targetName);

    for (const statusMetric of statusMetrics) {
      if (actionName === statusMetric.getModel().getActionName()) {
        return true;
      }
    }

    return false;
  }

  getStatusMetricByUid(uid: string): StatusMetric {
    const identifier = this.experiments.get(uid);

    if (!identifier) {
      return null;
    }

    const target = ModelUtil.getTarget(identifier);
    const metricMap = this.models.get(target);

    if (!metricMap || metricMap.size === 0) {
      return null;
    }

    return metricMap.get(identifier);
  }

  getUidByModel(model: Model): string {
    const identifier = ModelUtil.getIdentifier(model);
    return this.modelIdentifierToUid.get(identifier);
  }

  getAllUids(): Set<string> {
    return new Set([ ...this.experiments.keys() ]);
  }

  isClosed(): boolean {
    return this.closed;
  }

  load(): void {
    this.closed = false;
  }

  unload(): void {
    this.closed = true;
    this.experiments.clear();
    this.models.clear();
    this.enhancers.clear();
    this.modelIdentifierToUid.clear();
  }

}