import express from 'express'
import cors from 'cors'

import configureMongodb from '../infra/database/configure-mongodb'

import PunchClockRoutes from '../routes/punch-clock-routes'
import UserRoutes from '../routes/user-routes'
import errorMiddleware from './middleware/error-middleware'
import requestMiddleware from './middleware/request-middleware'
import authMiddleware from './middleware/auth-middleware'

const startup = async () => {
  const port = process.env.PORT || 3001
  const app = express()
  await configureMongodb()

  app.use(cors())
  app.use(express.json())

  app.use(authMiddleware)
  app.use(requestMiddleware)

  app.use('/punch-clock', PunchClockRoutes)
  app.use('/user', UserRoutes)

  app.use(errorMiddleware)

  app.listen(port, () => console.log(`server listening on port ${port}`))
}

export default startup
