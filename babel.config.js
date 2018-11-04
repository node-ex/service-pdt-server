module.exports = function(api) {
  api.cache(true)

  const sourceMaps = 'inline'

  const plugins = [
    // 'transform-object-rest-spread'
    'syntax-dynamic-import'
  ]

  const presets = [['@babel/preset-env', { targets: { node: 'current' } }]]

  const env = {
    test: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
      plugins: ['babel-jest-assertions']
    },
    production: {
      plugins: [
        'source-map-support'
      ],
      ignore: [
        '**/__tests__/**',
        '**/*.spec.*'
      ]
    }
  }

  return {
    sourceMaps,
    plugins,
    presets,
    env
  }
}
