import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createAnswer from "app/answers/mutations/createAnswer"
import { AnswerForm, FORM_ERROR } from "app/answers/components/AnswerForm"

const NewAnswerPage: BlitzPage = () => {
  const router = useRouter()
  const [createAnswerMutation] = useMutation(createAnswer)

  return (
    <div>
      <h1>Create New Answer</h1>

      <AnswerForm
        submitText="Create Answer"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateAnswer}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const answer = await createAnswerMutation(values)
            router.push(Routes.ShowAnswerPage({ answerId: answer.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.AnswersPage()}>
          <a>Answers</a>
        </Link>
      </p>
    </div>
  )
}

NewAnswerPage.authenticate = true
NewAnswerPage.getLayout = (page) => <Layout title={"Create New Answer"}>{page}</Layout>

export default NewAnswerPage
