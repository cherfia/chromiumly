import { createReadStream, promises } from 'fs';

import { GotenbergUtils } from '../gotenberg.utils';
import { blob } from 'node:stream/consumers';

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
            const file = createReadStream(filePath);
            await GotenbergUtils.addFile(data, file, 'file');
            expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
            const content = await blob(file);
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'files',
                content,
                'file'
            );
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
