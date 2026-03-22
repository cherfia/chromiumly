import { Chromiumly, TemplatesRoute } from '../../main.config';
import { TemplateRequest, TemplateType } from '../interfaces/templates.types';
import { templateValidators } from '../validators/templates.validators';
import { Generator } from './generator';

export class Templates extends Generator {
    constructor() {
        super(TemplatesRoute.GENERATE);
    }

    public async generate<TType extends TemplateType>(
        request: TemplateRequest<TType>,
        options?: { validate?: boolean }
    ): Promise<Buffer> {
        const apiKey = Chromiumly.getGotenbergApiKey();

        if (!apiKey) {
            throw new Error(
                'Templates requires an API key. Please configure it via Chromiumly.configure({ apiKey: "..." }).'
            );
        }

        if (options?.validate) {
            const validator = templateValidators[request.type] as
                | ((data: unknown) => boolean)
                | undefined;

            if (validator && !validator(request.data)) {
                throw new Error(
                    `Invalid template data for type "${request.type}". Please ensure it matches the expected structure.`
                );
            }
        }

        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'X-Api-Key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            const body = await response.text();
            const trace = response.headers.get('gotenberg-trace');

            throw new Error(
                `Gotenberg API Error:\n` +
                    `Endpoint: ${this.endpoint}\n` +
                    `Status: ${response.status} ${response.statusText}\n` +
                    `Trace: ${trace || 'No trace'}\n` +
                    `Body: ${body}`
            );
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
}
