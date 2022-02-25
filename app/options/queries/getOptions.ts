import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetOptionsInput
  extends Pick<Prisma.OptionFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetOptionsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: options,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.option.count({ where }),
      query: (paginateArgs) => db.option.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      options,
      nextPage,
      hasMore,
      count,
    }
  }
)
