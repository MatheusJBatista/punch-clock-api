import mongoose from 'mongoose'
import ModelBase from './model-base'

const User = ModelBase({
  userId: {},
})

export default mongoose.model('User', User)
