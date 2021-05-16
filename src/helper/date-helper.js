import { DateTime, Info } from 'luxon'

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

  const totalHourOfLunch = backFromLunchTimeDate.diff(leaveToLunchTimeDate, ['hours', 'minutes'])
  const totalTimeOfWorkWithoutLunch = exitTimeDate.diff(enterTimeDate, ['hours', 'minutes'])

  const hours = (totalTimeOfWorkWithoutLunch.values.hours - totalHourOfLunch.values.hours).toFixed(0)
  const minutes = (totalTimeOfWorkWithoutLunch.values.minutes - totalHourOfLunch.values.minutes).toFixed(0)

  const hoursAsString = hours <= 9 ? `0${hours}` : hours
  const minutesAsString = minutes <= 9 ? `0${minutes}` : minutes

  console.log(`${hoursAsString}:${minutesAsString}`)

  return `${hoursAsString}:${minutesAsString}`
}

export { getAllDayFromAMonthInAYear, getTotalTimeFromDay }