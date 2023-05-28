import 'server-only';
import { toASCII } from 'punycode';
import { CFAccountId, CFApiToken, CFSiteTags, FreeDomains } from './config';
import { cache } from 'react';
import kv from './kv';

type queryResult = {
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

// check if the request host is in the domain list
const regexp = new RegExp(`\\.(${FreeDomains.map((d) => toASCII(d).replace('.', '\\.')).join('|')})$`);

export const getSites = cache(async () => {
  // @ts-ignore
  let json: [string, number][] = await kv.get('$$sites', 'json');
  if (json) {
    return json;
  }
  const variables = {
    accountTag: CFAccountId,
    filter: {
      AND: [
        {
          datetime_geq: new Date(new Date().getTime() - 1000 * 86400).toISOString(),
          datetime_leq: new Date().toISOString()
        },
        {
          siteTag_in: CFSiteTags
        }
      ]
    }
  };

  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    body: JSON.stringify({ query, variables }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CFApiToken}`
    }
  });
  const { data }: { data: queryResult } = await res.json();
  const sites: { [key: string]: number } = {};
  for (let i = 0; i < data.viewer.accounts[0].series.length; i += 1) {
    const item = data.viewer.accounts[0].series[i];
    const reqHost = item.dimensions.metric;
    if (regexp.test(reqHost) && !reqHost.startsWith('www.')) {
      sites[reqHost] = (sites[reqHost] || 1) + item.sum.visits;
    }
  }
  json = Object.entries(sites).sort((a, b) => (a[1] - b[1] > 0 ? -1 : 1));
  await kv.put('$$sites', json, {
    expirationTtl: 86400
  });
  return json;
});
