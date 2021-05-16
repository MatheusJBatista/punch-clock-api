import mongoose from 'mongoose'
import environment from '../../environment'

const connectAsync = async () =>
  await mongoose.connect(`${environment.mongoConnection}/${environment.mongoDatabase}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })

export default connectAsync
