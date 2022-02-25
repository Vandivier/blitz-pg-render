import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateOption = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateOption),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const option = await db.option.update({ where: { id }, data })

    return option
  }
)
