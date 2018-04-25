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
    padding: 0.5em 0 0 0;
  }
}

.actions-row {
  border-top: 1px solid #ccc;
  margin: 0 0.25em;
  padding: 0.25em 0;
  span {
    flex: 1;
  }
}
</style>
<template>
<view @tap="detail" class="card-wrapper" hover-class="hover">
  <section class="card-content fx col">
    <header class="main fx row">
      <span class="major-text">{{activity.title}}</span>
      <span class="minor-text">{{hint}}</span>
      <span class="mi mi-keyboard-arrow-right"></span>
    </header>
    <header class="sub minor-text">admin 创建于 2018.04.18</header>
    <section class="major-text">{{activity.desc || '这个家伙很懒，什么都没有留下'}}</section>
  </section>
</view>
</template>
<script>
import wepy from 'wepy';

export default class ActivityCard extends wepy.component {
  components = {
    // loading: Loadings
  };

  data = {
    // isLoading: false
  };

  props = {
    activity: {
      type: Object,
      default: {}
    },
    hint: {
      type: String,
      default: '活动详情'
    }
  };

  methods = {
    detail() {
      this.$emit('tapReqest', this.activity.id);
    }
  };
}
</script>
