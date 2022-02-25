import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getAnswer from "app/answers/queries/getAnswer"
import updateAnswer from "app/answers/mutations/updateAnswer"
import { AnswerForm, FORM_ERROR } from "app/answers/components/AnswerForm"

export const EditAnswer = () => {
  const router = useRouter()
  const answerId = useParam("answerId", "number")
  const [answer, { setQueryData }] = useQuery(
    getAnswer,
    { id: answerId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateAnswerMutation] = useMutation(updateAnswer)

  return (
    <>
      <Head>
        <title>Edit Answer {answer.id}</title>
      </Head>

      <div>
        <h1>Edit Answer {answer.id}</h1>
        <pre>{JSON.stringify(answer, null, 2)}</pre>

        <AnswerForm
          submitText="Update Answer"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateAnswer}
          initialValues={answer}
          onSubmit={async (values) => {
            try {
              const updated = await updateAnswerMutation({
                id: answer.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowAnswerPage({ answerId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditAnswerPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditAnswer />
      </Suspense>

      <p>
        <Link href={Routes.AnswersPage()}>
          <a>Answers</a>
        </Link>
      </p>
    </div>
  )
}

EditAnswerPage.authenticate = true
EditAnswerPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditAnswerPage
