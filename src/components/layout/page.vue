<style lang="scss">
.loading-mask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.loading-spinner-wrapper {
  position: relative;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;

  .loading-spinner {
    width: 160rpx;
    height: 160rpx;
  }

  .loading-spinner-text {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.87);
  }
}

.affix-wrapper {
  position: fixed;
  bottom: 10px;
  left: 10px;
  width: 36px;
  height: 36px;
  z-index: 999;
  border: 1px solid #ccc;
  border-radius: 50%;
  background: #ff4081;
  color: #fff;
  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
<template>
  <view class="container">
    <slot name="body">页面内容</slot>

    <view wx:if="{{isLoading}}" class="loading-mask">
      <view class="loading-spinner-wrapper">
        <image class="loading-spinner" src="/images/ripple_spinner.svg"></image>
        <text class="loading-spinner-text">加载中...</text>
      </view>
    </view>
    <view @tap="affixTap" wx:if="{{withCreateAffix}}" class="affix-wrapper shadow">
      <span class="mi mi-playlist-add x24"></span>
    </view>
  </view>
</template>
<script>
import wepy from 'wepy';
// import Loadings from 'wepy-com-loadings'

export default class Page extends wepy.component {
  components = {
    // loading: Loadings
  };

  data = {
    // isLoading: false
  };

  props = {
    withCreateAffix: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  };

  methods = {
    affixTap() {
      this.$emit('affixTapRequest');
    }
  };
}
</script>
