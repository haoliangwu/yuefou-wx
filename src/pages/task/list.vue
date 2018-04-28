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
  <page >
    <view slot="body" class="body-wrapper">
      <view class="tasks-wrapper">
        <repeat for="{{tasks}}" index="index" item="task">
          <taskcard @tapReqest.user="detail" @reload.user="reload" :task="task" ></taskcard>
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

import { tasks } from '../../services/task';
// import { formatUTCDateStr } from '../../services/utils';

export default class TaskList extends wepy.page {
  config = {
    navigationBarTitleText: '任务'
  };
  components = {
    page: Page,
    taskcard: TaskCard
  };

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

    reload: async () => {
      await this.fetchTasks();
      this.$apply();
    }
  };

  events = {};

  async onLoad() {}

  async onShow() {
    await this.fetchTasks();
    this.$apply();
  }

  async onPullDownRefresh() {
    await this.fetchTasks();
    wx.stopPullDownRefresh();
    this.$apply();
  }

  async fetchTasks() {
    this.tasks = await tasks();

    // this.tasks = this.tasks.map(task => {
    //   task.createdAt = formatUTCDateStr(task.createdAt)
    //   return task
    // })
  }
}
</script>
