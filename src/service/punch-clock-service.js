import BusinessException from '../helper/business-exception'
import Time from '../model/time'
import { getAllDayFromAMonthInAYear, getTotalTimeFromDay } from '../helper/date-helper'

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

  if (enterTime) time.enterTime = enterTime
  if (leaveToLunchTime) time.leaveToLunchTime = leaveToLunchTime
  if (backFromLunchTime) time.backFromLunchTime = backFromLunchTime
  if (exitTime) time.exitTime = exitTime
  if (typeof dayOff === 'boolean') time.dayOff = dayOff

  if ((time.enterTime, time.leaveToLunchTime, time.backFromLunchTime, time.exitTime))
    time.totalHour = getTotalTimeFromDay(time.enterTime, time.leaveToLunchTime, time.backFromLunchTime, time.exitTime)

  await time.save()
  return time
}

const getDateFilter = (year, month, userId) => {
  if (!year) throw new BusinessException('Deve passar o ano.')
  if (!month) throw new BusinessException('Deve passar o mês.')

  const nextMonth = parseInt(month) + 1
  const nextMonthAsString = `0${nextMonth}`

  const filter = {
    date: {
      $gte: new Date(`${year}-${month}-01T03:00Z`),
      $lt: new Date(`${year}-${nextMonthAsString}-01T03:00Z`),
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
