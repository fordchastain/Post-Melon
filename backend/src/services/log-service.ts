import * as fs from 'fs';
import * as path from 'path';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  logDirectory?: string;
  logLevel?: LogLevel;
}

class LogService {
  private logDirectory: string;
  private logLevel: LogLevel;
  
  private readonly levels: Record<LogLevel, number> = {
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
  }

  constructor(options?: LogOptions) {
    this.logDirectory = options?.logDirectory || path.join(__dirname, '../../', 'logs');
    this.logLevel = options?.logLevel || 'info';

    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  public info(message: string, context?: object) {
    this.log(message, 'info', context);
  }

  public debug(message: string, context?: object) {
    this.log(message, 'debug', context);
  }

  public warn(message: string, context?: object) {
    this.log(message, 'warn', context);
  }

  public error(message: string, context?: object) {
    this.log(message, 'error', context);
  }

  private log(message: string, level: LogLevel, context?: object) {
    if (this.levels[level] < this.levels[this.logLevel]) {
      return;
    }

    const timestamp = new Date();

    const logEntry = {
      timestamp: timestamp.toISOString(),
      level,
      message,
      ...(context && { context }),
    };

    const formattedMessage = JSON.stringify(logEntry);

    this.writeToFile(formattedMessage, timestamp);
    console.log(formattedMessage);
  }

  private writeToFile(message: string, timestamp: Date) {
    const dateStr = timestamp.toISOString().split('T')[0];
    const filePath = path.join(this.logDirectory, `${dateStr}.log`);

    fs.appendFile(filePath, message + '\n', (err) => {
      if (err) {
        logger.error('LogService failed to write log:', err);
      }
    });
  }
}

const logger = new LogService({
  logDirectory: './logs',
  logLevel: 'info',
});

export default logger;
