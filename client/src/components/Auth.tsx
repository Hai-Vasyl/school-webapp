import React, { useState, useEffect } from "react"
import { LOGIN_USER } from "../fetching/queries"
import { useLazyQuery } from "@apollo/client"
import { AiOutlineLogin } from "react-icons/ai"
import { BsX, BsQuestionCircle } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import { SET_AUTH } from "../redux/auth/authTypes"
import { AUTHFORM_TOGGLE } from "../redux/toggle/toggleTypes"
import { IField } from "../interfaces"
import { RootStore } from "../redux/store"
import Button from "./Button"
import Field from "./Field"
// @ts-ignore
import styles from "../styles/auth.module"
// @ts-ignore
import stylesButton from "../styles/button.module"
import useSetErrorsFields from "../hooks/useSetErrorsFields"
import ButtonTab from "./ButtonTab"
import LoaderData from "./LoaderData"

const Auth: React.FC = () => {
  const {
    toggle: { authForm },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const { setErrors } = useSetErrorsFields()
  const [prompt, setPrompt] = useState(false)
  const [form, setForm] = useState([
    {
      param: "email",
      type: "email",
      value: "",
      title: "Електронна адреса",
      msg: "",
    },
    {
      param: "password",
      type: "password",
      value: "",
      title: "Пароль",
      msg: "",
    },
  ])

  const [login, logFetch] = useLazyQuery(LOGIN_USER)

  useEffect(() => {
    if (logFetch.error) {
      setErrors(logFetch.error.message, setForm)
    } else if (logFetch.data && logFetch.data.login) {
      dispatch({
        type: SET_AUTH,
        payload: { ...logFetch.data.login, init: false },
      })
      dispatch({ type: AUTHFORM_TOGGLE })
    }
  }, [setErrors, logFetch, dispatch])

  const handleSubmit = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    const [email, password] = form
    login({
      variables: {
        email: email.value.trim(),
        password: password.value.trim(),
      },
    })
  }

  const handleOpenPrompt = () => {
    setPrompt((prev) => !prev)
  }

  const handleCloseForm = () => {
    dispatch({ type: AUTHFORM_TOGGLE })
  }

  const reduceMapFields = (form: IField[], setForm: any) => {
    return form.map((field) => {
      return <Field key={field.param} field={field} change={setForm} />
    })
  }

  return (
    <div className={`${styles.form} ${authForm && styles.form__active}`}>
      <h3 className={styles.form__title}>
        <ButtonTab
          exClass={`${styles.form__btn} ${styles.form__btn_prompt} ${
            prompt && styles.form__btn_prompt__active
          }`}
          click={handleOpenPrompt}
          Icon={BsQuestionCircle}
        />
        Увійти
        <ButtonTab
          exClass={`${styles.form__btn} ${styles.form__btn_close}`}
          click={handleCloseForm}
          Icon={BsX}
        />
      </h3>
      <div className={styles.form__wrapper_form}>
        <div
          className={`${styles.form__prompt} ${
            prompt && styles.form__prompt__open
          }`}
        >
          <h4 className={styles.form__prompt_title}>Щоб увійти введіть:</h4>
          <div className={styles.form__prompt_field}>
            <span>Електронна адреса:</span>
            <span className={styles.form__prompt_login}>your.part.email</span>
            @gmail.com
          </div>
          <div className={styles.form__prompt_field}>
            <span>Пароль:</span>
            <span className={styles.form__prompt_login}>your.part.email</span>
          </div>
        </div>
        <LoaderData load={logFetch.loading} />
        <form className={styles.form__fields} onSubmit={handleSubmit}>
          {reduceMapFields(form, setForm)}
          <button className='btn-handler'></button>
        </form>
        <div className={styles.form__btns}>
          <Button
            click={handleSubmit}
            exClass={stylesButton.btn_primary}
            Icon={AiOutlineLogin}
            title='Увійти'
          />
        </div>
      </div>
    </div>
  )
}

export default Auth
