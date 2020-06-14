import { Command } from "./Command";

export interface Registrant {
  register(command: Command): boolean;
  unregister(command: Command): boolean;
}
