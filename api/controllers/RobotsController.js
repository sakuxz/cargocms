module.exports = {
  robots: function(req, res){
    const robots = sails.config.robots;
    const domain = req.host.split(".");
    res.type('text/plain')

    if(domain[0] === 'test' || domain[0] === 'qa' || domain[0] === 'beta'){
      res.send(robots.developmen);
    } else {
      res.send(robots.production);
    }
  }
}
