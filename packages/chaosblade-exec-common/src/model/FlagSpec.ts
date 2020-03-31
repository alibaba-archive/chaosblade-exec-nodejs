export interface FlagSpec {
  getName(): string;
  getDesc(): string;
  noArgs(): boolean;
  required(): boolean;
}