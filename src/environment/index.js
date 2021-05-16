import base from './base'
import productionConfig from './production-config'

let environment = base()

if (process.env.CLIENT_ENV !== 'development') {
  environment = {
    ...environment,
    ...productionConfig,
  }
}

export default environment
