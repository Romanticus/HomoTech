import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  /**
   * Format message to TSKV (Tab-Separated Key-Value) format
   * Example: level=log\tmessage=Hello World
   */
  formatMessage(level: string, message: any, ...optionalParams: any[]): string {
    // Start with level
    let formattedMessage = `level=${level}`;

    // Add message
    formattedMessage += `\tmessage=${this.escapeValue(message)}`;

    // Add timestamp
    formattedMessage += `\ttime=${new Date().toISOString()}`;

    // Process optional parameters
    if (optionalParams && optionalParams.length > 0) {
      // Flatten the array if needed
      const params = optionalParams.flat();

      // Check if the first param is an error object
      if (params[0] instanceof Error) {
        const error = params[0];
        formattedMessage += `\terror=${this.escapeValue(error.message)}`;
        if (error.stack) {
          formattedMessage += `\tstack=${this.escapeValue(error.stack)}`;
        }
      } else if (typeof params[0] === 'object' && params[0] !== null) {
        // Handle object parameters
        const obj = params[0];
        Object.keys(obj).forEach((key) => {
          formattedMessage += `\t${key}=${this.escapeValue(obj[key])}`;
        });
      } else {
        // Add remaining params as numbered context
        params.forEach((param, index) => {
          formattedMessage += `\tparam${index}=${this.escapeValue(param)}`;
        });
      }
    }

    return formattedMessage;
  }

  /**
   * Escape special characters in values for TSKV format
   */
  private escapeValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue =
      typeof value === 'object' ? JSON.stringify(value) : String(value);

    // Escape tabs and newlines as they are special in TSKV
    return stringValue
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, optionalParams));
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, optionalParams));
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('debug', message, optionalParams));
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, optionalParams));
  }
}
