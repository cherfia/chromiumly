import fetch from 'node-fetch';
import FormData from 'form-data';

import { GotenbergUtils } from './../gotenberg.utils';

const { Response, FetchError } = jest.requireActual('node-fetch');

jest.mock('node-fetch', () => jest.fn());

describe('GotenbergUtils', () => {
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
});
