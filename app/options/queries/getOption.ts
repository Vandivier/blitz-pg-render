import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetOption = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetOption), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const option = await db.option.findFirst({ where: { id } })

  if (!option) throw new NotFoundError()

  return option
})
