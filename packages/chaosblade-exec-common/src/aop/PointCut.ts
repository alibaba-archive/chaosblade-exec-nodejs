export interface PointCut<T> {
  moduleName: string;
  version: string;
  target: T;
  method: string;
}