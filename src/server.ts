import cors from '@fastify/cors'
import Fastify from 'fastify'

import indexRoute from './routes/indexRoute'

import itemsRoutes from './routes/lista-compras/itemsRoutes'
import userRoutes from './routes/lista-compras/userRoutes'

import loginRoutes from './routes/blog/loginRoutes'
import postRoutes from './routes/blog/postRoutes'

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
    // só permite requisições vindas do site abaixo, qualquer outra deve ser ignorada
    // origin: 'https://stephhoel.github.io/lista-de-compras/',
  })

  await fastify.register(indexRoute)

  await fastify.register(userRoutes)
  await fastify.register(itemsRoutes)

  await fastify.register(loginRoutes)
  await fastify.register(postRoutes)

  await fastify.listen({
    port: 3333,
    host: '0.0.0.0',
  })
}

bootstrap()
