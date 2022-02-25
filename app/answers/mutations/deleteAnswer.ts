import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteAnswer = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteAnswer), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const answer = await db.answer.deleteMany({ where: { id } })

  return answer
})
