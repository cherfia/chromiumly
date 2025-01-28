// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from 'fs';

import { PDFEnginesUtils } from '../pdf-engines.utils';

jest.mock('node:stream/consumers', () => ({
    blob: jest.fn().mockResolvedValue(new Blob(['stream content']))
}));

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file path'])),
    createReadStream: jest.fn()
}));

describe('PDFEnginesUtils', () => {
    const mockPromisesAccess = jest.spyOn(promises, 'access');
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');
    const data = new FormData();

    beforeEach(() => {
        (createReadStream as jest.Mock) = jest.fn().mockImplementation(() => ({
            pipe: jest.fn(),
            on: jest.fn(),
            async *[Symbol.asyncIterator]() {
                yield Buffer.from('file content');
            }
        }));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('addFiles', () => {
        describe('when files exist', () => {
            describe('when files parameter contains paths', () => {
                it('should append each file to data', async () => {
                    mockPromisesAccess.mockResolvedValue();
                    await PDFEnginesUtils.addFiles(
                        ['path/to/file.pdf', 'path/to/another-file.pdf'],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                });
            });
            describe('when files parameter contains a buffer', () => {
                it('should append each file to data', async () => {
                    mockPromisesAccess.mockResolvedValue();
                    await PDFEnginesUtils.addFiles(
                        [Buffer.from('data'), 'path/to/another-file.pdf'],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                });
            });
        });

        describe('when one of the files is not PDF', () => {
            it('should throw an error', async () => {
                mockPromisesAccess.mockResolvedValue();
                await expect(() =>
                    PDFEnginesUtils.addFiles(
                        ['path/to/file.docx', 'path/to/file.pdf'],
                        data
                    )
                ).rejects.toThrow('.docx is not supported');
            });
        });

        describe('when one of the files does not exist', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    "ENOENT: no such file or directory, access 'path/to/index.html'";
                mockPromisesAccess.mockRejectedValue(new Error(errorMessage));
                await expect(() =>
                    PDFEnginesUtils.addFiles(
                        ['path/to/file.pdf', 'path/to/another-file.pdf'],
                        data
                    )
                ).rejects.toThrow(errorMessage);
            });
        });
    });
});
