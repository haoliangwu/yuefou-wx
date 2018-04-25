<style lang="scss">
.camera-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
  camera {
    height: 100%;
    width: 100%;
  }
  image {
    height: 100%;
    width: 100%;
  }
  .placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    transform: translate(-50%, -50%);
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .snapshot {
    position: absolute;
    bottom: 12px;
    left: 50%;
    width: 40px;
    height: 40px;
    transform: translate(-50%, 0);
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;

    cover-view {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .close {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translate(-72px, 0);
    width: 36px;
    height: 36px;

    cover-view {
      color: #fff;
    }
  }

  .choose {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translate(42px, 0);
    width: 24px;
    height: 24px;

    cover-view {
      color: #fff;
    }
  }
}
</style>

<template>
<view class="camera-wrapper">
  <image wx:if="{{!show}}" src="{{url}}"></image>
  <camera wx:if="{{show}}" device-position="back" flash="off" @error="cameraError"></camera>
  <view @tap="turnOn" class="placeholder" wx:else>
    <span class="mi mi-photo-camera x36"></span>
  </view>
  <cover-view @tap="takePhoto" wx:if="{{show}}" class="snapshot">
    <cover-view class="mi mi-photo-camera x24"></cover-view>
  </cover-view>
  <cover-view @tap="turnOff" wx:if="{{show}}" class="close">
    <cover-view class="mi mi-keyboard-arrow-down x36"></cover-view>
  </cover-view>
  <cover-view @tap="chooseImage" wx:if="{{show}}" class="choose">
    <cover-view class="mi mi-image x24"></cover-view>
  </cover-view>
</view>
</template>

<script>
import wepy from 'wepy';

export default class CameraPlaceholder extends wepy.component {
  props = {
    show: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: null
    }
  };

  methods = {
    turnOn() {
      this.show = true;
    },

    turnOff() {
      this.show = false;
    },

    takePhoto() {
      const ctx = wx.createCameraContext();
      ctx.takePhoto({
        quality: 'normal',
        success: res => {
          this.$emit('takePhoto', res.tempImagePath);
        },
        complete: () => {
          this.show = false;
          this.$apply();
        }
      });
    },

    chooseImage() {
      wx.chooseImage({
        count: 1,
        sourceType: 'album',
        success: res => {
          this.$emit('takePhoto', res.tempFilePaths[0]);
        },
        complete: () => {
          this.show = false;
          this.$apply();
        }
      });
    }
  };
}
</script>
