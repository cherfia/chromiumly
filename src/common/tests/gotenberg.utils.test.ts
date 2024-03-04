import { createReadStream, promises } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

import { GotenbergUtils } from './../gotenberg.utils';

const { Response, FetchError } = jest.requireActual('node-fetch');

jest.mock('node-fetch', () => jest.fn());

describe('GotenbergUtils', () => {
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');
    const data = new FormData();

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('assert', () => {
        const errorMessage = 'error message';
        describe('when condition is true', () => {
            it('should pass', () => {
                expect(() =>
                    GotenbergUtils.assert(true, errorMessage)
                ).not.toThrow();
            });
        });
        describe('when condition is false', () => {
            it('should return error message', () => {
                expect(() =>
                    GotenbergUtils.assert(false, errorMessage)
                ).toThrow(errorMessage);
            });
        });
    });

    describe('fetch', () => {
        const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
        const data = new FormData();
        const endpoint = 'http://localhost:3000/forms/chromium/convert/html';

        describe('when fetch request succeeds', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValueOnce(new Response('content'));
                const response = await GotenbergUtils.fetch(endpoint, data);
                await expect(response).toEqual(Buffer.from('content'));
            });
        });

        describe('when fetch request fails', () => {
            describe('when there is a known error', () => {
                it('should throw an error', async () => {
                    const errorMessage =
                        'FetchError: request to http://localhost:3000/forms/chromium/convert/html failed';
                    mockFetch.mockRejectedValueOnce(
                        new FetchError(errorMessage)
                    );
                    await expect(() =>
                        GotenbergUtils.fetch(endpoint, data)
                    ).rejects.toThrow(errorMessage);
                });
            });

            describe('when there is an unknown error', () => {
                it('should throw an error', async () => {
                    mockFetch.mockResolvedValueOnce(
                        new Response(
                            {},
                            {
                                status: 500,
                                statusText: 'Internal server error'
                            }
                        )
                    );
                    await expect(() =>
                        GotenbergUtils.fetch(endpoint, data)
                    ).rejects.toThrow('500 Internal server error');
                });
            });
        });
    });

    describe('addFile', () => {
        const mockPromisesAccess = jest.spyOn(promises, 'access');
        const __tmp__ = path.resolve(process.cwd(), '__tmp__');
        const filePath = path.resolve(__tmp__, 'file.html');

        beforeAll(async () => {
            mockPromisesAccess.mockResolvedValue();
            await promises.mkdir(path.resolve(__tmp__), { recursive: true });
            await promises.writeFile(filePath, 'data');
        });

        afterAll(async () => {
            await promises.rm(path.resolve(__tmp__), { recursive: true });
        });

        describe('when file is passed as read stream', () => {
            it('should append file to data', async () => {
                const file = createReadStream(filePath);
                await GotenbergUtils.addFile(data, file, 'file');
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('files', file, 'file');
            });
        });

        describe('when file is passed as path', () => {
            it('should append file to data', async () => {
                await GotenbergUtils.addFile(data, filePath, 'file');
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
            });
        });

        describe('when file is passed as buffer', () => {
            it('should append file to data', async () => {
                const file = Buffer.from('data');
                await GotenbergUtils.addFile(data, file, 'file');
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('files', file, 'file');
            });
        });
    });
});
