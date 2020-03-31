import { Model } from '../Model';

export interface PreDestroyInjectionModelHandler {
  preDestroy(suid: string, model: Model);
}