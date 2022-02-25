import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getOptions from "app/options/queries/getOptions"

const ITEMS_PER_PAGE = 100

export const OptionsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ options, hasMore }] = usePaginatedQuery(getOptions, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {options.map((option) => (
          <li key={option.id}>
            <Link href={Routes.ShowOptionPage({ optionId: option.id })}>
              <a>{option.name}</a>
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

const OptionsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Options</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewOptionPage()}>
            <a>Create Option</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <OptionsList />
        </Suspense>
      </div>
    </>
  )
}

OptionsPage.authenticate = true
OptionsPage.getLayout = (page) => <Layout>{page}</Layout>

export default OptionsPage
