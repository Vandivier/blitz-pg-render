import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateOption = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateOption), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const option = await db.option.create({ data: input })

  return option
})
