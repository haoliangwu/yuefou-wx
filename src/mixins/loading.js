import wepy from 'wepy'

export default class LoadingMixin extends wepy.mixin {
  data = {
    isLoading: false
  }

  events = {
    'loadingMask:show': () => {
      this.toggleLoading(true)
    },
    'loadingMask:hide': () => {
      this.toggleLoading(false)
    }
  }

  toggleLoading(status = false) {
    this.isLoading = !!status
    this.$apply();
  }
}
