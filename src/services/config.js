import wepy from 'wepy';
import { safePluckQueryResult } from './utils';

// fragment
export const CosConfigFragment = `fragment CosConfigFragment on CosConfig {
  bucket
  region
  appId
}`;

export function appConfig() {
  const query = `query appConfigQuery {
    config {
      cos {
        ...CosConfigFragment
      }
    }
  } ${CosConfigFragment}`;

  const variables = {}

  return wepy.request({
    data: {
      query,
      variables
    },
    type: 'query',
    noAuth: true
  }).then(safePluckQueryResult('config'))
}

export function cosConfig() {
  return appConfig().then(config => config.cos)
}
