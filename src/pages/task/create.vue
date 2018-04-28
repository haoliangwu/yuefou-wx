<style lang="scss">

</style>

<template>
  <page >
    <view slot="body" class="body-wrapper">
      <form @submit="submit" @reset="reset">
      <view class="title fx row sc">
        <input required name="name" type="text" placeholder="任务名称" />
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
          <header class="minor-text">所属活动</header>
          <section>
            <span>{{activity.title}}</span>
          </section>
        </view>
        <view class="content-item fx col">
          <header class="minor-text">任务描述</header>
          <textarea style="font-size: 12px;" name="desc" type="text" placeholder="关于任务的一些额外说明" placeholder-style="font-size: 12px; rgba(0, 0, 0, .54);" auto-height="true"
          />
        </view>
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
import { activity } from '../../services/activity';
import { createTask } from '../../services/task';

import FormMixin from '../../mixins/form';

export default class CreateTaskPage extends wepy.page {
  config = {
    navigationBarTitleText: '创建新任务'
  };
  components = {
    page: Page
  };

  data = {
    activityId: null,
    activity: null
  };

  computed = {};

  mixins = [FormMixin];

  methods = {
    async submit(event) {
      const form = { ...event.detail.value, location: this.location };

      if (this.validate(form)) {
        return;
      }

      const task = {
        name: form.name
      };

      await createTask(this.activityId, task);

      this.createdSuccess()
    },

    reset() {
      this.name = '';
      this.title = '';
    }
  };

  events = {};

  async onLoad(options) {
    const { activityId } = options;

    this.activityId = activityId;

    this.activity = await activity(activityId);

    this.$apply();
  }

  validate(values) {
    return this.requireFieldsValidate(values, ['name'])
  }
}
</script>
