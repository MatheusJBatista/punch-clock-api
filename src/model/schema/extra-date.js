import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ExtraDate = new Schema({
  name: 'string',
  time: 'string',
})

export default ExtraDate
