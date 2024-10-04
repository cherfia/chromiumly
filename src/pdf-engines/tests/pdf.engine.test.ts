// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from 'fs';
import FormData from 'form-data';
import fs from 'fs/promises';
import fetch from 'node-fetch';
import path from 'path';

import { PdfFormat } from '../../common';
import { PDFEngines } from '../pdf-engines';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('PDFEngines', () => {
    const mockPromisesAccess = jest.spyOn(promises, 'access');
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');

    beforeEach(() => {
        (createReadStream as jest.Mock) = jest
            .fn()
            .mockImplementation((file) => file);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('convert', () => {
        describe('when no properties are passed', () => {
            it('should throw an error', async () => {
                mockPromisesAccess.mockResolvedValue();
                mockFetch.mockResolvedValue(new Response('content'));
                await expect(
                    PDFEngines.convert({
                        files: ['path/to/file_1.pdf', 'path/to/file_2.pdf']
                    })
                ).rejects.toThrow(
                    'At least one of pdfa or pdfUA must be provided'
                );
            });
        });

        describe('when properties are passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await PDFEngines.convert({
                    files: ['path/to/file_1.pdf', 'path/to/file_2.pdf'],
                    pdfa: PdfFormat.A_2b,
                    pdfUA: true,
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(buffer).toEqual(Buffer.from('content'));
                expect(mockFormDataAppend).toHaveBeenCalledTimes(5);
            });
        });
    });

    describe('merge', () => {
        it('should return a buffer', async () => {
            mockPromisesAccess.mockResolvedValue();
            mockFetch.mockResolvedValue(new Response('content'));
            const buffer = await PDFEngines.merge({
                files: ['path/to/file.pdf', 'path/to/another-file.pdf'],
                pdfa: PdfFormat.A_2b,
                pdfUA: true,
                metadata: { Author: 'John Doe' }
            });
            expect(buffer).toEqual(Buffer.from('content'));
            expect(mockFormDataAppend).toHaveBeenCalledTimes(5);
        });
    });

    describe('readMetadata', () => {
        it('should return a buffer', async () => {
            mockPromisesAccess.mockResolvedValue();
            mockFetch.mockResolvedValue(new Response('content'));
            const buffer = await PDFEngines.readMetadata(['path/to/file.pdf']);
            expect(buffer).toEqual(Buffer.from('content'));
            expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
        });
    });

    describe('writeMetadata', () => {
        it('should return a buffer', async () => {
            mockPromisesAccess.mockResolvedValue();
            mockFetch.mockResolvedValue(new Response('content'));
            const buffer = await PDFEngines.writeMetadata({
                files: ['path/to/file.pdf'],
                metadata: {
                    Author: 'John Doe',
                    Copyright: 'John Doe',
                    CreationDate: Date.now(),
                    Creator: 'Chromiumly',
                    Keywords: ['first', 'second'],
                    Marked: true,
                    ModDate: Date.now(),
                    PDFVersion: 1.7,
                    Producer: 'Chromiumly',
                    Subject: 'Sample',
                    Title: 'Sample',
                    Trapped: 'Unknown'
                }
            });
            expect(buffer).toEqual(Buffer.from('content'));
            expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
        });
    });

    describe('generate', () => {
        const mockFilename = 'test.pdf';
        const mockBuffer = Buffer.from('mock pdf content');

        afterAll(() => {
            jest.restoreAllMocks();
        });

        it('should generate a PDF file', async () => {
            const mockGeneratedDir = path.join(process.cwd(), '__generated__');
            const mockGeneratedFilePath = path.join(
                mockGeneratedDir,
                mockFilename
            );

            const mockPromisesMkDir = jest
                .spyOn(fs, 'mkdir')
                .mockResolvedValueOnce(mockGeneratedDir);

            const mockPromisesWriteFile = jest
                .spyOn(fs, 'writeFile')
                .mockResolvedValueOnce();

            await PDFEngines.generate(mockFilename, mockBuffer);

            expect(mockPromisesMkDir).toHaveBeenCalledWith(mockGeneratedDir, {
                recursive: true
            });

            expect(mockPromisesWriteFile).toHaveBeenCalledWith(
                mockGeneratedFilePath,
                mockBuffer
            );
        });

        it('should handle errors during file generation', async () => {
            jest.spyOn(fs, 'mkdir').mockRejectedValueOnce(
                new Error('Cannot create directory')
            );

            await expect(
                PDFEngines.generate(mockFilename, mockBuffer)
            ).rejects.toThrow('Cannot create directory');
        });

        it('should handle errors during file writing', async () => {
            jest.spyOn(fs, 'writeFile').mockRejectedValueOnce(
                new Error('Failed to write to file')
            );

            await expect(
                PDFEngines.generate(mockFilename, mockBuffer)
            ).rejects.toThrow('Failed to write to file');
        });
    });
});
