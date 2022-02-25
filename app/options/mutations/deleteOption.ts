import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteOption = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteOption), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const option = await db.option.deleteMany({ where: { id } })

  return option
})
