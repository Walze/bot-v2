import Command from './Command'
import Action from './Action'
import CommandRequest from './Request'

/**
 * Handles all bot's commands
 *
 * @export
 * @class Commands
 */
export default class Commands {

  public static declarations: Command[] = []

  public static prefix = 's-'
  public static separator = '='

  public static exec(req: CommandRequest) {
    return this.declarations
      .find(cmd => cmd.name === req.command)!
      .run(req)
  }

  /**
   * Checks if text contains any commands
   *
   * @static
   * @param {string} text
   * @returns
   * @memberof Commands
   */
  public static includesCommand(text: string) {
    return this.declarations.find((cmd) => text.includes(cmd.name))
  }

  /**
   * Adds command to bot
   *
   * @static
   * @param {string} name
   * @param {Action} action
   * @memberof Commands
   */
  public static add(name: string, action: Action) {
    this.declarations.push(new Command(name, action))
  }

  /**
   * Throws if not found
   *
   * @static
   * @param {string} name
   * @returns
   * @memberof Commands
   */
  public static find(name: string) {
    const found = this.declarations.find(cmd => cmd.name === name)

    if (!found) throw new Error(`Command "${name}" not found`)

    return found
  }

  /**
   * Logs all commands
   *
   * @static
   * @param {number} [everyX=3] Breaks line after logging X commands
   * @returns
   * @memberof Commands
   */
  public static log(everyX: number = 3) {
    console.log(`\nLoaded ${this.declarations.length} Commands`)

    let string = ''

    this.declarations.map((cmd, i) => {
      if (i % everyX === 0 && i !== 0)
        string += `| ${cmd.name} |\n`
      else
        string += `| ${cmd.name} | `
    })

    console.log(string)

    return string
  }
}
