<style lang="scss">
.input-wrapper {
  margin: 0.5em 0;
  height: 2em;
  padding: 0.5em 0.75em;
  background: #fff;
  input {
    flex: 1;
    margin: 0;
    padding: 0;
  }
}
</style>

<template>
  <page :isLoading.sync="isLoading">
    <view slot="body" class="body-wrapper">
      <view class="input-wrapper fx row sc">
        <input type="text" placeholder="输入活动邀请码..." confirm-type="搜索" @confirm="search"/>
        <span class="mi mi-search primary"></span>
      </view>
      <view class="search-result" wx-if="{{searchResult}}">
        <activitycard :hint.sync="hint" @tapReqest.user="attend" :activity.sync="searchResult"></activitycard>
      </view>
    </view>
  </page>
</template>

<script>
import wepy from 'wepy';

import Page from '../../components/layout/page';
import ActivityCard from '../../components/activity/activity-card';

import { activity, attend } from '../../services/activity';

export default class ActivityAttendPage extends wepy.page {
  config = {
    navigationBarTitleText: '参加活动'
  };
  components = {
    page: Page,
    activitycard: ActivityCard
  };

  data = {
    withCreateAffix: true,
    searchResult: null,
    hint: '参加活动'
  };

  computed = {};

  methods = {
    search(event) {
      this.searchResult = null;
      this.searchAttendActivity(event.detail.value);
    },

    attend(activity) {
      this.attendActivity(activity);
    }
  };

  events = {};

  async onLoad(options) {
    const { id } = options;

    if (id) {
      const result = await activity(id);

      this.attendActivity(result);
    }
  }

  async searchAttendActivity(keyword) {
    if (!keyword) return;

    const result = await activity(keyword);

    if (result) {
      this.searchResult = result;
    }
  }

  async attendActivity(activity) {
    const { id, title } = activity;

    wx.showModal({
      title: '确认参加活动吗？',
      content: title,
      success: async res => {
        if (res.cancel) return;

        const attendActivity = await attend(id);

        if (!attendActivity) return;

        wx.showModal({
          title: '参加成功',
          content: '是否返回【活动列表】查看',
          success: ({ cancel }) => {
            if (cancel) return;

            wx.switchTab({
              url: '/pages/activity/list'
            });
          }
        });
      }
    });
  }
}
</script>
