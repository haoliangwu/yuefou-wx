const APP_PREFIX = 'yuefou'
const USER_TOKEN_KEY = 'user-token'

const prefix = key => `${APP_PREFIX}:${key}`

export async function storageUserToken(token) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: prefix(USER_TOKEN_KEY),
      data: token,
      success: resolve,
      fail: reject
    })
  })
}

export async function retrieveUserToken() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: prefix(USER_TOKEN_KEY),
      success: resolve,
      fail: () => resolve({})
    })
  })
}

export function retrieveUserTokenSync() {
  return wx.getStorageSync(prefix(USER_TOKEN_KEY))
}
