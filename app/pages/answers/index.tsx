import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getAnswers from "app/answers/queries/getAnswers"

const ITEMS_PER_PAGE = 100

export const AnswersList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ answers, hasMore }] = usePaginatedQuery(getAnswers, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {answers.map((answer) => (
          <li key={answer.id}>
            <Link href={Routes.ShowAnswerPage({ answerId: answer.id })}>
              <a>{answer.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const AnswersPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Answers</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewAnswerPage()}>
            <a>Create Answer</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <AnswersList />
        </Suspense>
      </div>
    </>
  )
}

AnswersPage.authenticate = true
AnswersPage.getLayout = (page) => <Layout>{page}</Layout>

export default AnswersPage
