import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getOption from "app/options/queries/getOption"
import deleteOption from "app/options/mutations/deleteOption"

export const Option = () => {
  const router = useRouter()
  const optionId = useParam("optionId", "number")
  const [deleteOptionMutation] = useMutation(deleteOption)
  const [option] = useQuery(getOption, { id: optionId })

  return (
    <>
      <Head>
        <title>Option {option.id}</title>
      </Head>

      <div>
        <h1>Option {option.id}</h1>
        <pre>{JSON.stringify(option, null, 2)}</pre>

        <Link href={Routes.EditOptionPage({ optionId: option.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteOptionMutation({ id: option.id })
              router.push(Routes.OptionsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowOptionPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.OptionsPage()}>
          <a>Options</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Option />
      </Suspense>
    </div>
  )
}

ShowOptionPage.authenticate = true
ShowOptionPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowOptionPage
