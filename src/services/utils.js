import moment from 'moment';

// date
export const formatUTCDateStr = d => moment(d).format('YYYY/MM/DD')

export const validateDateRange = (start, end, format) => {
  if (!start || !end) {
    return false;
  }

  start = moment(start, format);
  end = moment(end, format);

  if (start.isAfter(end)) {
    wx.showToast({
      title: '非法的时间区间'
    });
    return true;
  }

  return false;
}

// graphql
export const safePluckQueryResult = prop => res => !res.data.data ? null : res.data.data[prop]
