import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export default async function itemsRoutes(fastify: FastifyInstance) {
  fastify.post('/items', async (request, reply) => {
    try {
      const validateItemHeader = z.object({
        iduser: z.string(),
      })

      const validateItemBody = z.object({
        item: z.string(),
        qtd: z.number(),
        price: z.number(),
      })

      const { iduser } = validateItemHeader.parse(request.headers)
      const { item, price, qtd } = validateItemBody.parse(request.body)

      const items = await prisma.items.create({
        data: {
          idUser: iduser,
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
      const validateItemHeader = z.object({
        iduser: z.string(),
      })

      const { iduser } = validateItemHeader.parse(request.headers)

      const items = await prisma.items.findMany({
        where: {
          idUser: iduser,
        },
        orderBy: {
          item: 'asc',
        },
      })

      if (!items) return reply.status(404).send({ message: 'Items not found' })

      return reply.status(200).send(items)
    } catch {
      return reply.status(400).send({ message: 'FAIL: Items not found' })
    }
  })

  fastify.put('/items', async (request, reply) => {
    try {
      const validateItemHeader = z.object({
        iduser: z.string(),
      })

      const validateItemBody = z.object({
        idItem: z.string(),
        item: z.string(),
        qtd: z.number(),
        price: z.number(),
      })

      const { iduser } = validateItemHeader.parse(request.headers)
      const { idItem, item, price, qtd } = validateItemBody.parse(request.body)

      const items = await prisma.items.update({
        where: {
          idItem,
          idUser: iduser,
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

  fastify.delete('/items/:idItem', async (request, reply) => {
    try {
      const validateItemHeader = z.object({
        iduser: z.string(),
      })

      const validateItemParams = z.object({
        idItem: z.string(),
      })

      const { idItem } = validateItemParams.parse(request.params)
      const { iduser } = validateItemHeader.parse(request.headers)

      const items = await prisma.items.delete({
        where: {
          idItem,
          idUser: iduser,
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
