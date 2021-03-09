import React, { useState, useEffect } from "react"
import Field from "../components/Field"
import Title from "../components/Title"
// @ts-ignore
import styles from "../styles/form.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import FieldArea from "../components/FieldArea"
import Button from "../components/Button"
import { RiMailSendLine } from "react-icons/ri"
import { SEND_EMAIL } from "../fetching/mutations"
import { useMutation } from "@apollo/client"
import { useDispatch } from "react-redux"
import useSetErrorsFields from "../hooks/useSetErrorsFields"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import { types } from "../modules/messageTypes"
import LoaderData from "../components/LoaderData"
import Map from "../components/Map"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import NewsEventsModule from "../components/NewsEventsModule"
import FooterModule from "../components/FooterModule"
import { INewsEventSlider } from "../interfaces"

const Contacts: React.FC = () => {
  const dispatch = useDispatch()
  const [form, setForm] = useState([
    {
      param: "firstname",
      type: "text",
      value: "",
      title: "Ім'я",
      msg: "",
    },
    {
      param: "lastname",
      type: "text",
      value: "",
      title: "Прізвище",
      msg: "",
    },
    {
      param: "email",
      type: "email",
      value: "",
      title: "Електронна пошта",
      msg: "",
    },
    {
      param: "message",
      type: "text",
      value: "",
      title: "Повідомлення",
      msg: "",
    },
  ])
  const { setErrors } = useSetErrorsFields()

  const [
    sendEmail,
    { data: dataEmail, error: errorEmail, loading: loadEmail },
  ] = useMutation(SEND_EMAIL)

  useEffect(() => {
    const dataSendEmail = dataEmail && dataEmail.sendEmail
    if (errorEmail) {
      setErrors(errorEmail.message, setForm)
      dispatch({
        type: SET_TOAST,
        payload: {
          type: types.error.keyWord,
          message: "Помилка перевірки полів форми!",
        },
      })
    } else if (dataSendEmail) {
      setForm((prev) =>
        prev.map((field) => {
          return { ...field, value: "", msg: "" }
        })
      )
      dispatch({
        type: SET_TOAST,
        payload: dataSendEmail,
      })
    }
  }, [dispatch, dataEmail, errorEmail])

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const [firstname, lastname, email, message] = form

    sendEmail({
      variables: {
        firstname: firstname.value.trim(),
        lastname: lastname.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
      },
    })
  }

  const fields = form.map((field) => {
    if (field.param === "message") {
      return <FieldArea key={field.param} field={field} change={setForm} />
    }
    return <Field key={field.param} field={field} change={setForm} />
  })

  return (
    <div className='container'>
      <Title title="Зв'язатися з нами" />
      <div className='wrapper-side'>
        <div className={`${styles.form} ${styles.form__extend}`}>
          <div className={styles.form__content}>
            <div className={styles.form__title}>
              <div className={styles.form__title_text}>
                Форма зворотнього зв'язку
              </div>
            </div>
            <form
              className={styles.form__container_fields}
              onSubmit={handleSubmitForm}
            >
              <LoaderData load={loadEmail} />
              <div className={styles.form__fields}>{fields}</div>
              <div className={styles.form__btns}>
                <Button
                  exClass={stylesBtn.btn_primary}
                  Icon={RiMailSendLine}
                  title='Відправити'
                />
              </div>
            </form>
          </div>
          <div className={styles.form__sidebar}>
            <Map />
          </div>
        </div>
      </div>
      <NewsEventsModuleContainer isNews={true}>
        {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
          <NewsEventsModule items={items} loading={loading} isNews={isNews} />
        )}
      </NewsEventsModuleContainer>
      <FooterModule />
    </div>
  )
}

export default Contacts
