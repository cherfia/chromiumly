import { LibreOffice } from '../libre-office';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { PdfFormat } from '../../common';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('LibreOffice', () => {
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
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await LibreOffice.convert({
                    files: ['path/to/file.docx', 'path/to/file.bib']
                });
                expect(buffer).toEqual(Buffer.from('content'));
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
            });
        });

        describe('when properties are passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await LibreOffice.convert({
                    files: ['path/to/file.docx', 'path/to/file.bib'],
                    properties: { landscape: true },
                    pdfa: PdfFormat.A_2b,
                    pdfUA: true,
                    metadata: { author: 'John Doe' },
                    merge: true,
                    losslessImageCompression: true,
                    reduceImageResolution: false
                });
                expect(buffer).toEqual(Buffer.from('content'));
                expect(mockFormDataAppend).toHaveBeenCalledTimes(9);
            });
        });
    });
});
