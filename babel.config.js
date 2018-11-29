module.exports = function(api) {
  api.cache(true)

  const plugins = [
    // 'transform-object-rest-spread'
    'syntax-dynamic-import'
  ]

  const presets = [['@babel/preset-env', { targets: { node: 'current' } }]]

  const env = {
    development: {
      plugins: [
        'source-map-support'
      ],
      sourceMaps: 'inline'
    },
    test: {
      plugins: ['babel-jest-assertions']
    },
    production: {
      ignore: [
        '**/__tests__/**',
        '**/*.spec.*'
      ]
    }
  }

  return {
    plugins,
    presets,
    env
  }
}
