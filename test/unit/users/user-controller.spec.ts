import * as request from 'supertest'
import { testing } from '../test-mode'
import { testMode } from '../../test-wrappers'

describe('user controller', () => {
  describe('get user', () => {
    testMode(testing, 'gets a user', async (server, mode) => {
      // given
      mode.users.repository.get = jest.fn(() => Promise.resolve('mocked user'))

      // when
      const response = await request(server).get('/users/user1@gmail.com')

      // then
      expect(response.status).toEqual(200)
      expect(response.ok).toBeTruthy()
      expect(response.type).toEqual('text/plain')
      expect(response.text).toEqual('mocked user')
      expect(response.body).toEqual({})

      expect(mode.users.repository.get).toHaveBeenCalledWith('user1@gmail.com')
    })

    testMode(testing, 'validates for correct email', async (server, mode) => {
      // given
      mode.users.repository.get = jest.fn(() => Promise.resolve('mocked user'))

      // when
      const response = await request(server).get('/users/user1gmail.com')

      // then
      expect(response.status).toEqual(400)
      expect(response.type).toEqual('application/json')
      expect(response.body).toEqual([
        {
          context: { key: 'email', label: 'email', value: 'user1gmail.com' },
          message: '"email" must be a valid email',
          path: ['email'],
          type: 'string.email',
        },
      ])

      expect(mode.users.repository.get).not.toHaveBeenCalled()
    })
  })

  describe('create user', () => {
    testMode(testing, 'create a user', async (server, mode) => {
      // given
      mode.users.repository.create = jest.fn(() => Promise.resolve())

      // when
      const response = await request(server)
        .post('/users')
        .send({ name: 'john', email: 'john@doe.com' })
        .set('Accept', 'application/json')

      // then
      expect(response.status).toEqual(201)
      expect(response.ok).toBeTruthy()
      expect(response.type).toEqual('text/plain')
      expect(response.text).toEqual('Created')

      expect(mode.users.repository.create).toHaveBeenCalledWith({ name: 'john', email: 'john@doe.com' })
    })

    testMode(testing, 'validates users name', async (server, mode) => {
      // given
      mode.users.repository.create = jest.fn(() => Promise.resolve())

      // when
      const response = await request(server)
        .post('/users')
        .send({ name: 'ab', email: 'johndoe.com' })
        .set('Accept', 'application/json')

      // then
      expect(response.status).toEqual(400)
      expect(response.badRequest).toBeTruthy()
      expect(response.type).toEqual('application/json')
      expect(response.body).toEqual([
        {
          context: { key: 'name', label: 'name', limit: 3, value: 'ab' },
          message: '"name" length must be at least 3 characters long',
          path: ['name'],
          type: 'string.min',
        },
      ])

      expect(mode.users.repository.create).not.toHaveBeenCalled()
    })

    testMode(testing, 'validates email', async (server, mode) => {
      // given
      mode.users.repository.create = jest.fn(() => Promise.resolve())

      // when
      const response = await request(server)
        .post('/users')
        .send({ name: 'abc', email: 'johndoe.com' })
        .set('Accept', 'application/json')

      // then
      expect(response.status).toEqual(400)
      expect(response.badRequest).toBeTruthy()
      expect(response.type).toEqual('application/json')
      expect(response.body).toEqual([
        {
          context: { key: 'email', label: 'email', value: 'johndoe.com' },
          message: '"email" must be a valid email',
          path: ['email'],
          type: 'string.email',
        },
      ])

      expect(mode.users.repository.create).not.toHaveBeenCalled()
    })
  })
})
