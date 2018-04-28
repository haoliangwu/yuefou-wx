<style lang="scss">
.content,
.title {
  background: #fff;
  padding: 0.5em 0.75em;
  margin: 0.5em 0;
}
.title {
  // height: 300px;
  span.minor-text {
    font-size: 14px;
  }
  header {
    padding: 0.5em 0.75em;
    height: 2em;
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
  <page >
    <view slot="body" class="body-wrapper">
      <view class="title fx col sc">
        <header class="fx row sc" style="width: 100%;">
          <span class="major-text">
            {{recipe.name}}
          </span>
          <span class="minor-text" style="padding: 0 0 0 .5em;">by {{recipe.creator.name}}</span>
          <span class="placeholder"></span>
          <span @tap="delete({{recipe}})" wx:if="{{recipe.creator.id === user.id}}" class="mi mi-delete-forever warn"></span>
        </header>
        <image wx:if="{{recipe.avatar}}" src="{{recipe.avatar}}"></image>
      </view>
      <view class="content fx col">
        <!-- <view class="content-item fx col">
          <header class="minor-text">标题</header>
          <section class="major-text">
            {{recipe.name}}
          </section>
        </view> -->
        <view class="content-item fx col">
          <header class="minor-text">标签</header>
          <section class="fx row" wx:if="{{recipe.tags.length > 0}}">
            <repeat for="{{recipe.tags}}" index="index" item="tag">
              <span style="padding: 0 3px;">{{tag.name}}</span>
            </repeat>
          </section>
          <section class="major-text" wx:else>
            <span>无</span>
          </section>
        </view>
        <view class="content-item fx col">
          <header class="minor-text">时间</header>
          <section class="major-text">
            {{recipe.time}}分钟
          </section>
        </view>
        <view class="content-item fx col">
          <header class="minor-text">描述</header>
          <section class="major-text">
            {{recipe.desc || '这个家伙很懒，什么都没有留下'}}
          </section>
        </view>
      </view>
    </view>
  </page>
</template>

<script src="./list.js">
import wepy from 'wepy';

import Page from '../../components/layout/page';

import { recipe, deleteRecipe } from '../../services/recipe';
import { retrieveUserToken } from '../../services/storage';

export default class RecipeDetail extends wepy.page {
  config = {
    navigationBarTitleText: '菜单详情',
    enablePullDownRefresh: true
  };
  components = {
    page: Page
  };

  data = {
    user: null,
    recipe: {}
  };

  computed = {};

  methods = {
    delete(recipe) {
      wx.showModal({
        title: '确认要删除该菜单吗？',
        content: '删除后无法恢复',
        success: async res => {
          if (res.cancel) return;

          await deleteRecipe(recipe.id);

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

    await this.fetchRecipe(id);

    this.$apply();
  }

  async onPullDownRefresh() {
    await this.fetchRecipe(this.recipe.id);

    wx.stopPullDownRefresh();

    this.$apply();
  }

  onShareAppMessage() {
    return {
      title: this.recipe.name,
      path: `/pages/recipe/detail?id=${this.recipe.id}`,
      success() {
        wx.showToast({
          title: '转发成功'
        });
      }
    };
  }

  prefixRecipeResource(uri) {
    if (uri.indexOf('http://') > -1 || uri.indexOf('https://') > -1) {
      return uri;
    }

    return this.$parent.prefixRecipeResource(uri);
  }

  async fetchRecipe(id) {
    this.recipe = await recipe(id);

    if (this.recipe.avatar) {
      this.recipe.avatar = this.prefixRecipeResource(this.recipe.avatar);
    }
  }
}
</script>
