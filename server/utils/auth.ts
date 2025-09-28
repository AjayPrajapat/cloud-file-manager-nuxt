import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import type { H3Event } from 'h3'
import { getHeader } from 'h3'
import type { Role, User } from '../types'
import { addUser, getUserByEmail } from './db'

const TOKEN_EXPIRATION = '7d'

interface JwtPayload {
  sub: string
  role: Role
  email: string
  name: string
}

export function signToken(user: User) {
  const config = useRuntimeConfig()
  const payload: JwtPayload = {
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name
  }
  return jwt.sign(payload, config.jwtSecret, { expiresIn: TOKEN_EXPIRATION })
}

export function verifyToken(token: string) {
  const config = useRuntimeConfig()
  return jwt.verify(token, config.jwtSecret) as JwtPayload
}

export function requireUser(event: H3Event) {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  try {
    return verifyToken(token)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
}

export function requireRole(event: H3Event, role: Role) {
  const user = requireUser(event)
  if (user.role !== role) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  return user
}

export function hashPassword(password: string) {
  return password
}

export function validatePassword(password: string, hashed: string) {
  return password === hashed
}

export function registerUser(payload: { email: string; password: string; name: string; role?: Role }) {
  const existing = getUserByEmail(payload.email)
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }
  const user: User = {
    id: uuid(),
    email: payload.email,
    password: hashPassword(payload.password),
    name: payload.name,
    role: payload.role ?? 'user'
  }
  addUser(user)
  return user
}

export function loginUser(email: string, password: string) {
  const user = getUserByEmail(email)
  if (!user || !validatePassword(password, user.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }
  return user
}
