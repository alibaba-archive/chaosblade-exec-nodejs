import { EnhancerModel } from '../../aop/EnhancerModel';

export interface ActionExecutor {

  run(enhancerModel: EnhancerModel): void;
}