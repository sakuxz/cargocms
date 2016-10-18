var robotsConfig = {
  production:`
  User-Agent: *
  Disallow: /admin
  `,
  development:`
  User-Agent: *
  Disallow: /
  `
}

module.exports.robots = {
  ...robotsConfig
}
