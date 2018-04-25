<style lang="scss">
.list-wrapper {
  display: flex;
  flex-direction: column;
  width: 100vw;

  taskcard {
    flex: 1;
    width: 100%;
  }
}
</style>
<template>
  <page :isLoading.sync="isLoading">
    <view slot="body" class="body-wrapper">
      <view class="tasks-wrapper">
        <repeat for="{{tasks}}" index="index" item="task">
          <taskcard @toggleLoading.user="toggleLoading" @tapReqest.user="detail" @reload.user="reload" :task="task" ></taskcard>
        </repeat>
      </view>
    </view>
  </page>
</template>

<script>
import wepy from 'wepy';
// import qcloud from '../tools/wafer2-client-sdk';

import Page from '../../components/layout/page';
import TaskCard from '../../components/task/task-card';
import LoadingMixin from '../../mixins/loading';

import { tasks } from '../../services/task';

export default class TaskList extends wepy.page {
  config = {
    navigationBarTitleText: '任务'
  };
  components = {
    page: Page,
    taskcard: TaskCard
  };

  mixins = [LoadingMixin];

  data = {
    tasks: []
  };

  computed = {};

  methods = {
    detail(id) {
      wx.navigateTo({
        url: `/pages/task/detail?id=${id}`
      });
    },

    toggleLoading(status) {
      this.toggleLoading(status);
    },

    reload: async () => {
      this.fetch();
    }
  };

  events = {};

  async onLoad() {}

  async onShow() {
    this.fetchTasks();
  }

  async onPullDownRefresh() {
    this.fetchTasks();
    wx.stopPullDownRefresh()
  }

  async fetchTasks() {
    this.toggleLoading(true);
    this.tasks = await tasks();
    this.toggleLoading(false);
  }
}
</script>
