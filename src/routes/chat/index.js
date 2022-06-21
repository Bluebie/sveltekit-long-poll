import chats from "$lib/data/chats"
import Log from "$lib/long-poll/log"
import { nanoid } from "nanoid"

// create a chat room
export async function get () {
  const id = nanoid()
  chats[id] = new Log()

  return {
    status: 307,
    headers: {
      location: `/chat/${id}/`
    }
  }
}