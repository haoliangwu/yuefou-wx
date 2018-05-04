import { getAccessToken } from './template_msg';
import { checkTokenExpired } from './utils';

const APP_PREFIX = 'yuefou'
const USER_TOKEN_KEY = 'user-token'
const TEMPLATE_MSG_TOKEN_KEY = 'template-msg-token'

const prefix = key => `${APP_PREFIX}:${key}`

// user info
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

// template message info
export async function storageTemplateMsgToken(token) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: prefix(TEMPLATE_MSG_TOKEN_KEY),
      data: token,
      success: resolve,
      fail: reject
    })
  })
}

export async function retrieveTemplateMsgToken() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: prefix(TEMPLATE_MSG_TOKEN_KEY),
      success: resolve,
      fail: () => resolve({})
    })
  })
}

export async function retrieveValidTemplateMsgToken() {
  const curToken = await retrieveTemplateMsgToken()

  if (checkTokenExpired(curToken)) {
    return getAccessToken()
  } else {
    return curToken
  }
}
