import express from 'express'
import { create } from '../service/user-service'

const router = express.Router()

router.post('/', async (req, res, next) => {
  const response = await create(req.body).catch(next)
  res.send(response)
})

export default router
