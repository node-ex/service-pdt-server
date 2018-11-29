// const TestModel = require('../models/test.es6')

exports.getIndex = async(req, res, next) => {
  // const title = await TestModel.query()
  res.render('index', {
    // title: title
  })
}
