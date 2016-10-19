module.exports = {
  robots: function(req, res){
    const robots = sails.config.robots;
    let domain = sails.config.appUrl;
    if( domain.indexOf('://') !== -1){
      domain = domain.split('://')[1];
    }

    res.type('text/plain')
    if(domain.startsWith('test') || domain.startsWith('qa') || domain.startsWith('beta')){
      res.send(robots.development);
    } else {
      res.send(robots.production);
    }
  }
}
