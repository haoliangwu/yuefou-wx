<style lang="scss">
.list-wrapper {
  display: flex;
  flex-direction: column;
  width: 100vw;

  // activitycard {
  //   flex: 1;
  //   width: 100%;
  // }
}
</style>
<template>
  <page @affixTapRequest.user="affixTap" :withCreateAffix.sync="withCreateAffix" :isLoading.sync="isLoading">
    <view slot="body" class="body-wrapper">
      <view class="recipes-wrapper">
        <repeat for="{{recipes}}" index="index" item="recipe">
          <recipecard @tapReqest.user="detail" :recipe="recipe"></recipecard>
        </repeat>
      </view>
    </view>
  </page>
</template>

<script>
import wepy from 'wepy';

import Page from '../../components/layout/page';
import RecipeCard from '../../components/recipe/recipe-card';
import LoadingMixin from '../../mixins/loading';

import { recipes } from '../../services/recipe';

export default class RecipeList extends wepy.page {
  config = {
    navigationBarTitleText: '菜单'
  };
  components = {
    page: Page,
    recipecard: RecipeCard
  };

  mixins = [LoadingMixin];

  data = {
    recipes: [],
    withCreateAffix: true
  };

  computed = {};

  methods = {
    detail(id) {
      wx.navigateTo({
        url: `/pages/recipe/detail?id=${id}`
      });
    },

    affixTap() {
      wx.showActionSheet({
        itemList: ['创建菜单'],
        success(res) {
          const { tapIndex } = res;

          switch (tapIndex) {
            case 0:
              wx.navigateTo({
                url: './create'
              });
              break;
          }
        }
      });
    }
  };

  events = {};

  async onLoad() {}

  async onShow() {
    this.fetchRecipes();
  }

  async onPullDownRefresh() {
    this.fetchRecipes();
    wx.stopPullDownRefresh();
  }

  async fetchRecipes() {
    this.toggleLoading(true);
    this.recipes = await recipes();
    this.toggleLoading(false);
  }
}
</script>
