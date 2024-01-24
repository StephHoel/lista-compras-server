import { FastifyInstance } from 'fastify'

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.get('/', async (_, reply) => {
    return reply.status(200).send({ message: 'Server online' })
  })
}
