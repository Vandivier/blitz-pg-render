import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createPoll from "app/polls/mutations/createPoll"
import { PollForm, FORM_ERROR } from "app/polls/components/PollForm"

const NewPollPage: BlitzPage = () => {
  const router = useRouter()
  const [createPollMutation] = useMutation(createPoll)

  return (
    <div>
      <h1>Create New Poll</h1>

      <PollForm
        submitText="Create Poll"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreatePoll}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const poll = await createPollMutation(values)
            router.push(Routes.ShowPollPage({ pollId: poll.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.PollsPage()}>
          <a>Polls</a>
        </Link>
      </p>
    </div>
  )
}

NewPollPage.authenticate = true
NewPollPage.getLayout = (page) => <Layout title={"Create New Poll"}>{page}</Layout>

export default NewPollPage
