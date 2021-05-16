import User from '../model/user'

const create = async payload => {
  const user = new User(payload)
  await user.save()

  return user.id
}

export { create }
