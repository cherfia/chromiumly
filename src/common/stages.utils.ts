import path from 'path';
import { fileURLToPath } from 'url';

import { GotenbergUtils } from './gotenberg.utils';
import { Stage, StageFile } from './stages.types';
import { PathLikeOrReadStream } from './types';

/** The options of each stage that name an uploaded file. */
const STAGE_FILE_OPTIONS: Partial<Record<Stage['op'], string[]>> = {
    insert: ['source'],
    'stamp-image': ['image'],
    'stamp-pdf': ['source'],
    attach: ['file'],
    remediate: ['xml'],
    sign: ['certificate', 'key']
};

type StageUploads = Map<string, PathLikeOrReadStream>;

/**
 * Utility class for serializing stages, uploading the files they name.
 */
export class StageUtils {
    /**
     * Resolves a stage file to the name Gotenberg knows it by, registering it for upload when needed.
     */
    private static resolveFile(file: StageFile, uploads: StageUploads): string {
        if (typeof file === 'string') {
            const name = path.basename(file);
            uploads.set(name, file);
            return name;
        }

        if (file instanceof URL) {
            const name = path.basename(fileURLToPath(file));
            uploads.set(name, file);
            return name;
        }

        if ('file' in file) {
            uploads.set(file.name, file.file);
        }

        return file.name;
    }

    /**
     * Replaces the files a stage names with their upload names.
     */
    private static resolveStage(
        stage: Stage,
        uploads: StageUploads
    ): Record<string, unknown> {
        const resolved: Record<string, unknown> = { ...stage };

        for (const key of STAGE_FILE_OPTIONS[stage.op] ?? []) {
            if (resolved[key] !== undefined) {
                resolved[key] = this.resolveFile(
                    resolved[key] as StageFile,
                    uploads
                );
            }
        }

        if (stage.op === 'compose') {
            resolved.placements = stage.placements.map((placement) =>
                placement.source === undefined
                    ? placement
                    : {
                          ...placement,
                          source: this.resolveFile(placement.source, uploads)
                      }
            );
        }

        return resolved;
    }

    private static async addUploads(
        data: FormData,
        uploads: StageUploads
    ): Promise<void> {
        await Promise.all(
            [...uploads].map(([name, file]) =>
                GotenbergUtils.addFile(data, file, name)
            )
        );
    }

    /**
     * Appends the `stages` field, and the files the stages name, to the FormData.
     *
     * @param {FormData} data - The FormData object to append to.
     * @param {Stage[]} [stages] - The stages to run, in order.
     * @returns {Promise<void>} A Promise that resolves once the stages and their files are appended.
     */
    public static async appendStages(
        data: FormData,
        stages?: Stage[]
    ): Promise<void> {
        if (!stages?.length) {
            return;
        }

        const uploads: StageUploads = new Map();
        const resolved = stages.map((stage) =>
            this.resolveStage(stage, uploads)
        );

        data.append('stages', JSON.stringify(resolved));
        await this.addUploads(data, uploads);
    }

    /**
     * Appends a stage's options as form fields, as its own `/forms/pdf/<op>` route takes them:
     * lists and objects as JSON, files by their upload names.
     *
     * @param {FormData} data - The FormData object to append to.
     * @param {Stage} stage - The stage whose options to append.
     * @returns {Promise<void>} A Promise that resolves once the fields and their files are appended.
     */
    public static async appendStageFields(
        data: FormData,
        stage: Stage
    ): Promise<void> {
        const uploads: StageUploads = new Map();
        const { op: _op, ...options } = this.resolveStage(stage, uploads);

        for (const [key, value] of Object.entries(options)) {
            if (value === undefined) {
                continue;
            }

            data.append(
                key,
                typeof value === 'object'
                    ? JSON.stringify(value)
                    : String(value)
            );
        }

        await this.addUploads(data, uploads);
    }
}
