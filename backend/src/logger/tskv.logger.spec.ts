import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
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
    it('should format message to TSKV format with level and message', () => {
      const formatted = logger.formatMessage('info', 'test message');

      expect(formatted).toContain('level=info');
      expect(formatted).toContain('message=test message');
      expect(formatted).toContain('\t'); // Should contain tab separators
    });

    it('should include timestamp in the formatted message', () => {
      const formatted = logger.formatMessage('info', 'test message');

      expect(formatted).toMatch(/time=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should handle error objects correctly', () => {
      const error = new Error('Test error');
      const formatted = logger.formatMessage('error', 'Error occurred', error);

      expect(formatted).toContain('level=error');
      expect(formatted).toContain('message=Error occurred');
      expect(formatted).toContain('error=Test error');
      expect(formatted).toMatch(/stack=/);
    });

    it('should handle object parameters correctly', () => {
      const params = { userId: 123, action: 'login' };
      const formatted = logger.formatMessage('info', 'User action', params);

      expect(formatted).toContain('level=info');
      expect(formatted).toContain('message=User action');
      expect(formatted).toContain('userId=123');
      expect(formatted).toContain('action=login');
    });

    it('should escape tab characters in values', () => {
      const formatted = logger.formatMessage('info', 'tab\tcharacter');

      expect(formatted).toContain('message=tab\\tcharacter');
      expect(formatted.match(/\t/g)?.length).toBeGreaterThanOrEqual(1);
    });

    it('should escape newline characters in values', () => {
      const formatted = logger.formatMessage('info', 'newline\ncharacter');

      expect(formatted).toContain('message=newline\\ncharacter');
    });
  });

  describe('log methods', () => {
    it('log method should call console.log with properly formatted message', () => {
      logger.log('test log');
      expect(consoleLogSpy).toHaveBeenCalled();

      const call = consoleLogSpy.mock.calls[0][0];
      expect(call).toContain('level=log');
      expect(call).toContain('message=test log');
    });

    it('error method should call console.error with properly formatted message', () => {
      logger.error('test error');
      expect(consoleErrorSpy).toHaveBeenCalled();

      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('level=error');
      expect(call).toContain('message=test error');
    });

    it('warn method should call console.warn with properly formatted message', () => {
      logger.warn('test warning');
      expect(consoleWarnSpy).toHaveBeenCalled();

      const call = consoleWarnSpy.mock.calls[0][0];
      expect(call).toContain('level=warn');
      expect(call).toContain('message=test warning');
    });

    it('debug method should call console.debug with properly formatted message', () => {
      logger.debug('test debug');
      expect(consoleDebugSpy).toHaveBeenCalled();

      const call = consoleDebugSpy.mock.calls[0][0];
      expect(call).toContain('level=debug');
      expect(call).toContain('message=test debug');
    });

    it('verbose method should call console.log with properly formatted message', () => {
      logger.verbose('test verbose');
      expect(consoleLogSpy).toHaveBeenCalled();

      const call = consoleLogSpy.mock.calls[0][0];
      expect(call).toContain('level=verbose');
      expect(call).toContain('message=test verbose');
    });
  });
});
