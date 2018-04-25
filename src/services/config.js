import wepy from 'wepy';

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
  }).then(res => res.data.data.config)
}

export function cosConfig() {
  return appConfig().then(config => config.cos)
}
