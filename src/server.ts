import cors from '@fastify/cors'
import Fastify from 'fastify'

import userRoutes from './routes/userRoutes'
import itemsRoutes from './routes/itemsRoutes'

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
  })

  await fastify.register(userRoutes)
  await fastify.register(itemsRoutes)

  await fastify.listen({
    port: 3333,
    host: '0.0.0.0',
  })
}

bootstrap()
