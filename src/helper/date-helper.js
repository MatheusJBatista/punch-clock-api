import { DateTime, Info } from 'luxon'
import BusinessException from './business-exception'

const weekDays = Info.weekdays('short', { locale: 'pt-br' })
const saturday = 5
const sunday = 6
const weekend = [saturday, sunday]

const getDay = (year, month, day) => DateTime.utc(parseInt(year), parseInt(month), parseInt(day), 3, 0, 0, 0)

const getAllDayFromAMonthInAYear = (year, month) => {
  const days = []
  let day = 1

  let currentDay = getDay(year, month, day)
  do {
    const isWeekend = weekend.includes(currentDay.weekday - 1)
    days.push({
      date: currentDay.toJSDate(),
      weekday: weekDays[currentDay.weekday - 1],
      isWeekend,
      dayOff: isWeekend,
    })
    currentDay = getDay(year, month, ++day)
  } while (currentDay.daysInMonth >= day)

  return days
}

const getTotalTimeFromDay = (enterTime, leaveToLunchTime, backFromLunchTime, exitTime) => {
  const enterTimeDate = DateTime.fromISO(enterTime)
  const leaveToLunchTimeDate = DateTime.fromISO(leaveToLunchTime)
  const backFromLunchTimeDate = DateTime.fromISO(backFromLunchTime)
  const exitTimeDate = DateTime.fromISO(exitTime)
  validateAllTimeFromDay(enterTimeDate, leaveToLunchTimeDate, backFromLunchTimeDate, exitTimeDate)

  const totalTimeOfLunch = backFromLunchTimeDate.diff(leaveToLunchTimeDate, ['hours', 'minutes'])
  const totalTimeOfWorkWithoutLunch = exitTimeDate.diff(enterTimeDate, ['hours', 'minutes'])

  const totalTimeOfWork = totalTimeOfWorkWithoutLunch.minus(totalTimeOfLunch).shiftTo('hours', 'minutes')

  const hours = totalTimeOfWork.values.hours
  const minutes = totalTimeOfWork.values.minutes

  const hoursInString = hours <= 9 ? `0${hours}` : hours
  const minutesInString = minutes <= 9 ? `0${minutes}` : minutes

  return `${hoursInString}:${minutesInString}`
}

const getStringMonth = month => {
  month = month.toString()
  while (month.length !== 2) {
    month = `0${month}`
  }
  return month
}

const getStringYear = year => {
  year = year.toString()
  while (year.length !== 4) {
    year = `0${year}`
  }
  return year
}

const validateAllTimeFromDay = (enterTimeDate, leaveToLunchTimeDate, backFromLunchTimeDate, exitTimeDate) => {
  if (!enterTimeDate.isValid) throw new BusinessException('Horário de entrada inválida')
  if (!leaveToLunchTimeDate.isValid) throw new BusinessException('Horário da ida do almoço inválida')
  if (!backFromLunchTimeDate.isValid) throw new BusinessException('Horário da volta do almoço inválida')
  if (!exitTimeDate.isValid) throw new BusinessException('Horário de saída inválida')
}

const validateAndGetTime = timeAsString => {
  const date = DateTime.fromISO(timeAsString)
  if (!date.isValid) throw new BusinessException('Horário de informado inválida')

  return timeAsString
}

export { getAllDayFromAMonthInAYear, getTotalTimeFromDay, getStringMonth, getStringYear, validateAndGetTime }
