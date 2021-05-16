import express from 'express'
import cors from 'cors'

import configureMongodb from '../infra/database/configure-mongodb'

import PunchClockRoutes from '../routes/punch-clock-routes'
import UserRoutes from '../routes/user-routes'
import BusinessException from '../helper/business-exception'

const startup = async () => {
  const port = process.env.PORT || 3001
  const app = express()
  await configureMongodb()

  app.use(cors())
  app.use(express.json())

  app.use(function (req, res, next) {
    delete req.body?._id
    next()
  })

  app.use('/punch-clock', PunchClockRoutes)
  app.use('/user', UserRoutes)

  app.use(function (err, req, res, next) {
    console.log(err)
    if (err instanceof BusinessException) return res.status(400).send({ message: err.message })
    if (err.status === 400) return res.status(400).send(err)
    res.status(500).send('Ocorreu um erro inesperado, tente novamente mais tarde')
  })

  app.listen(port, () => console.log(`server listening on port ${port}`))
}

export default startup
