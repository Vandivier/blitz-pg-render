import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetPoll = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetPoll), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const poll = await db.poll.findFirst({ where: { id } })

  if (!poll) throw new NotFoundError()

  return poll
})
