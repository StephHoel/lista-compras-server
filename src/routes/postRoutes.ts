import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export default async function postRoutes(fastify: FastifyInstance) {
  fastify.get('/post', async (_, reply) => {
    try {
      const posts = await prisma.post.findMany({
        where: {
          state: 'POST',
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      if (!posts) return reply.status(404).send({ message: 'Posts not found' })

      return reply.status(200).send(posts)
    } catch {
      return reply.status(400).send({ message: 'FAIL: Posts not found' })
    }
  })

  fastify.get('/post/:idPost', async (request, reply) => {
    try {
      const validatePostParams = z.object({
        idPost: z.string().trim(),
      })

      const { idPost } = validatePostParams.parse(request.params)

      const post = await prisma.post.findMany({
        where: {
          idPost,
          state: {
            not: 'DELETE',
          },
        },
      })

      if (!post) return reply.status(404).send({ message: 'Post not found' })

      return reply.status(200).send(post)
    } catch {
      return reply.status(400).send({ message: 'FAIL: Post not found' })
    }
  })

  fastify.post('/post', async (request, reply) => {
    try {
      const validatePostHeader = z.object({
        idauthor: z.string().trim(),
      })

      const validatePostBody = z.object({
        title: z.string().trim(),
        content: z.string().trim(),
        state: z.enum(['DRAFT', 'POST', 'DELETE']),
      })

      const { idauthor } = validatePostHeader.parse(request.headers)
      const { title, content, state } = validatePostBody.parse(request.body)

      const post = await prisma.post.create({
        data: {
          idAuthor: idauthor,
          title,
          content,
          state,
        },
      })

      if (!post)
        return reply.status(400).send({ message: 'Post not registered' })

      return reply.status(200).send({ message: 'Post registered successfully' })
    } catch {
      return reply.status(400).send({ message: 'FAIL: Post not registered' })
    }
  })

  fastify.put('/post', async (request, reply) => {
    try {
      const validatePostHeader = z.object({
        idauthor: z.string().trim(),
      })

      const validatePostBody = z.object({
        idPost: z.string().trim(),
        title: z.string().trim(),
        content: z.string().trim(),
        state: z.enum(['DRAFT', 'POST', 'DELETE']),
      })

      const { idauthor } = validatePostHeader.parse(request.headers)
      const { idPost, title, content, state } = validatePostBody.parse(
        request.body,
      )

      const post = await prisma.post.update({
        where: {
          idPost,
          idAuthor: idauthor,
        },
        data: {
          title,
          content,
          state,
        },
      })

      if (!post) return reply.status(400).send({ message: 'Post not updated' })

      return reply.status(204).send({ message: 'Post updated successfully' })
    } catch {
      return reply.status(400).send({ message: 'FAIL: Post not updated' })
    }
  })

  fastify.delete('/post/:idPost', async (request, reply) => {
    try {
      const validatePostHeader = z.object({
        idauthor: z.string().trim(),
      })

      const validatePostParams = z.object({
        idPost: z.string().trim(),
      })

      const { idPost } = validatePostParams.parse(request.params)
      const { idauthor } = validatePostHeader.parse(request.headers)

      const post = await prisma.post.update({
        where: {
          idPost,
          idAuthor: idauthor,
        },
        data: {
          state: 'DELETE',
        },
      })

      if (!post) return reply.status(400).send({ message: 'Post not deleted' })

      return reply.status(200).send({ message: 'Post deleted successfully' })
    } catch {
      return reply.status(400).send({ message: 'FAIL: Post not deleted' })
    }
  })
}
