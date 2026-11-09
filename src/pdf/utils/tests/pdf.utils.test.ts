import { promises, ReadStream } from 'fs';
import { blob } from 'node:stream/consumers';

import { PDFUtils } from '../pdf.utils';

jest.mock('node:stream/consumers', () => ({
    blob: jest.fn().mockResolvedValue(new Blob(['stream content']))
}));

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file path'])),
    createReadStream: jest.fn()
}));

describe('PDFUtils', () => {
    const mockPromisesAccess = jest.spyOn(promises, 'access');
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');
    const data = new FormData();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('addFiles', () => {
        describe('when files exist', () => {
            describe('when files parameter contains paths', () => {
                it('should append each file to data', async () => {
                    mockPromisesAccess.mockResolvedValue();
                    await PDFUtils.addFiles(
                        ['path/to/file.pdf', 'path/to/another-file.pdf'],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                });
            });
            describe('when files parameter contains a buffer', () => {
                it('should append each file to data', async () => {
                    mockPromisesAccess.mockResolvedValue();
                    await PDFUtils.addFiles(
                        [Buffer.from('data'), 'path/to/another-file.pdf'],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                });
            });

            describe('when files parameter contains a ReadStream', () => {
                it('should append each file to data', async () => {
                    const mockReadStream = {
                        pipe: jest.fn(),
                        on: jest.fn(),
                        read: jest.fn(),
                        [Symbol.toStringTag]: 'ReadStream'
                    } as unknown as ReadStream;
                    Object.setPrototypeOf(mockReadStream, ReadStream.prototype);
                    mockPromisesAccess.mockResolvedValue();
                    await PDFUtils.addFiles(
                        [mockReadStream, 'path/to/another-file.pdf'],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(blob).toHaveBeenCalledWith(mockReadStream);
                });
            });
        });

        describe('when files parameter contains named inputs', () => {
            it('should upload each under its name', async () => {
                mockPromisesAccess.mockResolvedValue();
                await PDFUtils.addFiles(
                    [
                        { file: Buffer.from('a'), name: '2-body.pdf' },
                        { file: 'path/to/cover.pdf', name: '1-cover.pdf' },
                        Buffer.from('c')
                    ],
                    data
                );
                expect(
                    mockFormDataAppend.mock.calls.map((call) => call[2]).sort()
                ).toEqual(['1-cover.pdf', '2-body.pdf', 'file03.pdf']);
            });
        });

        describe('when one of the files is not PDF', () => {
            it('should throw an error', async () => {
                mockPromisesAccess.mockResolvedValue();
                await expect(() =>
                    PDFUtils.addFiles(
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
                    PDFUtils.addFiles(
                        ['path/to/file.pdf', 'path/to/another-file.pdf'],
                        data
                    )
                ).rejects.toThrow(errorMessage);
            });
        });
    });
});
