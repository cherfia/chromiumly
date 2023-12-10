import FormData from "form-data";
import fetch from "node-fetch";

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
    public static assert(condition: boolean, message: string): asserts condition {
        if (!condition) {
            throw new Error(message);
        }
    }

    /**
     * Performs a POST request to the specified Gotenberg endpoint with the provided FormData.
     *
     * @param {string} endpoint - The Gotenberg endpoint URL.
     * @param {FormData} data - The FormData object to be sent in the POST request.
     * @returns {Promise<Buffer>} A Promise that resolves to the response body as a Buffer.
     * @throws {Error} Throws an error if the HTTP response status is not OK.
     */
    public static async fetch(endpoint: string, data: FormData): Promise<Buffer> {
        const response = await fetch(endpoint, {
            method: "post",
            body: data,
            headers: {
                ...data.getHeaders(),
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        return response.buffer();
    }
}