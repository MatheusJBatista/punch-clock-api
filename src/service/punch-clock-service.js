import BusinessException from '../helper/business-exception'
import Time from '../model/time'
import User from '../model/user'
import { getAllDayFromAMonthInAYear, getTotalTimeFromDay } from '../helper/date-helper'

const createMonth = async payload => {
  const { year, month } = payload

  const alreadyRegistered = await verifyExists(year, month)
  if (alreadyRegistered) throw new BusinessException('Esse mês já tem uma planilha cadastrada')

  const dates = getAllDayFromAMonthInAYear(year, month)
  await Time.insertMany(dates)

  return dates
}

const getById = async id => await getTimeAndValidate(id)

const getByYearAndMonth = async (year, month) => {
  const times = await Time.find(getDateFilter(year, month))

  return times
}

const verifyExists = async (year, month) => {
  const filter = getDateFilter(year, month)
  const timesQuantity = await Time.countDocuments(filter)

  return timesQuantity > 0
}

const patchPunchClock = async (id, payload) => {
  const { enterTime, leaveToLunchTime, backFromLunchTime, exitTime, dayOff } = payload
  const time = await getTimeAndValidate(id)

  if (enterTime) time.enterTime = enterTime
  if (leaveToLunchTime) time.leaveToLunchTime = leaveToLunchTime
  if (backFromLunchTime) time.backFromLunchTime = backFromLunchTime
  if (exitTime) time.exitTime = exitTime
  if (dayOff) time.dayOff = dayOff

  if ((time.enterTime, time.leaveToLunchTime, time.backFromLunchTime, time.exitTime))
    time.totalHour = getTotalTimeFromDay(time.enterTime, time.leaveToLunchTime, time.backFromLunchTime, time.exitTime)

  await time.save()
  return time
}

const getDateFilter = (year, month) => {
  if (!year) throw new BusinessException('Deve passar o ano.')
  if (!month) throw new BusinessException('Deve passar o mês.')

  const nextMonth = parseInt(month) + 1
  const nextMonthAsString = `0${nextMonth}`

  return {
    date: {
      $gte: new Date(`${year}-${month}-01T03:00Z`),
      $lt: new Date(`${year}-${nextMonthAsString}-01T03:00Z`),
    },
  }
}

const getTimeAndValidate = async id => {
  const time = await Time.findById(id)
  if (!time) throw new BusinessException(`Dia com ID ${id} não encontrado`)

  return time
}

const validateUser = async userId => {
  const user = await User.findById(userId)
  if (!user) throw new BusinessException(`usuário com ID ${userId} não encontrado`)
}

export { getById, patchPunchClock, getByYearAndMonth, verifyExists, createMonth }
