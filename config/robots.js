var robotsConfig = {
  production:`
  User-Agent: *
  Disallow: /admin
  `,
  developmen:`
  User-Agent: *
  Disallow: /
  `
}

module.exports.robots = {
  ...robotsConfig
}
