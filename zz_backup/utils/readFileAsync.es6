const fs = require('fs')

const readFileAsync = (path, encoding) => {
  /* eslint-disable-next-line compat/compat */
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = readFileAsync
