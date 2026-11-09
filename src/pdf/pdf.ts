import { promises } from 'fs';
import path from 'path';

import { Chromiumly } from '../main.config';
import {
    ConformanceProfiles,
    GotenbergUtils,
    Stage,
    StageOp,
    StageUtils
} from '../common';
import { PDFUtils } from './utils/pdf.utils';
import {
    Bookmark,
    PdfAttachment,
    PdfFormField,
    PdfInfo,
    PdfMetadata,
    PdfReadOptions,
    PdfReadResult,
    PdfRequestOptions,
    PdfStageRouteOptions,
    PdfValidation,
    PipeOptions
} from './interfaces/pdf.types';

/**
 * Class for the `/forms/pdf` routes: run stages on PDFs, one by one or as a pipe, and read PDFs.
 */
export class PDF {
    private static endpoint(route: string): string {
        return `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_PATH}/${route}`;
    }

    private static post(
        route: string,
        data: FormData,
        requestHttpHeaders?: Record<string, string>
    ): Promise<Buffer> {
        return GotenbergUtils.fetch(
            this.endpoint(route),
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            requestHttpHeaders
        );
    }

    private static async send(
        route: string,
        data: FormData,
        {
            files,
            archives,
            downloadFrom,
            webhook,
            outputFilename,
            trace
        }: PdfRequestOptions
    ): Promise<Buffer> {
        if (files?.length) {
            await PDFUtils.addFiles(files, data);
        }
        await GotenbergUtils.appendRequestInputs(data, {
            archives,
            downloadFrom
        });

        return this.post(
            route,
            data,
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
        );
    }

    /**
     * Runs one stage on its own route, `/forms/pdf/<op>`, which takes the stage's options as form fields.
     */
    private static async runStage<Op extends StageOp>(
        op: Op,
        {
            files,
            archives,
            downloadFrom,
            webhook,
            outputFilename,
            trace,
            ...options
        }: PdfStageRouteOptions<Op>
    ): Promise<Buffer> {
        const data = new FormData();
        await StageUtils.appendStageFields(data, {
            op,
            ...options
        } as unknown as Stage);

        return this.send(op, data, {
            files,
            archives,
            downloadFrom,
            webhook,
            outputFilename,
            trace
        });
    }

    private static async read<T>(
        route: string,
        { files, archives, downloadFrom, password, trace }: PdfReadOptions,
        fields: Record<string, string> = {}
    ): Promise<PdfReadResult<T>> {
        const data = new FormData();
        if (files?.length) {
            await PDFUtils.addFiles(files, data);
        }
        await GotenbergUtils.appendRequestInputs(data, {
            archives,
            downloadFrom
        });

        if (password) {
            data.append('password', password);
        }

        for (const [key, value] of Object.entries(fields)) {
            data.append(key, value);
        }

        const buffer = await this.post(
            route,
            data,
            GotenbergUtils.buildOutputHeaders({ trace })
        );
        return JSON.parse(buffer.toString());
    }

    /**
     * Runs stages on the PDFs, in order.
     *
     * @param {PipeOptions} options - The PDFs and the stages to run on them.
     * @returns {Promise<Buffer>} The PDF, or a ZIP when several files come out.
     */
    public static async pipe({
        stages,
        ...options
    }: PipeOptions): Promise<Buffer> {
        GotenbergUtils.assert(
            stages.length > 0,
            'At least one stage must be provided'
        );

        const data = new FormData();
        await StageUtils.appendStages(data, stages);
        return this.send(Chromiumly.PDF_ROUTES.pipe, data, options);
    }

    /** Appends the PDFs into one, in the alphanumeric order of their names. */
    public static merge(options: PdfRequestOptions): Promise<Buffer> {
        return this.runStage('merge', options);
    }

    /** Cuts each PDF into several, which come back in a ZIP. Set `every` or `ranges`. */
    public static async split(
        options: PdfStageRouteOptions<'split'>
    ): Promise<Buffer> {
        GotenbergUtils.assert(
            (options.every !== undefined) !== (options.ranges !== undefined),
            'Exactly one of every or ranges must be provided'
        );
        return this.runStage('split', options);
    }

