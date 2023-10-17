import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/user', async (request, reply) => {
    try {
      const validateUserBody = z.object({
        username: z.string(),
        password: z.string(),
      })

      const { username, password } = validateUserBody.parse(request.body)

      let user = await prisma.user.findUnique({
        where: {
          username,
          password,
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            username,
            password,
          },
        })
      }

      return reply.status(201).send(user)
    } catch {
      return reply.status(400).send({ message: 'FAIL: User not registered' })
    }
  })
}
