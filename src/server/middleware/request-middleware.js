const requestMiddleware = (req, res, next) => {
  delete req.body?._id
  next()
}

export default requestMiddleware
