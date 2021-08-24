import BusinessException from '../helper/business-exception'
import Time from '../model/time'
import { getAllDayFromAMonthInAYear, getStringMonth, getStringYear, getTotalTimeFromDay, validateAndGetTime } from '../helper/date-helper'
import { DateTime } from 'luxon'

const createMonth = async (payload, user) => {
  const { year, month } = payload

  const alreadyRegistered = await verifyExists(year, month, user)
  if (alreadyRegistered) throw new BusinessException('Esse mês já tem uma planilha cadastrada')

  const dates = getAllDayFromAMonthInAYear(year, month)
  await Time.insertMany(dates.map(date => ({ ...date, userId: user.id })))

  return dates
}

const getById = async (id, user) => await getTimeAndValidate(id, user.id)

const getByYearAndMonth = async (year, month, user) => {
  const times = await Time.find(getDateFilter(year, month, user.id))

  return times
}

const verifyExists = async (year, month, user) => {
  const filter = getDateFilter(year, month, user.id)
  const timesQuantity = await Time.countDocuments(filter)

  return timesQuantity > 0
}

const patchPunchClock = async (id, payload, user) => {
  const { enterTime, leaveToLunchTime, backFromLunchTime, exitTime, dayOff } = payload
  const time = await getTimeAndValidate(id, user.id)

  if (enterTime) time.enterTime = validateAndGetTime(enterTime)
  if (leaveToLunchTime) time.leaveToLunchTime = validateAndGetTime(leaveToLunchTime)
  if (backFromLunchTime) time.backFromLunchTime = validateAndGetTime(backFromLunchTime)
  if (exitTime) time.exitTime = validateAndGetTime(exitTime)
  if (typeof dayOff === 'boolean') time.dayOff = dayOff

  if (time.enterTime && time.leaveToLunchTime && time.backFromLunchTime && time.exitTime)
    time.totalHour = getTotalTimeFromDay(time.enterTime, time.leaveToLunchTime, time.backFromLunchTime, time.exitTime)

  await time.save()
  return time
}

const getDateFilter = (year, month, userId) => {
  if (!year) throw new BusinessException('Deve passar o ano.')
  if (!month) throw new BusinessException('Deve passar o mês.')

  const monthFormatted = getStringMonth(month)
  const yearFormatted = getStringYear(year)

  const date = DateTime.fromISO(`${yearFormatted}-${monthFormatted}-01T03:00Z`)

  const filter = {
    date: {
      $gte: date.toJSDate(),
      $lt: date.plus({ month: 1 }).toJSDate(),
    },
  }

  if (userId) filter.userId = userId

  return filter
}

const getTimeAndValidate = async (id, userId) => {
  const filter = { _id: id }
  if (userId) filter.userId = userId

  const time = await Time.findOne(filter)
  if (!time) throw new BusinessException(`Dia com ID ${id} não encontrado`)

  return time
}

export { getById, patchPunchClock, getByYearAndMonth, verifyExists, createMonth }
