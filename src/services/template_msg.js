import wepy from 'wepy';

export function getAccessToken() {
  const url = '/api/auth/template_msg_token'

  return wepy.request({
    url
  }).then(res => res.data)
}
