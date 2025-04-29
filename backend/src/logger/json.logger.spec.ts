import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  describe('formatMessage', () => {
    it('should format message to JSON with level and message', () => {
      const formatted = logger.formatMessage('info', 'test message');
      const parsed = JSON.parse(formatted);

      expect(parsed).toHaveProperty('level', 'info');
      expect(parsed).toHaveProperty('message', 'test message');
    });

    it('should include optionalParams in the formatted message', () => {
      const formatted = logger.formatMessage('info', 'test message', {
        userId: 1,
      });
      const parsed = JSON.parse(formatted);

      expect(parsed).toHaveProperty('optionalParams');
      expect(parsed.optionalParams).toContainEqual({ userId: 1 });
    });
  });

  describe('log methods', () => {
    it('log method should call console.log with properly formatted message', () => {
      logger.log('test log');
      expect(consoleLogSpy).toHaveBeenCalled();

      const call = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(call);

      expect(parsed).toHaveProperty('level', 'log');
      expect(parsed).toHaveProperty('message', 'test log');
    });

    it('error method should call console.error with properly formatted message', () => {
      logger.error('test error');
      expect(consoleErrorSpy).toHaveBeenCalled();

      const call = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(call);

      expect(parsed).toHaveProperty('level', 'error');
      expect(parsed).toHaveProperty('message', 'test error');
    });

    it('warn method should call console.warn with properly formatted message', () => {
      logger.warn('test warning');
      expect(consoleWarnSpy).toHaveBeenCalled();

      const call = consoleWarnSpy.mock.calls[0][0];
      const parsed = JSON.parse(call);

      expect(parsed).toHaveProperty('level', 'warn');
      expect(parsed).toHaveProperty('message', 'test warning');
    });

    it('debug method should call console.debug with properly formatted message', () => {
      logger.debug('test debug');
      expect(consoleDebugSpy).toHaveBeenCalled();

      const call = consoleDebugSpy.mock.calls[0][0];
      const parsed = JSON.parse(call);

      expect(parsed).toHaveProperty('level', 'debug');
      expect(parsed).toHaveProperty('message', 'test debug');
    });

    it('verbose method should call console.log with properly formatted message', () => {
      logger.verbose('test verbose');
      expect(consoleLogSpy).toHaveBeenCalled();

      const call = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(call);

      expect(parsed).toHaveProperty('level', 'verbose');
      expect(parsed).toHaveProperty('message', 'test verbose');
    });
  });
});
