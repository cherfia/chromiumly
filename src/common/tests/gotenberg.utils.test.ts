import { createReadStream, promises, ReadStream } from 'fs';
import { blob } from 'node:stream/consumers';

import { GotenbergUtils } from '../gotenberg.utils';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file path'])),
    createReadStream: jest.fn()
}));

jest.mock('node:stream/consumers', () => ({
    blob: jest.fn().mockResolvedValue(new Blob(['stream content']))
}));

const mockResponse = () => new Response('content', { status: 200 });

const getResponseBuffer = async () => {
    const responseBuffer = await mockResponse().arrayBuffer();
    return Buffer.from(responseBuffer);
};

const mockFetch = jest
    .spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve(mockResponse()));

describe('GotenbergUtils', () => {
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');
    const data = new FormData();

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockImplementation(() => Promise.resolve(mockResponse()));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('assert', () => {
        const errorMessage = 'error message';

        it('should pass when condition is true', () => {
            expect(() =>
                GotenbergUtils.assert(true, errorMessage)
            ).not.toThrow();
        });

        it('should throw error when condition is false', () => {
            expect(() => GotenbergUtils.assert(false, errorMessage)).toThrow(
                errorMessage
            );
        });
    });

    describe('buildWebhookHeaders', () => {
        it('should return undefined when no options are provided', () => {
            expect(GotenbergUtils.buildWebhookHeaders()).toBeUndefined();
        });

        it('should build headers from webhookUrl alone', () => {
            expect(
                GotenbergUtils.buildWebhookHeaders({
                    webhookUrl: 'https://my.webhook/success'
                })
            ).toEqual({
                'Gotenberg-Webhook-Url': 'https://my.webhook/success'
            });
        });

        it('should build headers from the deprecated webhookErrorUrl alone', () => {
            expect(
                GotenbergUtils.buildWebhookHeaders({
                    webhookErrorUrl: 'https://my.webhook/error'
                })
            ).toEqual({
                'Gotenberg-Webhook-Error-Url': 'https://my.webhook/error'
            });
        });

        it('should build all optional headers when provided', () => {
            expect(
                GotenbergUtils.buildWebhookHeaders({
                    webhookUrl: 'https://my.webhook/success',
                    webhookErrorUrl: 'https://my.webhook/error',
                    webhookMethod: 'PUT',
                    webhookErrorMethod: 'PATCH',
                    webhookExtraHttpHeaders: { Authorization: 'Bearer 123' },
                    webhookEventsUrl: 'https://my.webhook/events'
                })
            ).toEqual({
                'Gotenberg-Webhook-Url': 'https://my.webhook/success',
                'Gotenberg-Webhook-Error-Url': 'https://my.webhook/error',
                'Gotenberg-Webhook-Method': 'PUT',
                'Gotenberg-Webhook-Error-Method': 'PATCH',
                'Gotenberg-Webhook-Extra-Http-Headers': JSON.stringify({
                    Authorization: 'Bearer 123'
                }),
                'Gotenberg-Webhook-Events-Url': 'https://my.webhook/events'
            });
        });

        it('should throw when neither webhookUrl nor webhookErrorUrl is provided', () => {
            expect(() =>
                GotenbergUtils.buildWebhookHeaders({ webhookMethod: 'POST' })
            ).toThrow(
                'At least one of webhookUrl or webhookErrorUrl must be provided'
            );
        });
    });

    describe('buildOutputHeaders', () => {
        it('should return undefined when no options are provided', () => {
            expect(GotenbergUtils.buildOutputHeaders()).toBeUndefined();
        });

        it('should return undefined when neither field is set', () => {
            expect(GotenbergUtils.buildOutputHeaders({})).toBeUndefined();
        });

        it('should build the output filename header', () => {
            expect(
                GotenbergUtils.buildOutputHeaders({
                    outputFilename: 'my-file'
                })
            ).toEqual({ 'Gotenberg-Output-Filename': 'my-file' });
        });

        it('should build the trace header', () => {
            expect(
                GotenbergUtils.buildOutputHeaders({ trace: 'my-trace-id' })
            ).toEqual({ 'Gotenberg-Trace': 'my-trace-id' });
        });

        it('should build both headers when both fields are set', () => {
            expect(
                GotenbergUtils.buildOutputHeaders({
                    outputFilename: 'my-file',
                    trace: 'my-trace-id'
                })
            ).toEqual({
                'Gotenberg-Output-Filename': 'my-file',
                'Gotenberg-Trace': 'my-trace-id'
            });
        });
    });

    describe('combineHeaders', () => {
        it('should return undefined when nothing to merge', () => {
            expect(
                GotenbergUtils.combineHeaders(undefined, undefined)
            ).toBeUndefined();
        });

        it('should merge multiple header records', () => {
            expect(
                GotenbergUtils.combineHeaders(
                    { 'Gotenberg-Webhook-Url': 'https://my.webhook' },
                    undefined,
                    { 'Gotenberg-Trace': 'my-trace-id' }
                )
            ).toEqual({
                'Gotenberg-Webhook-Url': 'https://my.webhook',
                'Gotenberg-Trace': 'my-trace-id'
            });
        });
    });

    describe('fetch', () => {
        const data = new FormData();
        const endpoint = 'http://localhost:3000/forms/chromium/convert/html';
        const basicAuthUsername = 'username';
        const basicAuthPassword = 'pass';
        const customHttpHeaders = { 'X-Custom-Header': 'value' };

        it('should return buffer and send correct headers on success', async () => {
            const buffer = await GotenbergUtils.fetch(
                endpoint,
                data,
                basicAuthUsername,
                basicAuthPassword,
                customHttpHeaders
            );

            expect(buffer).toEqual(await getResponseBuffer());

            expect(mockFetch).toHaveBeenCalledWith(
                endpoint,
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        Authorization: `Basic ${Buffer.from(
                            `${basicAuthUsername}:${basicAuthPassword}`
                        ).toString('base64')}`,
                        'X-Custom-Header': 'value'
                    }),
                    body: expect.any(Object)
                })
            );
        });

        it('should throw error on known fetch error', async () => {
            const errorMessage =
                'FetchError: request to http://localhost:3000/forms/chromium/convert/html failed';
            mockFetch.mockRejectedValueOnce(new Error(errorMessage));

            await expect(() =>
                GotenbergUtils.fetch(
                    endpoint,
                    data,
                    basicAuthUsername,
                    basicAuthPassword,
                    customHttpHeaders
                )
            ).rejects.toThrow(errorMessage);
        });

        it('should throw error on unknown fetch error', async () => {
            mockFetch.mockResolvedValueOnce(
                new Response('Error content', {
                    status: 500,
                    statusText: 'Internal server error'
                })
            );

            await expect(() =>
                GotenbergUtils.fetch(
                    endpoint,
                    data,
                    basicAuthUsername,
                    basicAuthPassword,
                    customHttpHeaders
                )
            ).rejects.toThrow('500 Internal server error');
        });

        it('should not add Authorization header when username is missing', async () => {
            const buffer = await GotenbergUtils.fetch(
                endpoint,
                data,
                undefined,
                basicAuthPassword,
                customHttpHeaders
            );

            expect(buffer).toEqual(await getResponseBuffer());

            expect(mockFetch).toHaveBeenCalledWith(
                endpoint,
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.not.objectContaining({
                        Authorization: expect.any(String)
                    }),
                    body: expect.any(Object)
                })
            );
        });

        it('should not add Authorization header when password is missing', async () => {
            const buffer = await GotenbergUtils.fetch(
                endpoint,
                data,
                basicAuthUsername,
                undefined,
                customHttpHeaders
            );

            expect(buffer).toEqual(await getResponseBuffer());

            expect(mockFetch).toHaveBeenCalledWith(
                endpoint,
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.not.objectContaining({
                        Authorization: expect.any(String)
                    }),
                    body: expect.any(Object)
                })
            );
        });

        it('should not add Authorization header when both username and password are missing', async () => {
            const buffer = await GotenbergUtils.fetch(
                endpoint,
                data,
                undefined,
                undefined,
                customHttpHeaders
            );

            expect(buffer).toEqual(await getResponseBuffer());

            expect(mockFetch).toHaveBeenCalledWith(
                endpoint,
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.not.objectContaining({
                        Authorization: expect.any(String)
                    }),
                    body: expect.any(Object)
                })
            );
        });

        it('should use X-Api-Key header and skip basic auth when apiKey is provided', async () => {
            const apiKey = 'secret-api-key';
            const buffer = await GotenbergUtils.fetch(
                endpoint,
                data,
                basicAuthUsername,
                basicAuthPassword,
                customHttpHeaders,
                apiKey
            );

            expect(buffer).toEqual(await getResponseBuffer());

            expect(mockFetch).toHaveBeenCalledWith(
                endpoint,
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'X-Api-Key': apiKey,
                        'X-Custom-Header': 'value'
                    }),
                    body: expect.any(Object)
                })
            );
            const init = mockFetch.mock.calls[0]?.[1] as
                | RequestInit
                | undefined;
            expect(init).toBeDefined();
            expect((init as RequestInit).headers).not.toHaveProperty(
                'Authorization'
            );
        });
    });

    describe('fetchWithoutBody', () => {
        const endpoint = 'http://localhost:3000/health';

        it('should forward the request headers', async () => {
            await GotenbergUtils.fetchWithoutBody(
                endpoint,
                'GET',
                undefined,
                undefined,
                undefined,
                undefined,
                { 'Gotenberg-Trace': 'my-trace-id' }
            );

            expect(mockFetch).toHaveBeenCalledWith(
                endpoint,
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Gotenberg-Trace': 'my-trace-id'
                    })
                })
            );
        });
    });

    describe('addFile', () => {
        const mockPromisesAccess = jest.spyOn(promises, 'access');
        const filePath = '/mock/path/file.html';

        beforeEach(() => {
            mockPromisesAccess.mockResolvedValue();
            const mockStream = {
                pipe: jest.fn(),
                on: jest.fn(),
                async *[Symbol.asyncIterator]() {
                    yield Buffer.from('file content');
                }
            };
            (createReadStream as jest.Mock).mockReturnValue(mockStream);
        });

        it('should append read stream file to data', async () => {
            const mockReadStream = {
                pipe: jest.fn(),
                on: jest.fn(),
                read: jest.fn(),
                [Symbol.toStringTag]: 'ReadStream'
            } as unknown as ReadStream;
            Object.setPrototypeOf(mockReadStream, ReadStream.prototype);

            await GotenbergUtils.addFile(data, mockReadStream, 'file');
            expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
            expect(blob).toHaveBeenCalledWith(mockReadStream);
        });

        it('should append file path to data', async () => {
            await GotenbergUtils.addFile(data, filePath, 'file');
            expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
        });

        it('should append buffer to data', async () => {
            const file = Buffer.from('data');
            await GotenbergUtils.addFile(data, file, 'file');
            expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'files',
                new Blob([file]),
                'file'
            );
        });
    });
});
