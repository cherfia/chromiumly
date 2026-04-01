import { GotenbergUtils } from '../common';
import { Chromiumly } from '../main.config';

export class System {
    public static async getHealth(): Promise<Buffer> {
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.SYSTEM_ROUTES.health}`;
        return GotenbergUtils.fetchWithoutBody(
            endpoint,
            'GET',
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey()
        );
    }

    public static async headHealth(): Promise<Buffer> {
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.SYSTEM_ROUTES.health}`;
        return GotenbergUtils.fetchWithoutBody(
            endpoint,
            'HEAD',
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey()
        );
    }

    public static async getPrometheusMetrics(): Promise<Buffer> {
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.SYSTEM_ROUTES.prometheusMetrics}`;
        return GotenbergUtils.fetchWithoutBody(
            endpoint,
            'GET',
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey()
        );
    }

    public static async getVersion(): Promise<Buffer> {
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.SYSTEM_ROUTES.version}`;
        return GotenbergUtils.fetchWithoutBody(
            endpoint,
            'GET',
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey()
        );
    }

    public static async getDebug(): Promise<Buffer> {
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.SYSTEM_ROUTES.debug}`;
        return GotenbergUtils.fetchWithoutBody(
            endpoint,
            'GET',
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey()
        );
    }
}
