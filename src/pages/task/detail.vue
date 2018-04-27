<style lang="scss">

</style>
<template>
  <page :isLoading.sync="isLoading">
    <view slot="body">
      task detail {{task.id}} works
    </view>
  </page>
</template>

<script src="./list.js">
import wepy from 'wepy';
// import qcloud from '../tools/wafer2-client-sdk';

import Page from '../../components/layout/page';

export default class TaskDetail extends wepy.page {
  config = {
    navigationBarTitleText: '任务详情'
  };
  components = {
    page: Page
  };

  data = {
    task: {}
  };

  computed = {};

  methods = {};

  events = {};

  async onLoad(option) {
    const { id } = option;

    // TODO 获取真实的 task 实例
    setTimeout(() => {
      this.task.id = id;
      this.$apply();
    }, 1000);
  }
}
</script>
