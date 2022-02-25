import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getOption from "app/options/queries/getOption"
import updateOption from "app/options/mutations/updateOption"
import { OptionForm, FORM_ERROR } from "app/options/components/OptionForm"

export const EditOption = () => {
  const router = useRouter()
  const optionId = useParam("optionId", "number")
  const [option, { setQueryData }] = useQuery(
    getOption,
    { id: optionId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateOptionMutation] = useMutation(updateOption)

  return (
    <>
      <Head>
        <title>Edit Option {option.id}</title>
      </Head>

      <div>
        <h1>Edit Option {option.id}</h1>
        <pre>{JSON.stringify(option, null, 2)}</pre>

        <OptionForm
          submitText="Update Option"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateOption}
          initialValues={option}
          onSubmit={async (values) => {
            try {
              const updated = await updateOptionMutation({
                id: option.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowOptionPage({ optionId: updated.id }))
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

const EditOptionPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditOption />
      </Suspense>

      <p>
        <Link href={Routes.OptionsPage()}>
          <a>Options</a>
        </Link>
      </p>
    </div>
  )
}

EditOptionPage.authenticate = true
EditOptionPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditOptionPage
