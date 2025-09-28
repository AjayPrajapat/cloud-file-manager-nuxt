import { loginUser, registerUser, signToken } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const mode = body.mode ?? 'login'

  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
  }

  if (mode === 'signup') {
    if (!body.name) {
      throw createError({ statusCode: 400, statusMessage: 'Name is required for signup' })
    }
    const user = registerUser({
      email: body.email,
      password: body.password,
      name: body.name,
      role: body.role
    })
    const token = signToken(user)
    return { user, token }
  }

  const user = loginUser(body.email, body.password)
  const token = signToken(user)
  return { user, token }
})
