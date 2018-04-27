import wepy from 'wepy';
import qcloud from './tools/wafer2-client-sdk';

import 'wepy-async-function';
import 'promise-polyfill';

import { retrieveUserTokenSync } from './services/storage';
import { APP_HOST, BACKEND_ERRORS_MAP } from './config';

import { cosConfig } from './services/config';

export default class extends wepy.app {
  appId = 'wx2cda92ee3465bd45'

  config = {
    pages: [
      // 首页
      'pages/index',
      // 活动
      'pages/activity/list',
      'pages/activity/create',
      'pages/activity/detail',
      'pages/activity/attend',
      // 任务
      'pages/task/list',
      'pages/task/detail',
      // 菜单
      'pages/recipe/list',
      'pages/recipe/create',
      'pages/recipe/detail',
      // 我的
      'pages/profile/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true
    },
    tabBar: {
      position: 'bottom',
      color: '#BDBDBD',
      selectedColor: '#424242',
      backgroundColor: '#EEEEEE',
      list: [
        {
          pagePath: 'pages/activity/list',
          text: '活动',
          iconPath: 'images/ic_schedule_black_36dp_2x.png',
          selectedIconPath: 'images/ic_schedule_black_36dp_2x.png'
        },
        {
          pagePath: 'pages/task/list',
          text: '任务',
          iconPath: 'images/ic_event_note_black_36dp_2x.png',
          selectedIconPath: 'images/ic_event_note_black_36dp_2x.png'
        },
        {
          pagePath: 'pages/recipe/list',
          text: '菜单',
          iconPath: 'images/ic_restaurant_menu_black_36dp_2x.png',
          selectedIconPath: 'images/ic_restaurant_menu_black_36dp_2x.png'
        },
        {
          pagePath: 'pages/profile/index',
          text: '我的',
          iconPath: 'images/ic_face_black_36dp_2x.png',
          selectedIconPath: 'images/ic_face_black_36dp_2x.png'
        }
      ]
    }
  };

  service = {
    // 登录地址，用于建立会话
    loginUrl: `${APP_HOST}/wx/weapp/login`,
    // 测试的请求地址，用于测试会话
    requestUrl: `${APP_HOST}/wx/weapp/user`,
    // 测试的信道服务地址
    tunnelUrl: `${APP_HOST}/wx/weapp/tunnel`,
    // 上传图片接口
    uploadUrl: `${APP_HOST}/wx/weapp/upload`,
    // graphQL endpoint
    graphql: `${APP_HOST}/wx/graphql`
  }

  globalData = {
    userInfo: null,
    cos: {}
  };

  constructor() {
    super();
    this.use('requestfix');
    this.use('promisify');

    this.intercept('request', {
      // 发出请求时的回调函数
      config(p) {
        const { type } = p

        switch (type) {
          case 'query':
            p.url = `${this.service.graphql}/query`
            break
          case 'mutation':
            p.url = `${this.service.graphql}/mutation`
            break
          default:
            break
        }

        const { token } = retrieveUserTokenSync()

        if (!p.noAuth) {
          p.header = {
            'Authorization': `Bearer ${token}`
          }
        }
        p.method = 'POST'

        console.group(p.data)

        wx.showLoading({
          title: '加载中...',
          mask: true
        })

        return p;
      },

      // 请求成功后的回调函数
      success(p) {
        // 可以在这里对收到的响应数据对象进行加工处理
        console.log('request success: ', p);

        if (p.data.errors) {
          const error = p.data.errors[0] || {}
          const message = BACKEND_ERRORS_MAP[(error.message || 'unknown-error')]

          wx.showToast({
            title: message,
            icon: 'none',
            image: '/images/ic_error_outline_white_36dp_2x.png'
          })
        }
        // 必须返回响应数据对象，否则后续无法对响应数据进行处理
        return p;
      },

      // 请求失败后的回调函数
      fail(p) {
        console.log('request fail: ', p);
        // 必须返回响应数据对象，否则后续无法对响应数据进行处理
        return p;
      },

      // 请求完成时的回调函数(请求成功或失败都会被执行)
      complete(p) {
        wx.hideLoading()
        console.groupEnd()
      }
    });
  }

  async onLaunch() {
    qcloud.setLoginUrl(this.service.loginUrl)

    const config = await cosConfig()

    this.globalData.cos = {
      ...config
    }
  }

  async onShow() {

  }

  async onHide() {

  }

  async getUserInfo(cb) {
    if (this.globalData.userInfo) {
      cb && cb(this.globalData.userInfo)

      return this.globalData.userInfo;
    }

    const res = await wepy.getUserInfo()

    this.globalData.userInfo = res.userInfo;

    cb && cb(res.userInfo)
  }

  prefixRecipeResource(url) {
    return `//${this.globalData.cos.bucket}.cos.${this.globalData.cos.region}.myqcloud.com/shared/recipes/${url}`
  }
}
