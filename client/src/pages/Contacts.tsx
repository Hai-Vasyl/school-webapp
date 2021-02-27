import React, { useState } from "react"
import Field from "../components/Field"
import Title from "../components/Title"
// @ts-ignore
import styles from "../styles/form.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import FieldArea from "../components/FieldArea"
import Buton from "../components/Button"
import { RiMailSendLine } from "react-icons/ri"

const Contacts: React.FC = () => {
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

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("Message Posted")
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
      <div className='wrapper'>
        <div className={`${styles.form} ${styles.form__extend}`}>
          <form className={styles.form__content} onSubmit={handleSubmitForm}>
            <div className={styles.form__fields}>{fields}</div>
            <div className={styles.form__btns}>
              <Buton
                exClass={stylesBtn.btn_primary}
                Icon={RiMailSendLine}
                title='Відправити'
              />
            </div>
          </form>
          <div className={styles.form__sidebar}>Nothing for now</div>
        </div>
      </div>
    </div>
  )
}

export default Contacts
