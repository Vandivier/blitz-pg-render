import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateAnswer = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateAnswer), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const answer = await db.answer.create({ data: input })

  return answer
})
