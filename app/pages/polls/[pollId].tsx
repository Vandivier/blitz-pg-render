import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPoll from "app/polls/queries/getPoll"
import deletePoll from "app/polls/mutations/deletePoll"

export const Poll = () => {
  const router = useRouter()
  const pollId = useParam("pollId", "number")
  const [deletePollMutation] = useMutation(deletePoll)
  const [poll] = useQuery(getPoll, { id: pollId })

  return (
    <>
      <Head>
        <title>Poll {poll.id}</title>
      </Head>

      <div>
        <h1>Poll {poll.id}</h1>
        <pre>{JSON.stringify(poll, null, 2)}</pre>

        <Link href={Routes.EditPollPage({ pollId: poll.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deletePollMutation({ id: poll.id })
              router.push(Routes.PollsPage())
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

const ShowPollPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.PollsPage()}>
          <a>Polls</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Poll />
      </Suspense>
    </div>
  )
}

ShowPollPage.authenticate = true
ShowPollPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowPollPage
