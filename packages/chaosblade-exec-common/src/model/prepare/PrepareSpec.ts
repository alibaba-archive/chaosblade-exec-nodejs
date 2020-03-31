import { FlagSpec } from '../FlagSpec';

export interface PrepareSpec {
  /**
   * The prepare type, for example, jvm
   */
  getType(): string;

  /**
   * Get the prepare flags
   */
  getFlags(): FlagSpec[];

  /**
   * If necessary or not
   */
  required(): boolean;
}
