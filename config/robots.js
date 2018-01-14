var robotsConfig = {
  production:`
  User-Agent: *
  Disallow: /admin
  Disallow: /recipe/order
  Disallow: /api
  `,
  development:`
  User-Agent: *
  Disallow: /
  `
}

module.exports.robots = {
  ...robotsConfig
}
