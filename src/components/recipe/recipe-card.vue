<style lang="scss">
.card-wrapper {
  border-radius: 3px;
  background: #fff;
  margin: 0.25em 0;
}
.card-content {
  padding: 0.5em;
  &.ember {
    padding: 0 0.5em;
  }
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
    padding: 0.5em 0;
  }
}

.actions-row {
  border-top: 1px solid #ccc;
  margin: 0.5em 0.25em 0;
  padding: 0.25em 0 0 0;
  span {
    flex: 1;
  }

  image {
    margin: 0 2px;
  }
}
</style>
<template>
<view @tap="detail" class="card-wrapper" hover-class="hover">
  <section class="card-content fx col" wx:if="{{!isEmber}}">
      <header class="main fx row">
        <span class="major-text">{{recipe.name}}</span>
        <span class="minor-text">菜单详情</span>
        <span class="mi mi-keyboard-arrow-right"></span>
      </header>
      <header class="sub minor-text">by {{recipe.creator.name}}</header>
      <section class="major-text">{{recipe.desc}}</section>
  </section>
  <section class="card-content fx col ember" wx:else>
      <header class="main fx row">
        <span class="major-text">{{recipe.name}}</span>
      </header>
  </section>
</view>
</template>
<script>
import wepy from 'wepy';
// import Loadings from 'wepy-com-loadings'

export default class RecipeCard extends wepy.component {
  components = {
    // loading: Loadings
  };

  data = {
    // isLoading: false
  };

  props = {
    recipe: {
      type: Object,
      default: null
    },
    isEmber: {
      type: Boolean,
      default: false
    }
  };

  methods = {
    detail() {
      this.$emit('tapReqest', this.recipe.id);
    }
  };
}
</script>
