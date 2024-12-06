import { constants, createReadStream, ReadStream, promises } from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { PathLikeOrReadStream } from './types';

/**
 * Utility class for common tasks related to the Gotenberg service.
 */
export class GotenbergUtils {
    /**
     * Asserts that a condition is true; otherwise, throws an error with the specified message.
     *
     * @param {boolean} condition - The condition to assert.
     * @param {string} message - The error message to throw if the condition is false.
     * @throws {Error} Throws an error with the specified message if the condition is false.
     */
    public static assert(
        condition: boolean,
        message: string
    ): asserts condition {
        if (!condition) {
            throw new Error(message);
        }
    }

    /**
     * Performs a POST request to the specified Gotenberg endpoint with the provided FormData.
     *
     * @param {string} endpoint - The Gotenberg endpoint URL.
     * @param {string} username - The username for basic authentication.
     * @param {string} password - The password for basic authentication.
     * @param {FormData} data - The FormData object to be sent in the POST request.
     * @param {Record<string, string>} customHeaders - List of custom headers to include in the fetch
     * @returns {Promise<Buffer>} A Promise that resolves to the response body as a Buffer.
     * @throws {Error} Throws an error if the HTTP response status is not OK.
     */
    public static async fetch(
        endpoint: string,
        data: FormData,
        username?: string,
        password?: string,
        customHeaders: Record<string, string> = {}
    ): Promise<Buffer> {
        const headers: Record<string, string> = {
            ...data.getHeaders(),
            ...customHeaders
        };

        if (username && password) {
            const authHeader =
                'Basic ' +
                Buffer.from(username + ':' + password).toString('base64');
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(endpoint, {
            method: 'post',
            body: data,
            headers
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        return response.buffer();
    }

    /**
     * Adds a file to the FormData object.
     *
     * @param {FormData} data - The FormData object to which the file will be added.
     * @param {PathLikeOrReadStream} file - The file to be added (either a PathLike or a ReadStream).
     * @param {string} name - The name to be used for the file in the FormData.
     * @returns {Promise<void>} A Promise that resolves once the file has been added.
     */
    public static async addFile(
        data: FormData,
        file: PathLikeOrReadStream,
        name: string
    ) {
        if (Buffer.isBuffer(file)) {
            data.append('files', file, name);
        } else if (file instanceof ReadStream) {
            data.append('files', file, name);
        } else {
            await promises.access(file, constants.R_OK);
            data.append('files', createReadStream(file), name);
        }
    }
}
