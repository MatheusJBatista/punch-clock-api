import jwt from 'jsonwebtoken'
import { DateTime } from 'luxon'

const decryptJwtByToken = token => jwt.decode(token)
const decryptJwtByRequest = request => {
  const authorization = request.headers.authorization
  const token = authorization.split('Bearer ')[1]

  const user = decryptJwtByToken(token)

  return {
    ...user,
    id: user.sub,
  }
}
const isValidToken = user => {
  const dateFromToken = DateTime.fromSeconds(user.exp)
  const dateNow = DateTime.now()

  if (dateNow >= dateFromToken) return false
  return true
}

export { decryptJwtByToken, decryptJwtByRequest, isValidToken }
