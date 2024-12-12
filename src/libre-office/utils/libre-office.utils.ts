import { constants, createReadStream, promises } from 'fs';
import path from 'path';

import FormData from 'form-data';

import { GotenbergUtils } from '../../common';
import { LIBRE_OFFICE_EXTENSIONS } from './constants';
import {
    ConversionOptions,
    PageProperties,
    PathLikeOrReadStream
} from '../interfaces/libre-office.types';

/**
 * Utility class for handling common tasks related to LibreOffice conversions.
 */
export class LibreOfficeUtils {
    private static async getFileInfo(file: PathLikeOrReadStream) {
        if (typeof file === 'string') {
            await promises.access(file, constants.R_OK);
            const filename = path.basename(path.parse(file).base);
            return {
                data: createReadStream(file),
                ext: path.extname(filename).slice(1)
            };
        } else {
            return { data: file.data, ext: file.ext };
        }
    }

    /**
     * Adds files to the FormData object for LibreOffice conversion.
     *
     * @param {PathLikeOrReadStream[]} files - An array of files to be added to the FormData.
     * @param {FormData} data - The FormData object to which files will be added.
     * @throws {Error} Throws an error if the file extension is not supported.
     */
    public static async addFiles(
        files: PathLikeOrReadStream[],
        data: FormData
    ) {
        const paddingLength = String(files.length).length + 1;
        await Promise.all(
            files.map(async (file, index) => {
                const fileInfo = await this.getFileInfo(file);
                if (!LIBRE_OFFICE_EXTENSIONS.includes(fileInfo.ext)) {
                    throw new Error(`${fileInfo.ext} is not supported`);
                }
                const filename = `file${String(index + 1).padStart(
                    paddingLength,
                    '0'
                )}.${fileInfo.ext}`;
                data.append('files', fileInfo.data, filename);
            })
        );
    }

    /**
     * Adds page properties to the FormData object based on the provided PageProperties.
     *
     * @param {FormData} data - The FormData object to which page properties will be added.
     * @param {PageProperties} pageProperties - The page properties to be added to the FormData.
     */
    public static addPageProperties(
        data: FormData,
        pageProperties: PageProperties
    ): void {
        if (pageProperties.landscape) {
            data.append('landscape', String(pageProperties.landscape));
        }

        if (pageProperties.nativePageRanges) {
            GotenbergUtils.assert(
                pageProperties.nativePageRanges.from > 0 &&
                    pageProperties.nativePageRanges.to > 0 &&
                    pageProperties.nativePageRanges.to >=
                        pageProperties.nativePageRanges.from,
                'page ranges syntax error'
            );

            data.append(
                'nativePageRanges',
                `${pageProperties.nativePageRanges.from}-${pageProperties.nativePageRanges.to}`
            );
        }

        if (pageProperties.exportFormFields === false) {
            data.append(
                'exportFormFields',
                String(pageProperties.exportFormFields)
            );
        }

        if (pageProperties.singlePageSheets) {
            data.append(
                'singlePageSheets',
                String(pageProperties.singlePageSheets)
            );
        }

        if (pageProperties.allowDuplicateFieldNames) {
            data.append(
                'allowDuplicateFieldNames',
                String(pageProperties.allowDuplicateFieldNames)
            );
        }

        if (pageProperties.exportBookmarks === false) {
            data.append(
                'exportBookmarks',
                String(pageProperties.exportBookmarks)
            );
        }

        if (pageProperties.exportBookmarksToPdfDestination) {
            data.append(
                'exportBookmarksToPdfDestination',
                String(pageProperties.exportBookmarksToPdfDestination)
            );
        }

        if (pageProperties.exportPlaceholders) {
            data.append(
                'exportPlaceholders',
                String(pageProperties.exportPlaceholders)
            );
        }

        if (pageProperties.exportNotes) {
            data.append('exportNotes', String(pageProperties.exportNotes));
        }

        if (pageProperties.exportNotesPages) {
            data.append(
                'exportNotesPages',
                String(pageProperties.exportNotesPages)
            );
        }

        if (pageProperties.exportOnlyNotesPages) {
            data.append(
                'exportOnlyNotesPages',
                String(pageProperties.exportOnlyNotesPages)
            );
        }

        if (pageProperties.exportNotesInMargin) {
            data.append(
                'exportNotesInMargin',
                String(pageProperties.exportNotesInMargin)
            );
        }

        if (pageProperties.convertOooTargetToPdfTarget) {
            data.append(
                'convertOooTargetToPdfTarget',
                String(pageProperties.convertOooTargetToPdfTarget)
            );
        }

        if (pageProperties.exportLinksRelativeFsys) {
            data.append(
                'exportLinksRelativeFsys',
                String(pageProperties.exportLinksRelativeFsys)
            );
        }

        if (pageProperties.exportHiddenSlides) {
            data.append(
                'exportHiddenSlides',
                String(pageProperties.exportHiddenSlides)
            );
        }

        if (pageProperties.skipEmptyPages) {
            data.append(
                'skipEmptyPages',
                String(pageProperties.skipEmptyPages)
            );
        }

        if (pageProperties.addOriginalDocumentAsStream) {
            data.append(
                'addOriginalDocumentAsStream',
                String(pageProperties.addOriginalDocumentAsStream)
            );
        }

        if (pageProperties.password) {
            data.append('password', pageProperties.password);
        }
    }

    /**
     * Customizes the FormData object based on the provided conversion options.
     *
     * @param {FormData} data - The FormData object to be customized.
     * @param {ConversionOptions} options - The conversion options to apply to the FormData.
     * @returns {Promise<void>} A Promise that resolves once the customization is complete.
     */
    public static async customize(
        data: FormData,
        options: ConversionOptions
    ): Promise<void> {
        if (options.pdfa) {
            data.append('pdfa', options.pdfa);
        }

        if (options.pdfUA) {
            data.append('pdfua', String(options.pdfUA));
        }

        if (options.merge) {
            data.append('merge', String(options.merge));
        }

        if (options.metadata) {
            data.append('metadata', JSON.stringify(options.metadata));
        }

        if (options.losslessImageCompression) {
            data.append(
                'losslessImageCompression',
                String(options.losslessImageCompression)
            );
        }

        if (options.reduceImageResolution) {
            data.append(
                'reduceImageResolution',
                String(options.reduceImageResolution)
            );
        }

        if (options.quality) {
            GotenbergUtils.assert(
                options.quality >= 1 && options.quality <= 100,
                'Invalid compression quality. Please provide a value between 1 and 100.'
            );
            data.append('quality', options.quality);
        }

        if (options.maxImageResolution) {
            GotenbergUtils.assert(
                options.reduceImageResolution === true,
                'Compression quality is only supported when the reduceImageResolution property is enabled.'
            );
            data.append('maxImageResolution', options.maxImageResolution);
        }

        if (options.downloadFrom) {
            data.append('downloadFrom', JSON.stringify(options.downloadFrom));
        }

        if (options.properties) {
            LibreOfficeUtils.addPageProperties(data, options.properties);
        }
    }
}
