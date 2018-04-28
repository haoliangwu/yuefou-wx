<style lang="scss">
.content,
.title {
  background: #fff;
  padding: 0.5em 0.75em;
  margin: 0.5em 0;
}
.title {
  height: 2em;
  span.minor-text {
    font-size: 14px;
  }
}
.content {
  .content-item {
    margin: 0.5em 0;
    header {
      font-size: 14px;
      margin: 0 0 0.25em 0;
    }
    section {
      font-size: 12px;
    }
  }
}
</style>
<template>
  <page >
    <view slot="body" class="body-wrapper">
      <view class="title fx row sc">
        <span class="major-text">
          {{activity.title}}
        </span>
        <span class="minor-text" style="padding: 0 0 0 .5em;">
          {{type[activity.type]}}
        </span>
        <span class="placeholder"></span>
        <span @tap="delete({{activity}})" wx:if="{{activity.creator.id === user.id}}" class="mi mi-delete-forever warn"></span>
        <span @tap="share({{activity}})" class="mi mi-share"></span>
      </view>
      <view class="content fx col">
        <view class="content-item fx col">
          <header class="minor-text">创建者</header>
          <section class="major-text">
            {{activity.creator.name}}
          </section>
        </view>
        <view class="content-item fx col">
          <header class="minor-text">时间安排</header>
          <section class="major-text">
            <span>{{activity.startedAt}}</span>
            <span class="minor-text" style="margin: 0 .25em;">至</span>
            <span>{{activity.endedAt}}</span>
          </section>
        </view>
        <view class="content-item fx col">
          <header class="minor-text">活动描述</header>
          <section class="major-text">
            {{activity.desc || '这个家伙很懒，什么都没有留下'}}
          </section>
        </view>
        <view class="content-item fx col">
          <header class="minor-text">活动地点</header>
          <section class="major-text">
            {{activity.location}}
          </section>
        </view>
        <view class="content-item fx col">
          <header class="minor-text">参与人</header>
          <section class="fx col" wx:if="{{activity.participants.length > 0}}">
            <repeat for="{{activity.participants}}" index="index" item="user">
              <span style="marign: 0 .25em;">{{user.name}}</span>
            </repeat>
          </section>
          <section class="major-text" wx:else>
            <span>无</span>
          </section>
        </view>
        <view class="content-item fx col" wx:if="{{activity.type === 'HOST'}}">
          <header class="minor-text">
            <span class="placeholder">菜单</span>
            <span>绑定菜单</span>
            <span class="mi mi-keyboard-arrow-right"></span>
          </header>
          <section wx:if="{{activity.recipes.length > 0}}" class="fx col">
            <repeat for="{{activity.recipes}}" index="index" item="recipe">
              <span>{{recipe.name}}</span>
            </repeat>
          </section>
          <section class="major-text" wx:else>
            <span>无</span>
          </section>
        </view>
        <view class="content-item fx col" wx:if="{{activity.type === 'TASK'}}">
          <header class="minor-text fx row sc">
            <span class="placeholder">任务</span>
            <span @tap="createTask">创建任务</span>
            <span class="mi mi-keyboard-arrow-right"></span>
          </header>
          <section wx:if="{{activity.tasks.length > 0}}" class="fx col">
            <repeat for="{{activity.tasks}}" index="index" item="task">
              <span>{{task.name}}</span>
            </repeat>
          </section>
          <section class="major-text" wx:else>
            <span>无</span>
          </section>
        </view>
      </view>
    </view>
  </page>
</template>

<script src="./list.js">
import wepy from 'wepy';
// import qcloud from '../tools/wafer2-client-sdk';

import Page from '../../components/layout/page';

import { activity, deleteActivity } from '../../services/activity';
import { retrieveUserToken } from '../../services/storage';
import { formatUTCDateStr } from '../../services/utils';

export default class ActivityDetail extends wepy.page {
  config = {
    navigationBarTitleText: '活动详情',
    enablePullDownRefresh: true
  };
  components = {
    page: Page
  };

  data = {
    user: null,
    activity: null,
    type: {
      HOST: '招待模式',
      TASK: '任务模式',
      POTLUCK: '百家宴模式'
    },
    isCreator: true
  };

  computed = {};

  methods = {
    share(activity) {
      wx.setClipboardData({
        data: activity.id
      });
    },
    delete(activity) {
      wx.showModal({
        title: '确认要删除该活动吗？',
        content: '删除后无法恢复',
        success: async res => {
          if (res.cancel) return;

          await deleteActivity(activity.id);

          wx.showToast({
            title: '操作成功',
            success() {
              setTimeout(() => wx.navigateBack(), 1000);
            }
          });
        }
      });
    },
    createTask() {
      wx.navigateTo({
        url: `/pages/task/create?activityId=${this.activity.id}`
      });
    }
  };

  events = {};

  async onLoad(option) {
    const { data } = await retrieveUserToken();

    this.user = data.user;

    const { id } = option;

    await this.fetchActivity(id);

    this.$apply();
  }

  async onShow() {
    if (!this.activity) return;

    await this.fetchActivity(this.activity.id);

    this.$apply();
  }

  async onPullDownRefresh() {
    await this.fetchActivity(this.activity.id);

    wx.stopPullDownRefresh();

    this.$apply();
  }

  onShareAppMessage() {
    const title = `${this.user.nickName}邀请你参加活动【${
      this.activity.title
    }】`;
    const path = `/pages/activity/attend?id=${this.activity.id}`;

    return {
      title,
      path,
      success() {
        wx.showToast({
          title: '邀请成功'
        });
      }
    };
  }

  async fetchActivity(id) {
    this.activity = await activity(id);

    // format time range
    this.activity.startedAt = formatUTCDateStr(this.activity.startedAt);
    this.activity.endedAt = formatUTCDateStr(this.activity.endedAt);
  }
}
</script>
