import React, { useState, useEffect } from "react"
import Field from "../components/Field"
import Title from "../components/Title"
// @ts-ignore
import styles from "../styles/form.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import FieldArea from "../components/FieldArea"
import Button from "../components/Button"
import { REGISTER_USER } from "../fetching/queries"
import { useLazyQuery } from "@apollo/client"
import { useDispatch } from "react-redux"
import useSetErrorsFields from "../hooks/useSetErrorsFields"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import { types } from "../modules/messageTypes"
import LoaderData from "../components/LoaderData"
import Map from "../components/Map"
import { access } from "../modules/accessModifiers"
import FieldPicker from "../components/FieldPicker"
import { BiUserPlus } from "react-icons/bi"
import { IOption, INewsEventSlider } from "../interfaces"
// @ts-ignore
import bgImage from "../images/undraw_content_team_3epn.svg"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import NewsEventsModule from "../components/NewsEventsModule"
import FooterModule from "../components/FooterModule"

const RegisterUser: React.FC = () => {
  const dispatch = useDispatch()
  const [form, setForm] = useState([
    { param: "firstname", type: "text", value: "", title: "Ім'я", msg: "" },
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
      title: "Електронна адреса",
      msg: "",
    },
    {
      param: "role",
      type: "text",
      value: "teacher",
      title: "Роль користувача",
      msg: "",
    },
  ])
  const { setErrors } = useSetErrorsFields()

  const [register, regFetch] = useLazyQuery(REGISTER_USER)

  useEffect(() => {
    if (regFetch.error) {
      console.log({ regErrro: regFetch.error })
      setErrors(regFetch.error.message, setForm)
      dispatch({
        type: SET_TOAST,
        payload: {
          type: types.error.keyWord,
          message: "Помилка перевірки полів форми!",
        },
      })
    } else if (regFetch.data && regFetch.data.register) {
      setForm((prevForm) =>
        prevForm.map((field) => {
          if (field.param === "role") {
            return { ...field, value: "teacher", msg: "" }
          }
          return { ...field, value: "", msg: "" }
        })
      )
      dispatch({
        type: SET_TOAST,
        payload: {
          type: types.success.keyWord,
          message: "Користувач успішно створений!",
        },
      })
    }
  }, [dispatch, setErrors, regFetch])

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const [firstname, lastname, email, role] = form
    const password = email.value.split("@")[0]
    register({
      variables: {
        firstname: firstname.value.trim(),
        lastname: lastname.value.trim(),
        email: email.value.trim(),
        password,
        isAdmin: true,
        role: role.value,
      },
    })
  }

  let options: IOption[] = []
  Object.keys(access).forEach((key) => {
    // @ts-ignore
    if (access[key].keyWord !== "unregistered") {
      // @ts-ignore
      options.push({ label: access[key].title, value: access[key].keyWord })
    }
  })
  const fields = form.map((field) => {
    if (field.param === "role") {
      return (
        <FieldPicker
          isImportant
          key={field.param}
          options={options}
          field={field}
          change={setForm}
        />
      )
    }
    return (
      <Field isImportant key={field.param} field={field} change={setForm} />
    )
  })

  return (
    <div className='container'>
      <Title title='Створити користувача' />
      <div className='wrapper-side'>
        <div className={`${styles.form} ${styles.form__extend}`}>
          <div className={styles.form__content}>
            <div className={styles.form__title}>
              <div className={styles.form__title_text}>
                Форма створення користувача
              </div>
            </div>
            <form
              className={styles.form__container_fields}
              onSubmit={handleSubmitForm}
            >
              <LoaderData load={regFetch.loading} />
              <div className={styles.form__fields}>{fields}</div>
              <div className={styles.form__btns}>
                <Button
                  exClass={stylesBtn.btn_primary}
                  Icon={BiUserPlus}
                  title='Створити'
                />
              </div>
            </form>
          </div>
          <div className={styles.form__sidebar}>
            <img
              className={styles.form__bg_image}
              src={bgImage}
              alt='bgImage'
            />
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

export default RegisterUser
