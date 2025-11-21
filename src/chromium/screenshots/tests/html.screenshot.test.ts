// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from 'fs';

import { HtmlScreenshot } from '../html.screenshot';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file content'])),
    createReadStream: jest.fn()
}));

const mockResponse = () => new Response('content');

const getResponseBuffer = async () => {
    const responseBuffer = await mockResponse().arrayBuffer();
    return Buffer.from(responseBuffer);
};

const mockFetch = jest
    .spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve(mockResponse()));

describe('HtmlScreenshot', () => {
    const screenshot = new HtmlScreenshot();

    describe('endpoint', () => {
        it('should route to Chromium HTML route', () => {
            expect(screenshot.endpoint).toEqual(
                'http://localhost:3000/forms/chromium/screenshot/html'
            );
        });
    });

    describe('capture', () => {
        const mockPromisesAccess = jest.spyOn(promises, 'access');
        const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');

        beforeEach(() => {
            (createReadStream as jest.Mock) = jest
                .fn()
                .mockImplementation(() => ({
                    pipe: jest.fn(),
                    on: jest.fn(),
                    async *[Symbol.asyncIterator]() {
                        yield Buffer.from('file content');
                    }
                }));
            jest.clearAllMocks();
            mockFetch.mockImplementation(() => Promise.resolve(mockResponse()));
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        describe('when html parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await screenshot.capture({
                    html: Buffer.from('data')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when image properties parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    properties: { format: 'jpeg', quality: 50 }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when emulatedMediaType parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    emulatedMediaType: 'screen'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when failOnHttpStatusCodes parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    failOnHttpStatusCodes: [499, 599]
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when skipNetworkIdleEvent parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    skipNetworkIdleEvent: false
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when optimizeForSpeed parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    optimizeForSpeed: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when userPassword parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    userPassword: 'my_user_password'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'userPassword',
                    'my_user_password'
                );
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when ownerPassword parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    ownerPassword: 'my_owner_password'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'ownerPassword',
                    'my_owner_password'
                );
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when both userPassword and ownerPassword are passed', () => {
            it('should return a buffer', async () => {
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    userPassword: 'my_user_password',
                    ownerPassword: 'my_owner_password'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'userPassword',
                    'my_user_password'
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'ownerPassword',
                    'my_owner_password'
                );
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when embeds parameter is passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    embeds: ['path/to/embed.xml', 'path/to/embed.png']
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when all parameters are passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();

                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    emulatedMediaType: 'screen',
                    failOnHttpStatusCodes: [499, 599],
                    skipNetworkIdleEvent: false,
                    failOnConsoleExceptions: true,
                    properties: { format: 'jpeg', quality: 50 },
                    optimizeForSpeed: true,
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(9);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when file does not exist', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    "ENOENT: no such file or directory, access 'path/to/index.html'";
                mockPromisesAccess.mockRejectedValue(new Error(errorMessage));
                await expect(() =>
                    screenshot.capture({ html: 'path/to/index.html' })
                ).rejects.toThrow(errorMessage);
            });
        });

        describe('when fetch request fails', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    'FetchError: request to http://localhost:3000/forms/chromium/screenshot/html failed';
                mockPromisesAccess.mockResolvedValue();
                mockFetch.mockRejectedValue(new Error(errorMessage));
                await expect(() =>
                    screenshot.capture({ html: 'path/to/index.html' })
                ).rejects.toThrow(errorMessage);
            });
        });
    });
});
