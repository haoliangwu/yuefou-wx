<style lang="scss">
.card-wrapper {
  border-radius: 3px;
  background: #fff;
  margin: 0.25em 0;
}
.card-content {
  padding: 0.5em;
  header {
    flex: 1;
    &.main {
      font-size: 16px;
      align-items: center;

      span.major-text {
        flex: 1;
      }

      span.minor-text {
        font-size: 12px;
      }
    }

    &.sub {
      font-size: 12px;
    }
  }
  section {
    flex: 1;
    font-size: 12px;
    padding: 0.5em 0;
  }
}

.actions-row {
  border-top: 1px solid #ccc;
  margin: 0.5em 0.25em 0;
  padding: 0.25em 0 0 0;
  span {
    flex: 1;
  }

  image {
    margin: 0 2px;
  }
}
.task-actions-wrapper {
  .mi {
    margin: 0 2px;
  }
}
</style>
<template>
<view class="card-wrapper" hover-class="hover">
  <section class="card-content fx col">
    <header class="main fx row">
      <span class="major-text">{{task.name}}</span>
      <span class="minor-text">{{statusMapping[task.status]}}</span>
    </header>
    <header class="sub minor-text" wx:if="{{!isEmber}}">{{task.activity.title}}</header>
    <section class="major-text" wx:if="{{!isEmber}}">{{task.desc}}</section>
    <section class="actions-row fx row">
      <span>当前指派者: {{task.assignee ? task.assignee.name : '无'}}</span>
      <view class="task-actions-wrapper fx row">
        <span wx:if="{{task.status !== 'DONE' && task.status !== 'STOP'}}" @tap.stop="assign" class="icon mi mi-touch-app primary"></span>
        <span wx:if="{{task.status === 'INIT'}}" @tap.stop="start" class="icon mi mi-play-circle-outline primary"></span>
        <span wx:if="{{task.status === 'PENDING'}}" @tap.stop="done" class="icon mi mi-done sucess"></span>
        <span wx:if="{{task.status === 'INIT' || task.status === 'PENDING'}}" @tap.stop="stop" class="icon mi mi-close warn"></span>
        <span wx:if="{{task.status === 'DONE'}}" @tap.stop="restore" class="icon mi mi-restore primary"></span>
      </view>
    </section>
  </section>
</view>
</template>
<script>
import wepy from 'wepy';
import { updateTaskStatus, assignTask } from '../../services/task';

export default class TaskCard extends wepy.component {
  components = {};

  data = {
    canAssgin: true,
    canStart: true,
    canDone: true,
    canStop: true,
    canRestore: true,
    statusMapping: {
      INIT: '未开始',
      PENDING: '进行中',
      DONE: '已完成',
      STOP: '已终止'
    }
  };

  props = {
    task: {
      type: Object,
      default: {}
    },
    isEmber: {
      type: Boolean,
      default: false
    }
  };

  onLoad() {}

  methods = {
    assign() {
      this.doAction('ASSIGN');
    },
    start() {
      this.doAction('PENDING');
    },
    done() {
      this.doAction('DONE');
    },
    stop() {
      this.doAction('STOP');
    },
    restore() {
      this.doAction('INIT');
    }
  };

  doAction(action) {
    let defer;

    switch (action) {
      case 'ASSIGN':
        return this.assign();
      case 'PENDING':
        defer = this.showDialog('开始');
        break;
      case 'DONE':
        defer = this.showDialog('完成');
        break;
      case 'STOP':
        defer = this.showDialog('终止');
        break;
      case 'INIT':
        defer = this.showDialog('重置');
        break;
    }

    defer.then(async ({ cancel, confirm }) => {
      if (confirm) {
        const { activity, id } = this.task;

        await updateTaskStatus(activity.id, id, action);

        this.$emit('reload');
      }
    });
  }

  showDialog(verb) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: '状态变更',
        content: `确定要${verb}该任务吗？`,
        success: resolve,
        fail: reject
      });
    });
  }

  assign() {
    const { activity: { creator, participants } } = this.task;
    const users = [...participants, creator];

    wx.showActionSheet({
      itemList: users.map(e => `指派给${e.name}`),
      success: res => {
        const { activity, id } = this.task;
        const assignee = users[res.tapIndex];

        assignTask(activity.id, id, assignee.id).then(res => {});

        this.$emit('reload');
      }
    });
  }
}
</script>
