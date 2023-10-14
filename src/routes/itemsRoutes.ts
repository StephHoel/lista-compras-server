import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function itemsRoutes(fastify: FastifyInstance) {
  fastify.post('/items', async (request, reply) => {
    try {
      const validateItem = z.object({
        idOauth: z.string(),
        item: z.string(),
        qtd: z.number(),
        price: z.number(),
      })

      const { idOauth, item, price, qtd } = validateItem.parse(request.body)

      const items = await prisma.items.create({
        data: {
          idOauth,
          item,
          price,
          qtd,
        },
      })

      if (!items)
        return reply.status(400).send({ message: 'FAIL: Item not registered' })

      return reply.status(200).send({ message: 'Item registered successfully' })
    } catch {
      return reply.status(400).send({ message: 'FAIL: Item not registered' })
    }
  })

  fastify.get('/items', async (request, reply) => {
    try {
      const validateItem = z.object({
        idOauth: z.string(),
      })

      const { idOauth } = validateItem.parse(request.body)

      const items = await prisma.items.findMany({
        where: {
          idOauth,
        },
        orderBy: {
          item: 'asc',
        },
      })

      if (!items)
        return reply.status(400).send({ message: 'FAIL: Items not found' })

      return reply.status(200).send(items)
    } catch {
      return reply.status(400).send({ message: 'FAIL: Items not found' })
    }
  })

  fastify.put('/items/:id', async (request, reply) => {
    try {
      const validateItem = z.object({
        id: z.string(),
        idOauth: z.string(),
        item: z.string(),
        qtd: z.number(),
        price: z.number(),
      })

      const { id, idOauth, item, price, qtd } = validateItem.parse(request.body)

      const items = await prisma.items.update({
        where: {
          id,
          idOauth,
        },
        data: {
          item,
          price,
          qtd,
          updatedAt: new Date(),
        },
      })

      if (!items)
        return reply.status(400).send({ message: 'FAIL: Item not updated' })

      return reply.status(204).send({ message: 'Item updated successfully' })
    } catch {
      return reply.status(400).send({ message: 'FAIL: Item not updated' })
    }
  })

  fastify.delete('/items/:id', async (request, reply) => {
    try {
      const validateItem = z.object({
        id: z.string(),
        idOauth: z.string(),
      })

      const { id, idOauth } = validateItem.parse(request.body)

      const items = await prisma.items.delete({
        where: {
          id,
          idOauth,
        },
      })

      if (!items)
        return reply.status(400).send({ message: 'FAIL: Item not deleted' })

      return reply.status(200).send({ message: 'Item deleted successfully' })
    } catch {
      return reply.status(400).send({ message: 'FAIL: Item not deleted' })
    }
  })
}
