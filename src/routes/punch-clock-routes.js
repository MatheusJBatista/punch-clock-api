import express from 'express'
import { decryptJwtByRequest } from '../helper/jwt-helper'
import * as PunchClockService from '../service/punch-clock-service'

const router = express.Router()

router.get('/:id', async (req, res, next) => {
  try {
    const user = decryptJwtByRequest(req)
    const response = await PunchClockService.getById(req.params.id, user)
    res.send(response)
  } catch (err) {
    next(err)
  }
})

router.get('/year/:year/month/:month', async (req, res, next) => {
  try {
    const user = decryptJwtByRequest(req)
    const { year, month } = req.params
    const response = await PunchClockService.getByYearAndMonth(year, month, user)
    res.send(response)
  } catch (err) {
    next(err)
  }
})

router.get('/verify-exists/year/:year/month/:month', async (req, res, next) => {
  try {
    const user = decryptJwtByRequest(req)
    const { year, month } = req.params
    const response = await PunchClockService.verifyExists(year, month, user)
    res.send(response)
  } catch (err) {
    next(err)
  }
})

router.post('/create-month', async (req, res, next) => {
  try {
    const user = decryptJwtByRequest(req)
    const response = await PunchClockService.createMonth(req.body, user)
    res.send(response)
  } catch (err) {
    next(err)
  }
})

router.patch('/:id/punch-in', async (req, res, next) => {
  try {
    const user = decryptJwtByRequest(req)
    const response = await PunchClockService.patchPunchClock(req.params.id, req.body, user)
    res.send(response)
  } catch (err) {
    next(err)
  }
})

export default router
