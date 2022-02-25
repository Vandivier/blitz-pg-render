import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetAnswersInput
  extends Pick<Prisma.AnswerFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetAnswersInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: answers,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.answer.count({ where }),
      query: (paginateArgs) => db.answer.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      answers,
      nextPage,
      hasMore,
      count,
    }
  }
)
