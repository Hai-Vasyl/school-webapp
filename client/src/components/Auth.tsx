import React, { useState, useEffect } from "react"
import { LOGIN_USER, REGISTER_USER } from "../fetching/queries"
import { useLazyQuery } from "@apollo/client"
import { AiOutlineLogin, AiOutlineCheckCircle } from "react-icons/ai"
import { BsArrowLeft, BsX } from "react-icons/bs"
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
import useChangeInput from "../hooks/useChangeInput"
import useSetErrorsFields from "../hooks/useSetErrorsFields"
import ButtonTab from "./ButtonTab"
import LoaderData from "./LoaderData"

const Auth: React.FC = () => {
  const {
    toggle: { authForm },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const [isLogin, setIslogin] = useState(true)
  const { changeInput } = useChangeInput()
  const { setErrors } = useSetErrorsFields()
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
  const [formReg, setFormReg] = useState([
    { param: "firstname", type: "text", value: "", title: "Ім'я", msg: "" },
    {
      param: "lastname",
      type: "text",
      value: "",
      title: "Прізвище",
      msg: "",
    },
    {
      param: "username",
      type: "text",
      value: "",
      title: "Ім'я користувача",
      msg: "",
    },
  ])

  const [login, logFetch] = useLazyQuery(LOGIN_USER)
  const [register, regFetch] = useLazyQuery(REGISTER_USER)

  useEffect(() => {
    if (logFetch.error) {
      setErrors(logFetch.error.message, setForm)
    } else if (logFetch.data && logFetch.data.login) {
      dispatch({
        type: SET_AUTH,
        payload: {
          auth: logFetch.data.login,
          init: false,
        },
      })
      dispatch({ type: AUTHFORM_TOGGLE })
    }
  }, [setErrors, logFetch, dispatch])

  useEffect(() => {
    if (regFetch.error) {
      setErrors(regFetch.error.message, setForm)
      setErrors(regFetch.error.message, setFormReg)
    } else if (regFetch.data && regFetch.data.register) {
      dispatch({
        type: SET_AUTH,
        payload: {
          auth: regFetch.data.register,
          init: false,
        },
      })
      dispatch({ type: AUTHFORM_TOGGLE })
    }
  }, [setErrors, regFetch, dispatch])

  const clearErrors = (setTemplForm: any) => {
    setTemplForm((prevForm: IField[]) =>
      prevForm.map((field) => {
        return { ...field, msg: "" }
      })
    )
  }

  const handleFlipForm = () => {
    clearErrors(setForm)
    clearErrors(setFormReg)
    setIslogin((prevIsLogin) => !prevIsLogin)
  }

  const handleSubmit = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    const [email, password] = form
    const [firstname, lastname, username] = formReg

    if (isLogin) {
      login({ variables: { email: email.value, password: password.value } })
    } else {
      register({
        variables: {
          firstname: firstname.value,
          lastname: lastname.value,
          username: username.value,
          email: email.value,
          password: password.value,
          isAdmin: false,
        },
      })
    }
  }

  const handleCloseForm = () => {
    console.log("CLOSE")
  }

  const reduceMapFields = (form: IField[], setForm: any) => {
    return form.map((field) => {
      return (
        <Field
          key={field.param}
          field={field}
          change={(event) => changeInput(event, setForm)}
        />
      )
    })
  }

  return (
    <div className={`${styles.form} ${authForm && styles.form__active}`}>
      <div className={styles.form__loadbar}></div>
      <div
        className={`${styles.form__wrapper} ${
          !isLogin && styles.form__wrapper__extend
        }`}
      >
        <h3 className={styles.form__title}>
          {isLogin ? "Увійти" : "Зареєструватися"}
          <ButtonTab
            Icon={BsArrowLeft}
            click={handleFlipForm}
            exClass={`${styles.form__btn_back} ${
              isLogin ? styles.form__btn_back__close : ""
            }`}
          />
          <ButtonTab
            Icon={BsX}
            click={handleCloseForm}
            exClass={`${styles.form__btn_close} ${
              isLogin ? styles.form__btn_close__close : ""
            }`}
          />
        </h3>
        <div className={styles.form__wrapper_forms}>
          <div className={styles.form__wrapper_form}>
            <form className={styles.form__fields} onSubmit={handleSubmit}>
              {reduceMapFields(formReg, setFormReg)}
              <button className='btn-handler'></button>
            </form>
          </div>
          <LoaderData load={logFetch.loading || regFetch.loading} />
          <div className={styles.form__wrapper_form}>
            <form className={styles.form__fields} onSubmit={handleSubmit}>
              {reduceMapFields(form, setForm)}
              <button className='btn-handler'></button>
            </form>
            <div className={styles.form__btns}>
              <Button
                click={handleSubmit}
                exClass={`${stylesButton.btn_primary}`}
                Icon={isLogin ? AiOutlineLogin : AiOutlineCheckCircle}
                title={isLogin ? "Увійти" : "Зареєструватися"}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${styles.form__sidebar} ${
          !isLogin && styles.form__sidebar__close
        }`}
      >
        <div className={styles.form__sidebar_content}>
          <h3
            className={`${styles.form__sidebar_title} ${
              isLogin && styles.form__sidebar_title__appear
            }`}
          >
            Привіт, друже!
          </h3>
          <p
            className={`${styles.form__paragraph} ${
              isLogin && styles.form__paragraph__appear
            }`}
          >
            Введи свої особисті дані та починай подорож до знань разом з нами
          </p>
          <Button
            click={handleFlipForm}
            exClass={stylesButton.btn_outline_light}
            Icon={AiOutlineCheckCircle}
            title={"Зареєструватися"}
          />
        </div>
      </div>
    </div>
  )
}

export default Auth
