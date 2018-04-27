<style lang="scss">
.activities-wrapper {
  display: flex;
  flex-direction: column;
  width: 100vw;

  activitycard {
    flex: 1;
    width: 100%;
  }
}
</style>
<template>
  <page @affixTapRequest.user="affixTap" :withCreateAffix.sync="withCreateAffix" :isLoading.sync="isLoading">
    <view slot="body" class="body-wrapper">
      <view class="activities-wrapper">
        <repeat for="{{activities}}" index="index" item="activity">
          <activitycard @tapReqest.user="detail" :activity.sync="activity"></activitycard>
        </repeat>
      </view>
    </view>
  </page>
</template>

<script>
import wepy from 'wepy';
// import qcloud from '../tools/wafer2-client-sdk';

import Page from '../../components/layout/page';
import ActivityCard from '../../components/activity/activity-card';

import { activities } from '../../services/activity';

export default class ActivityList extends wepy.page {
  config = {
    navigationBarTitleText: '活动',
    enablePullDownRefresh: true
  };
  components = {
    page: Page,
    activitycard: ActivityCard
  };

  data = {
    activities: [],
    withCreateAffix: true
  };

  computed = {};

  methods = {
    detail(activity) {
      wx.navigateTo({
        url: `/pages/activity/detail?id=${activity.id}`
      });
    },

    affixTap() {
      wx.showActionSheet({
        itemList: ['参加活动', '创建活动'],
        success(res) {
          const { tapIndex } = res;

          switch (tapIndex) {
            case 0:
              wx.navigateTo({
                url: './attend'
              });
              break;
            case 1:
              wx.navigateTo({
                url: './create'
              });
              break;
          }
        }
      });
    }
  };

  events = {};

  async onLoad() {}

  async onShow() {
    this.fetchActivities();
  }

  async onPullDownRefresh() {
    this.fetchActivities();
    wx.stopPullDownRefresh();
  }

  async fetchActivities() {
    this.activities = await activities();
    this.$apply();
  }
}
</script>
