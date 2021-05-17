import mongoose from 'mongoose'
import ModelBase from './model-base'
import ExtraDate from './schema/extra-date'

const Time = ModelBase({
  userId: 'string',
  date: Date,
  weekday: 'string',
  isWeekend: Boolean,
  enterTime: 'string',
  leaveToLunchTime: 'string',
  backFromLunchTime: 'string',
  exitTime: 'string',
  dayOff: Boolean,
  extraDate: [ExtraDate],
  totalHour: 'string',
})

export default mongoose.model('Time', Time)
