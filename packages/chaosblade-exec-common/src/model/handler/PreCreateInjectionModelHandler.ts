import { Model } from '../Model';

export interface PreCreateInjectionModelHandler {
  preCreate(suid: string, model: Model);
}