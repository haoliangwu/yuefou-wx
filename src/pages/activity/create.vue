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
      <view class="title fx row sc">
        <input required name="title" type="text" placeholder="活动名称" />
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
          <header class="minor-text">活动类型</header>
          <section class="major-text">
            <radio-group name="type" class="radio-group">
              <label class="radio">
                <radio value="HOST" checked="{{type === 'HOST'}}" />招待
              </label>
              <label class="radio">
                <radio value="TASK" checked="{{type === 'TASK'}}" />任务
              </label>
              <!-- <label class="radio">
            <radio value="POTLUCK" checked="{{type === 'POTLUCK'}}"/>百家宴
          </label> -->
            </radio-group>
          </section>
        </view>
        <view class="content-item fx col">
          <header class="minor-text">活动时间</header>
          <section class="major-text fx row">
            <picker required name="startDate" mode="date" value="{{startDate}}" @change="startDateChange">
              <view class="picker">
                {{startDate || '开始时间'}}
              </view>
            </picker>
            <span class="minor-text" style="margin: 0 .25em;">至</span>
            <picker required name="endDate" mode="date" value="{{endDate}}" @change="endDateChange">
              <view class="picker">
                {{endDate || '结束时间'}}
              </view>
            </picker>
          </section>
        </view>
        <view class="content-item fx col">
          <header class="minor-text">活动描述</header>
          <textarea style="font-size: 12px;" name="desc" type="text" placeholder="关于活动的一些额外说明" placeholder-style="font-size: 12px; rgba(0, 0, 0, .54);" auto-height="true"
          />
        </view>
        <view class="content-item fx col">
          <header class="minor-text">活动地点</header>
          <locationmap @selectLocation.user="selectLocationRequest" :location.sync="location" :marker.sync="marker"></locationmap>
        </view>
        <!-- <view class="content-item fx col" wx:if="{{activity.type === 'HOST'}}">
      <header class="minor-text">菜单</header>
      <section wx:if="{{activity.recipes.length > 0}}" class="fx col">
        <repeat for="{{activity.recipes}}" index="index" item="recipe">
          <span>{{recipe.name}}</span>
        </repeat>
      </section>
      <section class="major-text" wx:else>
        <span>无</span>
      </section>
    </view>
    <view class="content-item fx col" wx:if="{{activity.type === 'TASK'}}">
      <header class="minor-text">任务</header>
      <section wx:if="{{activity.tasks.length > 0}}" class="fx col">
        <repeat for="{{activity.tasks}}" index="index" item="task">
          <span>{{task.name}}</span>
        </repeat>
      </section>
      <section class="major-text" wx:else>
        <span>无</span>
      </section>
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
import moment from 'moment';

import Page from '../../components/layout/page';
import LocationMap from '../../components/activity/location-map';

import { createActivity } from '../../services/activity';

export default class ActivityCreatePage extends wepy.page {
  config = {
    navigationBarTitleText: '创建活动'
  };
  components = {
    page: Page,
    locationmap: LocationMap
  };

  data = {
    recipes: [],
    withCreateAffix: true,
    // vm
    title: '',
    type: '',
    range: {
      start: '',
      end: ''
    },
    desc: '',
    startDate: null,
    endDate: null,
    location: null,
    marker: null
  };

  computed = {};

  methods = {
    async submit(event) {
      const form = { ...event.detail.value, location: this.location };

      if (this.requireFieldValidate(form)) {
        return;
      }

      const activity = {
        title: form.title,
        desc: form.desc,
        type: form.type,
        startedAt: moment(form.startDate).utc(),
        endedAt: moment(form.endDate).utc(),
        location: form.location.address
      };

      await createActivity(activity);

      wx.showToast({
        title: '创建成功',
        content: '可以在活动列表查看',
        success: () => {
          setTimeout(() => this.redirect(), 1000)
        }
      });
    },

    reset() {
      this.title = '';
      this.type = '';
      this.desc = '';
      this.startDate = null;
      this.endDate = null;
    },

    startDateChange(event) {
      const temp = this.startDate;
      this.startDate = event.detail.value;

      if (this.dateRangeValidate()) {
        this.startDate = temp;
      }
    },

    endDateChange(event) {
      const temp = this.endDate;
      this.endDate = event.detail.value;

      if (this.dateRangeValidate()) {
        this.endDate = temp;
      }
    },

    selectLocationRequest(location) {
      this.location = location;
      this.marker = {
        latitude: location.latitude,
        longitude: location.longitude,
        iconPath: '/images/marker.png'
      };
    }
  };

  events = {};

  async onLoad() {
    // const today = moment();
    // this.range = {
    //   start: today.format('YYYY-MM-DD'),
    //   end: today.add('1', 'y').format('YYYY-MM-DD')
    // };
  }

  redirect() {
    wx.navigateBack();
  }

  dateRangeValidate() {
    if (!this.startDate || !this.endDate) {
      return false;
    }

    const start = moment(this.startDate, 'YYYY-MM-DD');
    const end = moment(this.endDate, 'YYYY-MM-DD');

    if (start.isAfter(end)) {
      wx.showToast({
        title: '非法的活动时间'
      });
      return true;
    }

    return false;
  }

  requireFieldValidate(values) {
    if (values.title && values.startDate && values.endDate && values.location) {
      return false;
    }

    wx.showToast({
      title: '存在未填必填项'
    });

    return true;
  }
}
</script>