    /** Keeps the pages listed, in the order listed. */
    public static select(
        options: PdfStageRouteOptions<'select'>
    ): Promise<Buffer> {
        return this.runStage('select', options);
    }

    /** Removes the pages listed. */
    public static delete(
        options: PdfStageRouteOptions<'delete'>
    ): Promise<Buffer> {
        return this.runStage('delete', options);
    }

    /** Inserts the pages of another PDF. */
    public static insert(
        options: PdfStageRouteOptions<'insert'>
    ): Promise<Buffer> {
        return this.runStage('insert', options);
    }

    /** Draws pages of the PDFs on new pages of a chosen size: labels, packing slips, n-up sheets. */
    public static compose(
        options: PdfStageRouteOptions<'compose'>
    ): Promise<Buffer> {
        return this.runStage('compose', options);
    }

    /** Sets the rotation of pages. */
    public static rotate(
        options: PdfStageRouteOptions<'rotate'>
    ): Promise<Buffer> {
        return this.runStage('rotate', options);
    }

    /** Draws a line of text over pages. */
    public static stampText(
        options: PdfStageRouteOptions<'stamp-text'>
    ): Promise<Buffer> {
        return this.runStage('stamp-text', options);
    }

    /** Draws a PNG or JPEG image over pages. */
    public static stampImage(
        options: PdfStageRouteOptions<'stamp-image'>
    ): Promise<Buffer> {
        return this.runStage('stamp-image', options);
    }

    /** Draws a page of another PDF over pages: a letterhead, a seal. */
    public static stampPdf(
        options: PdfStageRouteOptions<'stamp-pdf'>
    ): Promise<Buffer> {
        return this.runStage('stamp-pdf', options);
    }

    /** Writes the document information. A field left out keeps its value. */
    public static setMetadata(
        options: PdfStageRouteOptions<'set-metadata'>
    ): Promise<Buffer> {
        return this.runStage('set-metadata', options);
    }

    /** Replaces the bookmarks. */
    public static setBookmarks(
        options: PdfStageRouteOptions<'set-bookmarks'>
    ): Promise<Buffer> {
        return this.runStage('set-bookmarks', options);
    }

    /** Fills form fields. */
    public static setForm(
        options: PdfStageRouteOptions<'set-form'>
    ): Promise<Buffer> {
        return this.runStage('set-form', options);
    }

    /** Burns the form fields into the pages. */
    public static flattenForm(options: PdfRequestOptions): Promise<Buffer> {
        return this.runStage('flatten-form', options);
    }

    /** Replaces transparent content with opaque content. */
    public static flattenTransparency(
        options: PdfRequestOptions
    ): Promise<Buffer> {
        return this.runStage('flatten-transparency', options);
    }

    /** Converts every color to one color space. */
    public static convertColors(
        options: PdfStageRouteOptions<'convert-colors'>
    ): Promise<Buffer> {
        return this.runStage('convert-colors', options);
    }

    /** Removes the content under each region from the file itself. */
    public static redact(
        options: PdfStageRouteOptions<'redact'>
    ): Promise<Buffer> {
        return this.runStage('redact', options);
    }

    /** Infers a structure tree for an untagged PDF. */
    public static autotag(options: PdfRequestOptions): Promise<Buffer> {
        return this.runStage('autotag', options);
    }

    /** Embeds a file in the PDF. */
    public static attach(
        options: PdfStageRouteOptions<'attach'>
    ): Promise<Buffer> {
        return this.runStage('attach', options);
    }

    /** Removes an embedded file. */
    public static detach(
        options: PdfStageRouteOptions<'detach'>
    ): Promise<Buffer> {
        return this.runStage('detach', options);
    }

    /** Returns the embedded files. */
    public static extractAttachments(
        options: PdfStageRouteOptions<'extract-attachments'>
    ): Promise<Buffer> {
        return this.runStage('extract-attachments', options);
    }

    /** Returns the text the pages show, its pages separated by a form feed. */
    public static extractText(
        options: PdfStageRouteOptions<'extract-text'>
    ): Promise<Buffer> {
        return this.runStage('extract-text', options);
    }

