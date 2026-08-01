import { GotenbergUtils } from '../common';
import { Chromiumly } from '../main.config';

export class System {
    /**
     * @param {string} [trace] - Custom request id to identify the request in the logs.
     */
    public static async getHealth(trace?: string): Promise<Buffer> {
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.SYSTEM_ROUTES.health}`;
        return GotenbergUtils.fetchWithoutBody(
            endpoint,
            'GET',
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildOutputHeaders({ trace })
        );
    }

    /**
     * @param {string} [trace] - Custom request id to identify the request in the logs.
     */
    public static async headHealth(trace?: string): Promise<Buffer> {
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.SYSTEM_ROUTES.health}`;
        return GotenbergUtils.fetchWithoutBody(
            endpoint,
            'HEAD',
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildOutputHeaders({ trace })
        );
    }

    /**
     * @param {string} [trace] - Custom request id to identify the request in the logs.
     */
    public static async getPrometheusMetrics(trace?: string): Promise<Buffer> {
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.SYSTEM_ROUTES.prometheusMetrics}`;
        return GotenbergUtils.fetchWithoutBody(
            endpoint,
            'GET',
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildOutputHeaders({ trace })
        );
    }

    /**
     * @param {string} [trace] - Custom request id to identify the request in the logs.
     */
    public static async getVersion(trace?: string): Promise<Buffer> {
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.SYSTEM_ROUTES.version}`;
        return GotenbergUtils.fetchWithoutBody(
            endpoint,
            'GET',
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildOutputHeaders({ trace })
        );
    }

    /**
     * @param {string} [trace] - Custom request id to identify the request in the logs.
     */
    public static async getDebug(trace?: string): Promise<Buffer> {
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.SYSTEM_ROUTES.debug}`;
        return GotenbergUtils.fetchWithoutBody(
            endpoint,
            'GET',
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildOutputHeaders({ trace })
        );
    }
}
