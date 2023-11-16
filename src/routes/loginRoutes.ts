import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export default async function loginRoutes(fastify: FastifyInstance) {
  fastify.post('/cadastro', async (request, reply) => {
    try {
      const validatePostBody = z.object({
        email: z.string().trim(),
        username: z.string().trim(),
        password: z.string().trim(),
      })

      const { email, username, password } = validatePostBody.parse(request.body)

      const login = await prisma.login.create({
        data: {
          email,
          username,
          password,
        },
      })

      if (!login)
        return reply.status(400).send({ message: 'Login not registered' })

      return reply
        .status(200)
        .send({ message: 'Login registered successfully' })
    } catch {
      return reply.status(400).send({ message: 'FAIL: Login not registered' })
    }
  })

  fastify.post('/login', async (request, reply) => {
    try {
      const validateLoginBody = z.object({
        username: z.string().trim(),
        password: z.string().trim(),
      })

      const { username, password } = validateLoginBody.parse(request.body)

      const login = await prisma.login.findUnique({
        where: {
          username,
          password,
          deleted: false,
        },
      })

      if (!login) return reply.status(404).send({ message: 'Login not found' })

      return reply.status(200).send({ idLogin: login.idLogin })
    } catch {
      return reply.status(400).send({ message: 'FAIL: Login not found' })
    }
  })

  fastify.put('/login', async (request, reply) => {
    try {
      const validateLoginHeader = z.object({
        idlogin: z.string().trim(),
      })

      const validateLoginBody = z.object({
        email: z.string().trim(),
        username: z.string().trim(),
        password: z.string().trim(),
      })

      const { idlogin } = validateLoginHeader.parse(request.headers)
      const { email, username, password } = validateLoginBody.parse(
        request.body,
      )

      const login = await prisma.login.update({
        where: {
          idLogin: idlogin,
        },
        data: {
          email,
          username,
          password,
        },
      })

      if (!login)
        return reply.status(400).send({ message: 'Login not updated' })

      return reply.status(204).send({ message: 'Login updated successfully' })
    } catch {
      return reply.status(400).send({ message: 'FAIL: Login not updated' })
    }
  })

  fastify.get('/login/:idLogin', async (request, reply) => {
    try {
      const validateLoginParams = z.object({
        idLogin: z.string().trim(),
      })

      const { idLogin } = validateLoginParams.parse(request.params)

      const login = await prisma.login.findUnique({
        where: {
          idLogin,
          deleted: false,
        },
      })

      if (!login) return reply.status(404).send({ message: 'Login not found' })

      return reply.status(200).send(login)
    } catch {
      return reply.status(400).send({ message: 'FAIL: Login not found' })
    }
  })

  fastify.delete('/login', async (request, reply) => {
    try {
      const validateLoginHeader = z.object({
        idlogin: z.string().trim(),
      })

      const { idlogin } = validateLoginHeader.parse(request.headers)

      const login = await prisma.login.update({
        where: {
          idLogin: idlogin,
        },
        data: {
          deleted: true,
        },
      })

      if (!login)
        return reply.status(400).send({ message: 'Login not deleted' })

      return reply.status(200).send({ message: 'Login deleted successfully' })
    } catch {
      return reply.status(400).send({ message: 'FAIL: Login not deleted' })
    }
  })
}
