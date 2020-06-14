import { Registrant as Contract } from "../contracts/Registrant";
import { Command } from "../contracts/Command";

export class CommandRegistrant implements Contract {
  private commands: Map<string, Command> = new Map<string, Command>();

  setCommands(commands: Map<string, Command>) {
    this.commands = commands;
  }

  getCommandStorage() {
    return this.commands;
  }

  register(command: Command): boolean {
    this.commands.set(command.commandName(), command);
    return this.commands.has(command.commandName());
  }

  unregister(command: Command): boolean {
    this.commands.delete(command.commandName());
    return this.commands.has(command.commandName());
  }

  find(commandName: string): Command | boolean {
    if (this.commands.has(commandName)) {
      return this.commands.get(commandName) as Command;
    }
    return false;
  }
}
