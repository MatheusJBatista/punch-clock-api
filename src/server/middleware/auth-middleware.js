/* eslint-disable camelcase */

import { decryptJwtByToken, isValidToken } from '../../helper/jwt-helper'
import { getTokenInfoByIdToken } from '../../integration/google/google-integration'

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) return res.status(401).send()
  if (!authorization.startsWith('Bearer ')) return res.status(401).send()

  const token = authorization.split('Bearer ')[1]
  const user = decryptJwtByToken(token)

  if (!user) return res.status(401).send()
  if (!isValidToken(user)) return res.status(401).send()

  const tokenInfoFromGoogle = await getTokenInfoByIdToken(token)
  if (!tokenInfoFromGoogle) return res.status(401).send()

  next()
}

export default authMiddleware
