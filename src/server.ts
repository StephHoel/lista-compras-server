import cors from '@fastify/cors'
import Fastify from 'fastify'

import itemsRoutes from './routes/itemsRoutes'
import userRoutes from './routes/userRoutes'

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
    // só permite requisições vindas do site abaixo, qualquer outra deve ser ignorada
    // origin: 'https://stephhoel.github.io/lista-de-compras/',
  })

  await fastify.register(userRoutes)
  await fastify.register(itemsRoutes)

  await fastify.listen({
    port: 3333,
    host: '0.0.0.0',
  })
}

bootstrap()
