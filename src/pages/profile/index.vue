<style lang="scss">
.item-wrapper {
  padding: 0.5em 0.75em;
  background: #fff;
  margin: 0.5em 0;

  image {
    &.avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

  span.minor-text {
    font-size: 12px;
  }

  &.logout {
    text-align: center;
  }
}
</style>
<template>
  <page :isLoading.sync="isLoading">
    <view slot="body" class="body-wrapper fx col">
        <view class="item-wrapper fx row sc" @tap="getAddress">
          <image class="avatar" src="{{user.avatarUrl}}"></image>
          <span class="placeholder"></span>
          <span class="minor-text">常用地址</span>
          <span class="mi mi-keyboard-arrow-right"></span>
        </view>
        <view class="placeholder"></view>
        <view class="item-wrapper logout" @tap="logout">
          <span class="warn">退出登录</span>
        </view>
    </view>
  </page>
</template>

<script src="./list.js">
import wepy from 'wepy';
// import qcloud from '../tools/wafer2-client-sdk';

import Page from '../../components/layout/page';
import LoadingMixin from '../../mixins/loading';

import { retrieveUserToken } from '../../services/storage';

export default class Profile extends wepy.page {
  config = {
    navigationBarTitleText: '我的'
  };
  components = {
    page: Page
  };

  mixins = [LoadingMixin];

  data = {
    user: {}
  };

  computed = {};

  methods = {
    getAddress() {
      wx.chooseAddress({
        success: res => {
          const { provinceName, cityName, countyName, detailInfo } = res;
          const addresss = provinceName + cityName + countyName + detailInfo;

          console.log(addresss);
        }
      });
    },

    logout() {
      wx.showModal({
        title: '确认退出当前小程序吗？',
        content: '将清空所有的缓存数据',
        success: res => {
          if (res.cancel) return;

          this.clearStorage();
          wx.navigateTo({
            url: '/pages/index'
          });
        }
      });
    }
  };

  events = {};

  async onLoad() {
    const { data } = await retrieveUserToken();

    if (data.user) {
      this.user = data.user;
    } else {
      this.$parent.getUserInfo(userInfo => {
        this.user = userInfo;
      });
    }
  }

  clearStorage() {
    wx.clearStorage();
  }
}
</script>
