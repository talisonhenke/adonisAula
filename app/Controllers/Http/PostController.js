'use strict'

const { validate } = use('Validator')
const Post = use('App/Models/Post')

class PostController {
  async index({ response }) {
    response.json(await Post.all())
  }

  async show({ params, response }) {
    const id = Number(params.id)
    const post = await Post.find(id)

    if (!post) {
      response.notFound({
        error: 'Not Found'
      })
      return
    }

    response.json(post)
  }

  async store({ request, response }) {
    const newPostData = request.only(['title', 'description'])

    const rules = {
      title: 'required|string',
      description: 'string'
    }

    const validation = await validate(newPostData, rules)

    if (validation.fails()) {
      response.badRequest(validation.messages())
      return
    }

    const post = new Post()
    post.title = newPostData.title
    post.description = newPostData.description

    await post.save()

    response.json(post)
  }

  async update({ params, request, response }) {
    const id = Number(params.id)
    const post = await Post.find(id)

    if (!post) {
      response.notFound({
        error: 'Not Found'
      })
      return
    }
    const updates = request.only(['title', 'description'])
    const newPost = {
      ...post,
      ...updates
    }

    const rules = {
      title: 'string',
      description: 'string'
    }

    const validation = await validate(newPost, rules)

    if (validation.fails()) {
      response.badRequest(validation.messages())
      return
    }

    post.merge(updates)
    await post.save()

    response.json(post)
  }

  async destroy({ params, response }) {
    const id = Number(params.id)

    const post = await Post.find(id)

    if (!post) {
      response.notFound({
        error: 'Not Found'
      })
      return
    }
    await post.delete()
    response.noContent({})
  }
}

module.exports = PostController
