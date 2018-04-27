import wepy from 'wepy'

import qcloud from '../tools/wafer2-client-sdk';
import { storageUserToken, retrieveUserToken } from '../services/storage';
import { loginOrSignup } from '../services/user';

export default class LoadingMixin extends wepy.mixin {
  login(cb) {
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    qcloud.login({
      success: async result => {
        wx.hideLoading()
        // TODO 调用 graphql-server 注册 或 登录
        const { token, user } = await loginOrSignup(result);

        result.id = user.id;

        await storageUserToken({
          user: result,
          token: token
        });

        cb && cb()
      },
      fail: err => {
        wx.hideLoading()
        if (err) {
          wx.showModal({
            title: '发生错误',
            content: err.message
          });
          console.error(err);
        }
      }
    });
  }

  async safeLogin(cb) {
    const { data } = await retrieveUserToken();

    if (data && data.token) {
      cb && cb(data.token)
    } else {
      this.login(cb)
    }
  }
}
