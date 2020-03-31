export class LoggerFactory {
  private static LoggerClass = null;

  static getLogger(category: string, options?) {
    if (this.LoggerClass) {
      return new this.LoggerClass(category, options);
    } else {
      return console;
    }
  }

  static setLoggerClass(loggerClass) {
    this.LoggerClass = loggerClass;
  }
}