import { constants, openAsBlob, promises, ReadStream } from 'fs';
import path from 'path';
import { blob } from 'node:stream/consumers';

import type { FacturXOptions } from './factur-x.types';

/**
 * Appends the Factur-X multipart fields (`facturxXml`, `facturxConformanceLevel`,
 * `facturxDocumentType`, `facturxVersion`, `pdfa`, `pdfua`) for Gotenberg's Factur-X feature.
 */
export async function appendFacturX(
    data: FormData,
    facturx?: FacturXOptions
): Promise<void> {
    if (!facturx) {
        return;
    }

    const { facturxXml } = facturx;
    const filename =
        typeof facturxXml === 'string'
            ? path.basename(facturxXml.toString())
            : 'factur-x.xml';

    if (Buffer.isBuffer(facturxXml)) {
        data.append('facturxXml', new Blob([facturxXml]), filename);
    } else if (facturxXml instanceof ReadStream) {
        const content = await blob(facturxXml);
        data.append('facturxXml', content, filename);
    } else {
        await promises.access(facturxXml, constants.R_OK);
        const content = await openAsBlob(facturxXml);
        data.append('facturxXml', content, filename);
    }

    data.append('facturxConformanceLevel', facturx.facturxConformanceLevel);

    if (facturx.facturxDocumentType !== undefined) {
        data.append('facturxDocumentType', facturx.facturxDocumentType);
    }

    if (facturx.facturxVersion !== undefined) {
        data.append('facturxVersion', facturx.facturxVersion);
    }

    if (facturx.pdfa !== undefined) {
        data.append('pdfa', facturx.pdfa);
    }

    if (facturx.pdfUA !== undefined) {
        data.append('pdfua', String(facturx.pdfUA));
    }
}
