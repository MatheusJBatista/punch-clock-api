import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import BusinessException from '../helper/business-exception'

const Schema = mongoose.Schema

const ModelBase = fields => {
  const schema = new Schema({
    ...fields,
    _id: { type: 'string', default: uuidv4, immutable: true },
  })
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id
    },
  })

  return schema
}

export default ModelBase
