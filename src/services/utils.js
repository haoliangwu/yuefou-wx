import moment from 'moment';

// date
export const formatUTCDateStr = d => moment(d).format('YYYY/MM/DD')

// graphql
export const safePluckQueryResult = prop => res => !res.data.data ? null : res.data.data[prop]
