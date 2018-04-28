<style lang="scss">
.login-panel {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 200px;
  width: 200px;
  text-align: center;

  image {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 1px solid #ccc;
    margin: 0 0 2em 0;
  }

  button {
    margin: 0.25em 0;
  }
}

.app-logo {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
  color: #9c27b0;
  font-size: 32px;
  font-weight: 200;
  text-align: center;
}
</style>
<template>
  <page >
    <view slot="body">
      <view class="app-logo">
        <text class="info">{{logoText}}</text>
      </view>

      <view class="login-panel">
        <image src="{{avatarUrl}}"></image>
        <button type="primary" @tap="login">使用微信登录</button>
      </view>
    </view>
  </page>
</template>

<script>
import wepy from 'wepy';

import Page from '../components/layout/page';

import LoginMixin from '../mixins/login';

import { retrieveUserToken } from '../services/storage';

export default class Index extends wepy.page {
  config = {
    navigationBarTitleText: '登录'
  };
  components = {
    page: Page
  };

  data = {
    logoText: 'YueFou',
    isSignup: false,
    avatarUrl: ''
  };

  mixins = [LoginMixin];

  computed = {};

  methods = {
    login() {
      this.safeLogin(() => {
        this.redirect();
      });
    }
  };

  events = {};

  async onLoad() {
    const { data } = await retrieveUserToken();

    if (data && data.token) {
      return this.redirect();
    } else {
      this.$parent.getUserInfo(userInfo => {
        this.avatarUrl = userInfo.avatarUrl;
        this.$apply();
      });
    }
  }

  async onReady() {}

  redirect() {
    wx.switchTab({
      url: '/pages/activity/list'
    });
    // wx.redirectTo({
    //   url: '/pages/task/create'
    // })
  }
}
</script>
