import express from 'express'
import * as PunchClockService from '../service/punch-clock-service'

const router = express.Router()

router.get('/:id', async (req, res, next) => {
  const response = await PunchClockService.getById(req.params.id).catch(next)
  res.send(response)
})

router.get('/year/:year/month/:month', async (req, res, next) => {
  const { year, month } = req.params
  const response = await PunchClockService.getByYearAndMonth(year, month).catch(next)
  res.send(response)
})

router.get('/verify-exists/year/:year/month/:month', async (req, res, next) => {
  const { year, month } = req.params
  const response = await PunchClockService.verifyExists(year, month).catch(next)
  res.send(response)
})

router.post('/create-month', async (req, res, next) => {
  const response = await PunchClockService.createMonth(req.body).catch(next)
  res.send(response)
})

router.patch('/:id/punch-in', async (req, res, next) => {
  const response = await PunchClockService.patchPunchClock(req.params.id, req.body).catch(next)
  res.send(response)
})

export default router
