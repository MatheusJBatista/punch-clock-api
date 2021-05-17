import googleAuthApi from './google-oauth-api'

const getTokenInfoByAccessToken = accessToken => googleAuthApi.post(`/tokeninfo?access_token=${accessToken}`)
const getTokenInfoByIdToken = idToken => googleAuthApi.post(`/tokeninfo?id_token=${idToken}`)
const revoke = accessToken => googleAuthApi.post(`/revoke?token=${accessToken}`)

export { getTokenInfoByAccessToken, getTokenInfoByIdToken, revoke }
