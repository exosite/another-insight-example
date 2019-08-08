const utils = require('../utils/writer.js')
const Default = require('../service/DefaultService')

module.exports.alive = function alive(req, res, next) {
  Default.alive()
    .then(response => {
      utils.writeJson(res, response)
    })
    .catch(response => {
      utils.writeJson(res, response)
    })
}

module.exports.createSolution = function createSolution(req, res, next) {
  const solution_id = req.swagger.params['solution_id'].value
  Default.createSolution(solution_id)
    .then(response => {
      utils.writeJson(res, response)
    })
    .catch(response => {
      utils.writeJson(res, response)
    })
}

module.exports.delSolution = function delSolution(req, res, next) {
  const solution_id = req.swagger.params['solution_id'].value
  Default.delSolution(solution_id)
    .then(response => {
      utils.writeJson(res, response)
    })
    .catch(response => {
      utils.writeJson(res, response)
    })
}

module.exports.info = function info(req, res, next) {
  const solution_id = req.swagger.params['solution_id'].value
  Default.info(solution_id)
    .then(response => {
      utils.writeJson(res, response)
    })
    .catch(response => {
      utils.writeJson(res, response)
    })
}

module.exports.infoInsight = function infoInsight(req, res, next) {
  const solution_id = req.swagger.params['solution_id'].value
  const function_id = req.swagger.params['function_id'].value
  Default.infoInsight(solution_id, function_id)
    .then(response => {
      utils.writeJson(res, response)
    })
    .catch(response => {
      utils.writeJson(res, response)
    })
}

module.exports.lifecycle = function lifecycle(req, res, next) {
  const solution_id = req.swagger.params['solution_id'].value
  const body = req.swagger.params['body'].value
  Default.lifecycle(solution_id, body)
    .then(response => {
      utils.writeJson(res, response)
    })
    .catch(response => {
      utils.writeJson(res, response)
    })
}

module.exports.listInsights = function listInsights(req, res, next) {
  const solution_id = req.swagger.params['solution_id'].value
  const body = req.swagger.params['body'].value
  Default.listInsights(solution_id, body)
    .then(response => {
      utils.writeJson(res, response)
    })
    .catch(response => {
      utils.writeJson(res, response)
    })
}

module.exports.process = function process(req, res, next) {
  const solution_id = req.swagger.params['solution_id'].value
  const body = req.swagger.params['body'].value
  Default.process(solution_id, body)
    .then(response => {
      utils.writeJson(res, response)
    })
    .catch(response => {
      utils.writeJson(res, response)
    })
}
