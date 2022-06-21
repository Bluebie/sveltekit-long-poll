import chats from '$lib/data/chats'

const timeout = 45000 // 45 seconds timeout

/** @type {import('./__types/endpoint').RequestHandler}} */
export async function get ({ url, params }) {
  if (!chats[params.room]) {
    return { status: 404 }
  } else {
    const from = parseInt(url.searchParams.get('nextID') || '0')
    return {
      body: await chats[params.room].waitRead(from, timeout)
    }
  }
}

/** @type {import('./__types/endpoint').RequestHandler}} */
export async function post ({ params, request }) {
  if (!chats[params.room]) {
    return { status: 404 }
  } else {
    const data = await request.json()
    chats[params.room].push(data)
    return { body: { ok: true } }
  }
}
