import moment from 'moment';

module.exports = {
  getTicketStatus: ({ sellStartDate, sellEndDate }, now) => {
    let open = false;
    let status = '';
    if (moment(now).isBefore(sellStartDate)){
      open = false;
      status = '尚未開賣';
    } else if(moment(now).isAfter(sellEndDate)){
      open = false;
      status = '結束販售';
    } else {
      open = true;
      status = '訂購'
    }
    return { open, status }
  }
}
