<style lang="scss">
checkbox-group {
  flex-wrap: wrap;
}
.option-wrapper {
  flex: 1 0 33%;
}
</style>

<template>
<page>
  <view slot="body" class="body-wrapper">
    <form @submit="submit" @reset="reset">
      <view class="title fx row sc">
        <span>已选择 {{selectedCount}} 项</span>
        <span class="placeholder"></span>
        <label for="submitBtn" style="margin: 0 .5em 0 0;">
          <span class="mi mi-done primary"></span>
        </label>
        <label for="resetBtn">
          <span class="mi mi-clear primary"></span>
        </label>
      </view>
      <view class="content fx col">
        <checkbox-group @change="selectRecipe" name="recipes" class="fx row">
          <repeat for="{{recipes}}" index="index" item="recipe">
            <view class="option-wrapper">
              <label class="checkbox">
                <checkbox value="{{recipe.id}}" checked="{{recipe.checked}}" />{{recipe.name}}
              </label>
            </view>
          </repeat>
        </checkbox-group>
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

import { activity, updateActivity } from '../../services/activity';
import { recipes } from '../../services/recipe';

import FormMixin from '../../mixins/form';

export default class BindRecipePage extends wepy.page {
  config = {
    navigationBarTitleText: '绑定菜单',
    enablePullDownRefresh: true
  };
  components = {
    page: Page
  };

  data = {
    activityId: null,
    activity: null,
    recipes: [],
    selectedCount: 0
  };

  computed = {};

  mixins = [FormMixin];

  methods = {
    async submit(event) {
      const { recipes: selectedIds } = event.detail.value;
      const connect = [];
      const disconnect = [];

      this.activity.recipes.forEach(recipe => {
        const { id } = recipe;

        if (!selectedIds.includes(id)) {
          disconnect.push({ id: recipe.id });
        }
      });

      selectedIds.forEach(id => {
        if (!this.activity.recipes.find(recipe => recipe.id === id)) {
          connect.push({ id });
        }
      });

      await updateActivity(
        { id: this.activity.id },
        {},
        {
          connect,
          disconnect
        }
      );

      this.updatedSuccess('绑定成功');
    },
    reset() {
      this.recipes = this.fallback('recipes');
      this.selectedCount = 0
    },
    selectRecipe(event) {
      this.selectedCount = event.detail.value.length;
    }
  };

  events = {};

  async onLoad(options) {
    const { activityId } = options;

    this.activityId = activityId;

    this.activity = await activity(activityId);
    this.selectedCount = this.activity.recipes.length;

    this.recipes = await recipes();

    this.recipes.forEach(recipe => {
      if (this.activity.recipes.find(r => recipe.id === r.id)) {
        recipe.checked = true;
      }
    });

    this.backup('recipes', this.recipes);

    this.$apply();
  }

  async onPullDownRefresh() {
    this.recipes = await recipes();
    this.$apply();

    wx.stopPullDownRefresh();
  }
}
</script>
