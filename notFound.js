//404 middlewere
module.exports = (err, response, next) => {
    response.status(400).end()
}