import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/user', async (request, reply) => {
    try {
      const validateUser = z.object({
        idOauth: z.string(),
      })

      const { idOauth } = validateUser.parse(request.body)

      const user = await prisma.user.findUnique({
        where: {
          idOauth,
        },
      })

      if (!user) {
        await prisma.user.create({
          data: {
            idOauth,
          },
        })
      }

      return reply
        .status(200)
        .send({ message: 'User registered or logged successfully' })
    } catch {
      return reply
        .status(400)
        .send({ message: 'FAIL: User not registered or logged' })
    }
  })
}
