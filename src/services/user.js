import wepy from 'wepy';
import { safePluckQueryResult } from './utils';

// fragment
export const UserFragment = `fragment UserFragment on User {
  id
  name
  avatar
}`;

export function me() {
  const query = `{me{id}}`
  const variables = {}

  return wepy.request({
    data: {
      query,
      variables
    },
    type: 'query'
  })
}

export function loginOrSignup(wxUser) {
  // TODO 这里暂时使用假的 email 和 passwrod 的方式来进行测试
  // 之后需要迁移为使用 wx 用户提供的 openId 进行登录的方式
  const mutation = `mutation wxLogin($user: WxUserBindInput!) {
    wxLogin(user: $user) {
      token
      user {
        id
      }
    }
  }`

  const { openId, avatarUrl, nickName } = wxUser

  const variables = {
    user: {
      id: openId,
      name: nickName,
      avatar: avatarUrl
    }
  }

  return wepy.request({
    data: {
      mutation,
      variables
    },
    type: 'mutation',
    noAuth: true
  }).then(result => result.data.data.wxLogin)
}
