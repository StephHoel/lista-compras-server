import { FastifyInstance } from 'fastify'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export default async function loginRoutes(fastify: FastifyInstance) {
  // Configurações de envio de email (exemplo com SMTP)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  })

  fastify.post('/register', async (request, reply) => {
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
        .status(201)
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

      // console.log(login)

      if (!login) return reply.status(404).send({ message: 'Login not found' })

      return reply.status(200).send({ idLogin: login.idLogin })
    } catch {
      return reply.status(400).send({ message: 'FAIL: Login not found' })
    }
  })

  fastify.post('/forgot-pass', async (request, reply) => {
    try {
      const validateLoginBody = z.object({
        username: z.string().trim(),
        email: z.string().trim(),
      })

      // recebe usuario e email
      const { username, email } = validateLoginBody.parse(request.body)

      // verifica se existe
      const login = await prisma.login.findUnique({
        where: {
          username,
          email,
          deleted: false,
        },
      })

      // console.log(login)

      // se não, retorna 404
      if (!login) return reply.status(404)
      else {
        const token = login.idLogin

        // Enviar email
        const info = await transporter.sendMail({
          from: `Steph Hoel Blog <${process.env.EMAIL}>`,
          to: email,

          subject: 'Recuperação de Senha',
          text: `Olá,
  
          Você solicitou uma nova senha em nosso site. Se foi você, clique no link abaixo para criar uma senha diferente:
          
          https://stephhoel.github.io/blog/reset-pass/${token}
          
          Se não foi você, não se preocupe. Sua senha atual não mudará.
          
          Obrigado por usar nosso site.
          
          Equipe do Blog`,
          html: `<div>
          <p>Olá,</p>
          <p>Você solicitou uma nova senha em nosso site. Se foi você, clique no link abaixo para criar uma senha diferente:</p>
          <p>https://stephhoel.github.io/blog/reset-pass/${token}</p>
          <p>Se não foi você, não se preocupe. Sua senha atual não mudará.</p>
          <p>Obrigado por usar nosso site.</p>
          <p>Equipe do Blog</p>
        </div>`,
        })

        // se sim, retorna 204
        return reply.status(204) // .send({ info })
      }
    } catch {
      // se erro, retorna 500
      return reply.status(500).send({
        message: 'Erro ao enviar email.',
      })
    }
  })

  fastify.post('/reset-pass/:token', async (request, reply) => {
    try {
      const validateBody = z.object({
        password: z.string().trim(),
      })

      const validateParams = z.object({
        token: z.string().trim(),
      })

      const { token } = validateParams.parse(request.params)
      const { password } = validateBody.parse(request.body)

      const update = await prisma.login.update({
        where: {
          idLogin: token,
          deleted: false,
        },
        data: {
          password,
        },
      })

      if (update) {
        reply.status(200).send({ message: 'Senha alterada com sucesso!' })
      }
    } catch (error) {
      console.error('Erro ao alterar a senha:', error)
      reply.status(500).send({ error: 'Erro ao alterar a senha' })
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
