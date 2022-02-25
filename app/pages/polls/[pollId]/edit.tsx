import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPoll from "app/polls/queries/getPoll"
import updatePoll from "app/polls/mutations/updatePoll"
import { PollForm, FORM_ERROR } from "app/polls/components/PollForm"

export const EditPoll = () => {
  const router = useRouter()
  const pollId = useParam("pollId", "number")
  const [poll, { setQueryData }] = useQuery(
    getPoll,
    { id: pollId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updatePollMutation] = useMutation(updatePoll)

  return (
    <>
      <Head>
        <title>Edit Poll {poll.id}</title>
      </Head>

      <div>
        <h1>Edit Poll {poll.id}</h1>
        <pre>{JSON.stringify(poll, null, 2)}</pre>

        <PollForm
          submitText="Update Poll"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdatePoll}
          initialValues={poll}
          onSubmit={async (values) => {
            try {
              const updated = await updatePollMutation({
                id: poll.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowPollPage({ pollId: updated.id }))
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

const EditPollPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPoll />
      </Suspense>

      <p>
        <Link href={Routes.PollsPage()}>
          <a>Polls</a>
        </Link>
      </p>
    </div>
  )
}

EditPollPage.authenticate = true
EditPollPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditPollPage
