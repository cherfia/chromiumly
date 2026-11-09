import { constants, openAsBlob, promises, ReadStream } from 'fs';
import path from 'path';
import { blob } from 'node:stream/consumers';

import { GotenbergUtils, StageUtils } from '../../common';
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
                data: file,
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
                if (
                    !(LIBRE_OFFICE_EXTENSIONS as readonly string[]).includes(
                        fileInfo.ext
                    )
                ) {
                    throw new Error(`${fileInfo.ext} is not supported`);
                }
                const filename = `file${String(index + 1).padStart(
                    paddingLength,
                    '0'
                )}.${fileInfo.ext}`;
                if (Buffer.isBuffer(fileInfo.data)) {
                    data.append('files', new Blob([fileInfo.data]), filename);
                } else if (fileInfo.data instanceof ReadStream) {
                    const content = await blob(fileInfo.data);
                    data.append('files', content, filename);
                } else {
                    await promises.access(fileInfo.data, constants.R_OK);
                    const content = await openAsBlob(fileInfo.data);
                    data.append('files', content, filename);
                }
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

        if (pageProperties.paperSize) {
            data.append('paperSize', pageProperties.paperSize);
        }

        if (pageProperties.paperWidth !== undefined) {
            data.append('paperWidth', String(pageProperties.paperWidth));
        }

        if (pageProperties.paperHeight !== undefined) {
            data.append('paperHeight', String(pageProperties.paperHeight));
        }

        if (pageProperties.nativePages) {
            if (typeof pageProperties.nativePages === 'string') {
                data.append('nativePages', pageProperties.nativePages);
            } else {
                GotenbergUtils.assert(
                    pageProperties.nativePages.from > 0 &&
                        pageProperties.nativePages.to > 0 &&
                        pageProperties.nativePages.to >=
                            pageProperties.nativePages.from,
                    'page ranges syntax error'
                );

                data.append(
                    'nativePages',
                    `${pageProperties.nativePages.from}-${pageProperties.nativePages.to}`
                );
            }
        }

        if (pageProperties.exportFormFields === false) {
            data.append(
                'exportFormFields',
                String(pageProperties.exportFormFields)
            );
        }

        if (pageProperties.singlePage) {
            data.append('singlePage', String(pageProperties.singlePage));
        }

        if (pageProperties.allowDuplicateFieldNames) {
            data.append(
                'allowDuplicateFieldNames',
                String(pageProperties.allowDuplicateFieldNames)
            );
        }

        if (pageProperties.nativeBookmarks === false) {
            data.append(
                'nativeBookmarks',
                String(pageProperties.nativeBookmarks)
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

        if (pageProperties.updateIndexes === false) {
            data.append('updateIndexes', String(pageProperties.updateIndexes));
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
        if (options.nativePdfa) {
            data.append('nativePdfa', options.nativePdfa);
        }

        if (options.nativePdfua) {
            data.append('nativePdfua', options.nativePdfua);
        }

        if (options.nativeTaggedPdf) {
            data.append('nativeTaggedPdf', String(options.nativeTaggedPdf));
        }

        if (options.nativeLosslessImageCompression) {
            data.append(
                'nativeLosslessImageCompression',
                String(options.nativeLosslessImageCompression)
            );
        }

        if (options.nativeReduceImageResolution) {
            data.append(
                'nativeReduceImageResolution',
                String(options.nativeReduceImageResolution)
            );
        }

        if (options.nativeQuality) {
            GotenbergUtils.assert(
                options.nativeQuality >= 1 && options.nativeQuality <= 100,
                'Invalid compression quality. Please provide a value between 1 and 100.'
            );
            data.append('nativeQuality', String(options.nativeQuality));
        }

        if (options.nativeMaxImageResolution) {
            GotenbergUtils.assert(
                options.nativeReduceImageResolution === true,
                'nativeMaxImageResolution is only supported when nativeReduceImageResolution is enabled.'
            );
            data.append(
                'nativeMaxImageResolution',
                String(options.nativeMaxImageResolution)
            );
        }

        if (options.initialView !== undefined) {
            data.append('initialView', options.initialView);
        }

        if (options.initialPage !== undefined) {
            data.append('initialPage', String(options.initialPage));
        }

        if (options.magnification !== undefined) {
            data.append('magnification', options.magnification);
        }

        if (options.zoom !== undefined) {
            data.append('zoom', String(options.zoom));
        }

        if (options.pageLayout !== undefined) {
            data.append('pageLayout', options.pageLayout);
        }

        if (options.resizeWindowToInitialPage) {
            data.append(
                'resizeWindowToInitialPage',
                String(options.resizeWindowToInitialPage)
            );
        }

        if (options.centerWindow) {
            data.append('centerWindow', String(options.centerWindow));
        }

        if (options.openInFullScreenMode) {
            data.append(
                'openInFullScreenMode',
                String(options.openInFullScreenMode)
            );
        }

        if (options.displayPDFDocumentTitle === false) {
            data.append(
                'displayPDFDocumentTitle',
                String(options.displayPDFDocumentTitle)
            );
        }

        if (options.hideViewerMenubar) {
            data.append('hideViewerMenubar', String(options.hideViewerMenubar));
        }

        if (options.hideViewerToolbar) {
            data.append('hideViewerToolbar', String(options.hideViewerToolbar));
        }

        if (options.hideViewerWindowControls) {
            data.append(
                'hideViewerWindowControls',
                String(options.hideViewerWindowControls)
            );
        }

        if (options.useTransitionEffects === false) {
            data.append(
                'useTransitionEffects',
                String(options.useTransitionEffects)
            );
        }

        if (options.openBookmarkLevels !== undefined) {
            data.append(
                'openBookmarkLevels',
                String(options.openBookmarkLevels)
            );
        }

        if (options.properties) {
            LibreOfficeUtils.addPageProperties(data, options.properties);
        }

        GotenbergUtils.assert(
            !(options.nativeWatermarkText && options.nativeTiledWatermarkText),
            'Set nativeWatermarkText or nativeTiledWatermarkText, not both'
        );

        if (options.nativeWatermarkText !== undefined) {
            data.append('nativeWatermarkText', options.nativeWatermarkText);
        }

        if (options.nativeWatermarkColor !== undefined) {
            data.append('nativeWatermarkColor', options.nativeWatermarkColor);
        }

        if (options.nativeWatermarkFontSize !== undefined) {
            data.append(
                'nativeWatermarkFontSize',
                String(options.nativeWatermarkFontSize)
            );
        }

        if (options.nativeWatermarkRotation !== undefined) {
            data.append(
                'nativeWatermarkRotation',
                String(options.nativeWatermarkRotation)
            );
        }

        if (options.nativeWatermarkFont !== undefined) {
            data.append('nativeWatermarkFont', options.nativeWatermarkFont);
        }

        if (options.nativeTiledWatermarkText !== undefined) {
            data.append(
                'nativeTiledWatermarkText',
                options.nativeTiledWatermarkText
            );
        }

        await GotenbergUtils.appendRequestInputs(data, {
            archives: options.archives,
            downloadFrom: options.downloadFrom
        });

        await StageUtils.appendStages(data, options.stages);
    }
}
