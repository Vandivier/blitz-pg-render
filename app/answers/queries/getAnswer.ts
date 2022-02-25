import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetAnswer = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetAnswer), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const answer = await db.answer.findFirst({ where: { id } })

  if (!answer) throw new NotFoundError()

  return answer
})
