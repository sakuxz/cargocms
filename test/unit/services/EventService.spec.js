describe('about Event Service operation.', function() {

  it('getTicketStatus should success.', async (done) => {
    try {
      const event = {
        sellStartDate: '2016/11/03 10:42:36',
        sellEndDate: '2016/11/05 10:42:36'
      }
      let now = '2016/11/03 11:42:36';
      EventService.getTicketStatus(event, now).open.should.be.true;
      now = '2016/11/03 10:42:36';
      EventService.getTicketStatus(event, now).open.should.be.true;
      now = '2016/11/05 10:42:36';
      EventService.getTicketStatus(event, now).open.should.be.true;
      now = '2016/11/03 9:42:36';
      EventService.getTicketStatus(event, now).open.should.be.false;
      now = '2016/11/05 11:42:36';
      EventService.getTicketStatus(event, now).open.should.be.false;
      done();
    } catch (e) {
      done(e)
    }
  });

});
