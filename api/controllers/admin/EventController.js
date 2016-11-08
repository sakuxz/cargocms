import moment from 'moment';

module.exports = {
  index: async (req, res) => {
    res.ok({
      view: true,
      serverSidePaging: true,
      layout: 'admin/default/index'
    });
  },
  create: async (req, res) => {
    let startTime = Date.now();
    let endTime = Date.now() + 86400000; // add one day.
    startTime = moment(startTime).format("YYYY/MM/DD 00:00");
    endTime = moment(endTime).format("YYYY/MM/DD 00:00");
    res.ok({
      view: true,
      layout: 'admin/default/create',
      StartDate: startTime,
      EndDate: endTime
    });
  },
  edit: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/edit'
    });

  },
  show: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/show'
    });
  },
}
