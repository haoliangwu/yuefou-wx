import wepy from 'wepy'

export default class FormMixin extends wepy.mixin {
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

  createdSuccess() {
    wx.showToast({
      title: '创建成功',
      success: () => {
        setTimeout(() => this.redirect(), 1000);
      }
    });
  }

  updatedSuccess() {
    wx.showToast({
      title: '编辑成功',
      success: () => {
        setTimeout(() => this.redirect(), 1000);
      }
    })
  }

  redirect() {
    wx.navigateBack();
  }
}
