/* eslint-disable @typescript-eslint/no-require-imports */
describe('gotenberg module loading', () => {
    const originalConsoleError = console.error;

    afterEach(() => {
        console.error = originalConsoleError;
        jest.resetModules();
    });

    it('should silently swallow WARNING errors thrown by config module', () => {
        jest.isolateModules(() => {
            jest.doMock('dotenv', () => ({
                config: jest
                    .fn()
                    .mockReturnValue({ error: new Error('file not found') })
            }));
            jest.doMock('config', () => {
                throw new Error('WARNING: No config file found');
            });

            expect(() => require('./gotenberg')).not.toThrow();
        });
    });

    it('should pass non-WARNING console.error messages through during module load', () => {
        const mockConsoleError = jest.fn();
        console.error = mockConsoleError;

        jest.isolateModules(() => {
            jest.doMock('dotenv', () => ({
                config: jest
                    .fn()
                    .mockReturnValue({ error: new Error('file not found') })
            }));
            jest.doMock('config', () => {
                console.error('Non-warning error occurred during config load');
                return {
                    has: jest.fn().mockReturnValue(false),
                    get: jest.fn()
                };
            });

            require('./gotenberg');
        });

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Non-warning error occurred during config load'
        );
    });

    it('should handle dotenv not being available', () => {
        jest.isolateModules(() => {
            jest.doMock('dotenv', () => {
                throw new Error('Cannot find module dotenv');
            });
            jest.doMock('config', () => ({
                has: jest.fn().mockReturnValue(false),
                get: jest.fn()
            }));

            expect(() => require('./gotenberg')).not.toThrow();
        });
    });

    it('should skip fallback env file when primary dotenv config succeeds', () => {
        jest.isolateModules(() => {
            const mockDotenvConfig = jest.fn().mockReturnValue({});
            jest.doMock('dotenv', () => ({ config: mockDotenvConfig }));
            jest.doMock('config', () => ({
                has: jest.fn().mockReturnValue(false),
                get: jest.fn()
            }));

            require('./gotenberg');

            expect(mockDotenvConfig).toHaveBeenCalledTimes(1);
        });
    });

    it('should read values from config module when config.has returns true', () => {
        let Gotenberg: typeof import('./gotenberg').Gotenberg;

        jest.isolateModules(() => {
            jest.doMock('dotenv', () => ({
                config: jest
                    .fn()
                    .mockReturnValue({ error: new Error('file not found') })
            }));
            jest.doMock('config', () => ({
                has: jest.fn().mockReturnValue(true),
                get: jest.fn().mockImplementation((path: string) => {
                    const values: Record<string, string> = {
                        'gotenberg.endpoint': 'http://config-host:3000',
                        'gotenberg.api.basicAuth.username': 'config-user',
                        'gotenberg.api.basicAuth.password': 'config-pass',
                        'gotenberg.api.apiKey': 'config-api-key'
                    };
                    return values[path];
                })
            }));

            ({ Gotenberg } = require('./gotenberg'));
        });

        expect(Gotenberg!.endpoint).toBe('http://config-host:3000');
        expect(Gotenberg!.username).toBe('config-user');
        expect(Gotenberg!.password).toBe('config-pass');
        expect(Gotenberg!.apiKey).toBe('config-api-key');
    });
});
