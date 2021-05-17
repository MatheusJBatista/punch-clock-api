import BusinessException from '../../helper/business-exception'

const errorMiddleware = (err, req, res, next) => {
  console.log('error', err)
  if (err instanceof BusinessException) return res.status(400).send({ message: err.message })
  if (err.status === 400) return res.status(400).send(err)
  res.status(500).send('Ocorreu um erro inesperado, tente novamente mais tarde')
}

export default errorMiddleware
