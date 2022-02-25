import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createOption from "app/options/mutations/createOption"
import { OptionForm, FORM_ERROR } from "app/options/components/OptionForm"

const NewOptionPage: BlitzPage = () => {
  const router = useRouter()
  const [createOptionMutation] = useMutation(createOption)

  return (
    <div>
      <h1>Create New Option</h1>

      <OptionForm
        submitText="Create Option"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateOption}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const option = await createOptionMutation(values)
            router.push(Routes.ShowOptionPage({ optionId: option.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.OptionsPage()}>
          <a>Options</a>
        </Link>
      </p>
    </div>
  )
}

NewOptionPage.authenticate = true
NewOptionPage.getLayout = (page) => <Layout title={"Create New Option"}>{page}</Layout>

export default NewOptionPage
