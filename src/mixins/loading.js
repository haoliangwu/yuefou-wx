import wepy from 'wepy'

export default class LoadingMixin extends wepy.mixin {
  data = {
    isLoading: false
  }

  events = {
  }

  toggleLoading(status = false) {
    this.isLoading = !!status
    this.$apply();
  }
}
