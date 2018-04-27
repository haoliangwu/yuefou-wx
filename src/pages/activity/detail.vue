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
  <page :isLoading.sync="isLoading">
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
          <header class="minor-text">菜单</header>
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
          <header class="minor-text">任务</header>
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
import LoadingMixin from '../../mixins/loading';

import { activity, deleteActivity } from '../../services/activity';
import { retrieveUserToken } from '../../services/storage';

export default class ActivityDetail extends wepy.page {
  config = {
    navigationBarTitleText: '活动详情'
  };
  components = {
    page: Page
  };

  mixins = [LoadingMixin];

  data = {
    user: null,
    activity: {},
    type: {
      HOST: '招待模式',
      TASK: '任务模式',
      POTLUCK: '百家宴模式'
    },
    isCreator: true
  };

  computed = {};

  methods = {
    delete(activity) {
      wx.showModal({
        title: '确认要删除该活动吗？',
        content: '删除后无法恢复',
        success: async res => {
          if (res.cancel) return;

          this.toggleLoading(true);
          await deleteActivity(activity.id);
          this.toggleLoading(false);

          wx.showToast({
            title: '操作成功',
            success() {
              setTimeout(() => wx.navigateBack(), 1000);
            }
          });
        }
      });
    }
  };

  events = {};

  async onLoad(option) {
    const { data } = await retrieveUserToken();

    this.user = data.user;

    const { id } = option;

    this.toggleLoading(true);

    this.activity = await activity(id);

    // format time range
    this.activity.startedAt = new Date(
      this.activity.startedAt
    ).toLocaleDateString();
    this.activity.endedAt = new Date(
      this.activity.endedAt
    ).toLocaleDateString();

    this.toggleLoading(false);
  }
}
</script>