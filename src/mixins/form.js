import wepy from 'wepy'

export default class FormMixin extends wepy.mixin {
  data = {
    formCache: {}
  }

  requireFieldsValidate(values = {}, fields = []) {
    try {
      fields.forEach(field => {
        if (!values[field]) throw new Error('required')
      })

      return false
    } catch (e) {
      wx.showToast({
        title: '存在未填必填项'
      });

      return true;
    }
  }

  createdSuccess(msg) {
    wx.showToast({
      title: msg || '创建成功',
      success: () => {
        setTimeout(() => this.redirect(), 1000);
      }
    });
  }

  updatedSuccess(msg) {
    wx.showToast({
      title: msg || '编辑成功',
      success: () => {
        setTimeout(() => this.redirect(), 1000);
      }
    })
  }

  redirect() {
    wx.navigateBack();
  }

  backup(key, value) {
    this.formCache[key] = JSON.stringify(value)
  }

  fallback(key) {
    return JSON.parse(this.formCache[key])
  }
}
