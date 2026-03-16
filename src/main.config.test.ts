import { Chromiumly } from './main.config';

type ChromiumlyWithPrivate = {
    gotenbergEndpoint: string | undefined;
    gotenbergApiKey: string | undefined;
};

describe('Chromiumly', () => {
    const originalEndpoint = (Chromiumly as unknown as ChromiumlyWithPrivate)
        .gotenbergEndpoint;
    const originalApiKey = (Chromiumly as unknown as ChromiumlyWithPrivate)
        .gotenbergApiKey;

    afterEach(() => {
        (Chromiumly as unknown as ChromiumlyWithPrivate).gotenbergEndpoint =
            originalEndpoint;
        (Chromiumly as unknown as ChromiumlyWithPrivate).gotenbergApiKey =
            originalApiKey;
    });

    describe('getGotenbergEndpoint', () => {
        it('should return the endpoint when it is set', () => {
            Chromiumly.configure({ endpoint: 'http://localhost:3000' });
            expect(Chromiumly.getGotenbergEndpoint()).toBe(
                'http://localhost:3000'
            );
        });

        it('should throw an error when endpoint is not set', () => {
            (Chromiumly as unknown as ChromiumlyWithPrivate).gotenbergEndpoint =
                undefined;
            (Chromiumly as unknown as ChromiumlyWithPrivate).gotenbergApiKey =
                undefined;

            expect(() => {
                Chromiumly.getGotenbergEndpoint();
            }).toThrow(
                'Gotenberg endpoint is not set. Please ensure that the Gotenberg service endpoint is configured correctly in your environment variables or through the configure method.'
            );
        });

        it('should use the hosted API endpoint when only apiKey is configured programmatically', () => {
            (Chromiumly as unknown as ChromiumlyWithPrivate).gotenbergEndpoint =
                undefined;

            Chromiumly.configure({
                apiKey: 'my-secret-key'
            });

            expect(Chromiumly.getGotenbergEndpoint()).toBe(
                'https://api.chromiumly.dev'
            );
        });

        it('should use the hosted API endpoint when apiKey is set and endpoint is not set', () => {
            (Chromiumly as unknown as ChromiumlyWithPrivate).gotenbergEndpoint =
                undefined;
            (Chromiumly as unknown as ChromiumlyWithPrivate).gotenbergApiKey =
                'my-secret-key';

            expect(Chromiumly.getGotenbergEndpoint()).toBe(
                'https://api.chromiumly.dev'
            );
        });
    });

    describe('apiKey', () => {
        it('should set and return apiKey via configure', () => {
            Chromiumly.configure({
                endpoint: 'http://localhost:3000',
                apiKey: 'my-secret-key'
            });
            expect(Chromiumly.getGotenbergApiKey()).toBe('my-secret-key');
        });
    });
});
