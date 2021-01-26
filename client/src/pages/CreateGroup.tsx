import React, { useState, useEffect } from "react"
import Title from "../components/Title"
import Field from "../components/Field"
import FieldPicker from "../components/FieldPicker"
import { GET_TEACHERS, GET_GROUPS } from "../fetching/queries"
import { CREATE_GROUP } from "../fetching/mutations"
import { useMutation, useQuery } from "@apollo/client"
// @ts-ignore
import styles from "../styles/form.module"
import useChangeInput from "../hooks/useChangeInput"
import { BsPlus, BsTrash, BsPencilSquare } from "react-icons/bs"
import { IGroup } from "../interfaces"
// owner: { type: Types.ObjectId, ref: "User", required: true },
//   name: { type: String, required: true, default: "" },
//   date
import Button from "../components/Button"
// @ts-ignore
// import styles from "../styles/groups.module"
import UserCard from "../components/UserCard"
import { convertDate } from "../helpers/convertDate"
import ButtonTab from "../components/ButtonTab"

const CreateGroup: React.FC = () => {
  const { data: users, loading: loadUsers } = useQuery(GET_TEACHERS)
  const { data: groups, loading: loadGroups } = useQuery(GET_GROUPS)
  const [
    createGroup,
    { data: newGroup, loading: loadCreateGroup },
  ] = useMutation(CREATE_GROUP)
  const [dataGroups, setDataGroups] = useState<IGroup[]>([])
  const [form, setForm] = useState([
    { param: "name", type: "text", value: "", title: "Назва класу", msg: "" },
    {
      param: "owner",
      type: "text",
      value: "",
      title: "Керівник класу",
      msg: "",
    },
  ])
  const { changeInput } = useChangeInput()

  useEffect(() => {
    const teachers = users && users.getTeachers
    if (teachers) {
      setForm((prevForm) =>
        prevForm.map((field) => {
          if (field.param === "owner") {
            return {
              ...field,
              value: teachers[0].id,
            }
          }
          return field
        })
      )
    }
  }, [users])

  useEffect(() => {
    const dataGroups = groups && groups.getGroups
    if (dataGroups) {
      setDataGroups(dataGroups)
    }
  }, [groups])

  useEffect(() => {
    console.log({ newGroup })
    const createdGroup = newGroup && newGroup.createGroup
    if (createdGroup) {
      setDataGroups((prev) => [...prev, createdGroup])
    }
  }, [newGroup])

  const groupsJSX = dataGroups.map((group) => {
    return (
      <div key={group.id}>
        <div>
          <h3>{group.name}</h3>
          <ButtonTab click={() => {}} Icon={BsPencilSquare} />
          <ButtonTab click={() => {}} Icon={BsTrash} />
        </div>
        <div>
          <p>Керівник</p>
          <UserCard isEnvChat={false} isLink={false} user={group.owner} />
        </div>
        <div>
          <span>Останнє оновлення</span>
          <span>{convertDate(group.date)}</span>
        </div>
      </div>
    )
  })

  const handleSubmitForm = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    const [name, owner] = form
    createGroup({
      variables: { name: name.value.trim(), owner: owner.value.trim() },
    })
  }

  const options = users
    ? users.getTeachers.map((user: any) => {
        return {
          value: user.id,
          label: `${user.firstname} ${user.lastname} (${user.email})`,
        }
      })
    : []

  const fields = form.map((field) => {
    if (field.param === "owner") {
      return (
        <FieldPicker
          key={field.param}
          change={setForm}
          field={field}
          options={options}
        />
      )
    }
    return (
      <Field
        key={field.param}
        field={field}
        change={(event) => changeInput(event, setForm)}
      />
    )
  })

  return (
    <div className='container'>
      <Title title='Створити клас' />
      <div className='wrapper'>
        <div className={styles.form}>
          <div className={styles.form__fields}>
            <div>
              <div>Створення класу</div>
            </div>
            <form onSubmit={handleSubmitForm}>
              {fields}
              <div>
                <Button
                  title='Створити клас'
                  Icon={BsPlus}
                  click={handleSubmitForm}
                  type='button'
                />
              </div>
            </form>
            <div>{groupsJSX}</div>
          </div>
          <div className={styles.form__sidebar}></div>
        </div>
      </div>
    </div>
  )
}

export default CreateGroup
