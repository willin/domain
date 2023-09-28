import { toASCII } from '~/helpers/punycode';

export type CloudflareGraphQLQueryResult = {
  viewer: {
    accounts: {
      series: {
        sum: {
          visits: number;
        };
        dimensions: {
          metric: string;
        };
      }[];
    }[];
  };
};

// Docs ref: https://developers.cloudflare.com/analytics/graphql-api/
const query = `query ($accountTag: string, $filter: AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject) {
  viewer {
    accounts(filter: {accountTag: $accountTag}) {
      series: rumPageloadEventsAdaptiveGroups(limit: 5000, filter: $filter) {
        sum {
          visits
        }
        dimensions {
          metric: requestHost
        }
      }
    }
  }
}`;

export interface ICloudflareAnalyticsProvider {
  getTopSites(): Prmose<[string, number][]>;
}

export class CloudflareAnalyticsProvider
  implements ICloudflareAnalyticsProvider
{
  #ApiToken: string;
  #SiteTags: string[];
  #AccountId: string;
  #regexp: RegExp;

  constructor(env: RemixServer.Env) {
    this.#ApiToken = env.CF_API_TOKEN;
    this.#SiteTags = env.CF_SITE_TAGS;
    this.#AccountId = env.CF_ACCOUNT_ID;

    // check if the request host is in the domain list
    this.#regexp = new RegExp(
      `\\.(${env.FREE_DOMAINS.map(([d]) => toASCII(d).replace('.', '\\.')).join(
        '|'
      )})$`
    );
  }

  public async getTopSites() {
    const variables = {
      accountTag: this.#AccountId,
      filter: {
        AND: [
          {
            datetime_geq: new Date(
              new Date().getTime() - 1000 * 86400
            ).toISOString(),
            datetime_leq: new Date().toISOString()
          },
          {
            siteTag_in: this.#SiteTags
          }
        ]
      }
    };

    const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      body: JSON.stringify({ query, variables }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.#ApiToken}`
      }
    });
    const { data }: { data: queryResult } = await res.json();
    const sites: { [key: string]: number } = {};
    for (let i = 0; i < data.viewer.accounts[0].series.length; i += 1) {
      const item = data.viewer.accounts[0].series[i];
      const reqHost = item.dimensions.metric;
      if (this.#regexp.test(reqHost) && !reqHost.startsWith('www.')) {
        sites[reqHost] = (sites[reqHost] || 1) + item.sum.visits;
      }
    }
    const json = Object.entries(sites).sort((a, b) =>
      a[1] - b[1] > 0 ? -1 : 1
    );
    return json;
  }
}
