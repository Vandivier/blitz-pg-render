import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getAnswer from "app/answers/queries/getAnswer"
import deleteAnswer from "app/answers/mutations/deleteAnswer"

export const Answer = () => {
  const router = useRouter()
  const answerId = useParam("answerId", "number")
  const [deleteAnswerMutation] = useMutation(deleteAnswer)
  const [answer] = useQuery(getAnswer, { id: answerId })

  return (
    <>
      <Head>
        <title>Answer {answer.id}</title>
      </Head>

      <div>
        <h1>Answer {answer.id}</h1>
        <pre>{JSON.stringify(answer, null, 2)}</pre>

        <Link href={Routes.EditAnswerPage({ answerId: answer.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteAnswerMutation({ id: answer.id })
              router.push(Routes.AnswersPage())
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

const ShowAnswerPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.AnswersPage()}>
          <a>Answers</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Answer />
      </Suspense>
    </div>
  )
}

ShowAnswerPage.authenticate = true
ShowAnswerPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowAnswerPage
