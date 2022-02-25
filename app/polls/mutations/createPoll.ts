import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreatePoll = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreatePoll), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const poll = await db.poll.create({ data: input })

  return poll
})
