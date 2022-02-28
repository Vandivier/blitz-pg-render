import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreatePoll = z.object({
  title: z.string(),
  description: z.string(),
})

export default resolver.pipe(resolver.zod(CreatePoll), resolver.authorize(), async (input, ctx) => {
  const { title, description } = input
  const data = {
    createdBy: { connect: { id: ctx.session.userId } },
    description,
    isActive: true,
    title,
  }
  const poll = await db.poll.create({ data })

  return poll
})
