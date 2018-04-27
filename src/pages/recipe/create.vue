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
      <form @submit="submit" @reset="reset">
      <cameraplaceholder :url.sync="url" @takePhoto.user="takePhoto"></cameraplaceholder>
      <view class="title fx row sc">
        <input required name="name" type="text" placeholder="菜谱名称" />
        <span class="placeholder"></span>
        <label for="submitBtn" style="margin: 0 .5em 0 0;">
          <span class="mi mi-done primary"></span>
        </label>
        <label for="resetBtn">
          <span class="mi mi-clear primary"></span>
        </label>
      </view>
      <view class="content fx col">
        <view class="content-item fx col">
          <header class="minor-text">菜单描述</header>
          <textarea style="font-size: 12px;" name="desc" type="text" placeholder="关于菜单的一些额外说明" placeholder-style="font-size: 12px; rgba(0, 0, 0, .54);" auto-height="true"/>
        </view>
        <view class="content-item fx col">
          <header class="minor-text">时间</header>
          <view class="fx row sc">
            <slider @change="slideChange" style="flex: 1;" name="time" min="0" max="60" step="0.5"/>
            <span>{{time}}分钟</span>
          </view>
        </view>
        <!-- <view class="content-item fx col">
          <header class="minor-text">标签</header>
          <textarea style="font-size: 12px;" name="desc" type="text" placeholder="关于菜单的一些额外说明" placeholder-style="font-size: 12px; rgba(0, 0, 0, .54);" auto-height="true"
          />
        </view> -->
      </view>
      <view class="btn-area" hidden>
        <button id="submitBtn" formType="submit">Submit</button>
        <button id="resetBtn" formType="reset">Reset</button>
      </view>
    </form>
  </view>
  </page>
</template>

<script>
import wepy from 'wepy';

import Page from '../../components/layout/page';
import CameraPlaceholder from '../../components/layout/camera-placeholder';

import { createRecipe, uploadRecipePicture } from '../../services/recipe';

export default class RecipeCreatePage extends wepy.page {
  config = {
    navigationBarTitleText: '菜单'
  };
  components = {
    page: Page,
    cameraplaceholder: CameraPlaceholder
  };

  data = {
    recipe: [],
    withCreateAffix: true,
    // vm
    name: '',
    desc: '',
    time: 0,
    url: ''
  };

  computed = {};

  methods = {
    async submit(event) {
      const form = { ...event.detail.value, location: this.location };

      if (this.requireFieldValidate(form)) {
        return;
      }

      const recipe = {
        name: form.name,
        desc: form.desc,
        time: form.time * 2
      };

      const instance = await createRecipe(recipe);

      if (this.url) {
        wx.uploadFile({
          url: this.$parent.service.uploadUrl,
          filePath: this.url,
          name: 'file',
          success: function(res) {
            const data = JSON.parse(res.data).data;
            // TODO 调用 graphql 接口更新 recipe avatar 的属性
            uploadRecipePicture(instance.id, data)
          }
        });
      }

      wx.showToast({
        title: '创建成功',
        success: () => {
          setTimeout(() => this.redirect(), 1000);
        }
      });
    },

    reset() {},

    slideChange(event) {
      this.time = event.detail.value * 2;
    },

    takePhoto(path) {
      this.url = path;
    }
  };

  events = {};

  async onLoad() {}

  redirect() {
    wx.navigateBack();
  }

  requireFieldValidate(values) {
    if (values.name && values.time) {
      return false;
    }

    wx.showToast({
      title: '存在未填必填项'
    });

    return true;
  }
}
</script>