    /** Rewrites the PDF to shrink it, without lowering image quality. */
    public static optimize(
        options: PdfStageRouteOptions<'optimize'>
    ): Promise<Buffer> {
        return this.runStage('optimize', options);
    }

    /** Protects the PDF with passwords. */
    public static async encrypt(
        options: PdfStageRouteOptions<'encrypt'>
    ): Promise<Buffer> {
        GotenbergUtils.assert(
            !!options.userPassword || !!options.ownerPassword,
            'At least one of userPassword or ownerPassword must be provided'
        );
        return this.runStage('encrypt', options);
    }

    /** Opens encrypted PDFs and removes their encryption. */
    public static decrypt(
        options: PdfStageRouteOptions<'decrypt'>
    ): Promise<Buffer> {
        return this.runStage('decrypt', options);
    }

    /** Repairs the PDF until it conforms to PDF/A, PDF/UA or Factur-X. */
    public static remediate(
        options: PdfStageRouteOptions<'remediate'>
    ): Promise<Buffer> {
        return this.runStage('remediate', options);
    }

    /** Signs the PDF with a certificate. */
    public static sign(options: PdfStageRouteOptions<'sign'>): Promise<Buffer> {
        return this.runStage('sign', options);
    }

    /** Adds an RFC 3161 document timestamp. */
    public static timestamp(
        options: PdfStageRouteOptions<'timestamp'>
    ): Promise<Buffer> {
        return this.runStage('timestamp', options);
    }

    /** Draws pages as images. */
    public static render(
        options: PdfStageRouteOptions<'render'>
    ): Promise<Buffer> {
        return this.runStage('render', options);
    }

    /** Reads the page count, the PDF version, and whether each PDF is encrypted, tagged, linearized or holds form fields. */
    public static info(
        options: PdfReadOptions
    ): Promise<PdfReadResult<PdfInfo>> {
        return this.read(Chromiumly.PDF_ROUTES.info, options);
    }

    /** Reads the document information. */
    public static metadata(
        options: PdfReadOptions
    ): Promise<PdfReadResult<PdfMetadata>> {
        return this.read(Chromiumly.PDF_ROUTES.metadata, options);
    }

    /** Reads the bookmarks. */
    public static bookmarks(
        options: PdfReadOptions
    ): Promise<PdfReadResult<Bookmark[]>> {
        return this.read(Chromiumly.PDF_ROUTES.bookmarks, options);
    }

    /** Lists the embedded files. */
    public static attachments(
        options: PdfReadOptions
    ): Promise<PdfReadResult<PdfAttachment[]>> {
        return this.read(Chromiumly.PDF_ROUTES.attachments, options);
    }

    /** Lists the form fields, optionally only those on some pages. */
    public static form({
        pages,
        ...options
    }: PdfReadOptions & { pages?: string }): Promise<
        PdfReadResult<PdfFormField[]>
    > {
        return this.read(
            Chromiumly.PDF_ROUTES.form,
            options,
            pages ? { pages } : {}
        );
    }

    /** Checks the PDFs against PDF/A, PDF/UA or Factur-X, and lists the violations. */
    public static validate({
        profile,
        ...options
    }: PdfReadOptions & { profile: ConformanceProfiles }): Promise<
        PdfReadResult<PdfValidation>
    > {
        return this.read(Chromiumly.PDF_ROUTES.validate, options, {
            profile: Array.isArray(profile) ? JSON.stringify(profile) : profile
        });
    }

    /**
     * Generates a PDF file from a buffer and saves it to the "__generated__" directory.
     *
     * @param {string} filename - The filename for the generated PDF.
     * @param {Buffer} buffer - The PDF content as a buffer
     * @returns {Promise<void>} A Promise that resolves once the file is generated and saved.
     */
    public static async generate(
        filename: string,
        buffer: Buffer
    ): Promise<void> {
        const __generated__ = path.resolve(process.cwd(), '__generated__');
        await promises.mkdir(path.resolve(__generated__), { recursive: true });
        await promises.writeFile(path.resolve(__generated__, filename), buffer);
    }
}
