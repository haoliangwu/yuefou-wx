<style lang="scss">
.map-wrapper {
  span {
    font-size: 12px;
  }

  map {
    width: 100%;
    height: 200px;
  }
}
</style>

<template>
<view class="map-wrapper">
  <span class="major-text">{{location.address}}</span>
  <map @tap="select" scale="17" longitude="{{location.longitude}}" latitude="{{location.latitude}}" markers="{{[marker]}}"></map>
</view>
</template>

<script>
import wepy from 'wepy';

export default class LocationMap extends wepy.component {
  props = {
    location: {
      type: Object,
      default: {
        latitude: null,
        longitude: null,
        address: ''
      }
    },
    marker: {
      type: Object,
      default: null
    }
  };

  data = {};

  methods = {
    select(event) {
      wx.chooseLocation({
        success: res => {
          this.$emit('selectLocation', res);
        }
      });
    }
  };

  async onLoad() {
    wx.getLocation({
      success: res => {
        this.location = res;
        // this.marker = {
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        //   iconPath: '/images/marker.png'
        // };
        this.$apply();
      }
    });
  }
}
</script>
