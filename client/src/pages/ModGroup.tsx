import React, { useState, useEffect } from "react"
import Title from "../components/Title"
import Field from "../components/Field"
import FieldPicker from "../components/FieldPicker"
import { GET_TEACHERS, GET_GROUPS } from "../fetching/queries"
import { CREATE_GROUP, EDIT_GROUP, DELETE_GROUP } from "../fetching/mutations"
import { useMutation, useQuery } from "@apollo/client"
// @ts-ignore
import styles from "../styles/form.module"
import useChangeInput from "../hooks/useChangeInput"
import { BsPlus, BsX, BsPencil, BsArrowLeft } from "react-icons/bs"
import { IGroup } from "../interfaces"
import Button from "../components/Button"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import ButtonTab from "../components/ButtonTab"
import useSetErrorsFields from "../hooks/useSetErrorsFields"
import GroupPreview from "../components/GroupPreview"
import { WARNING_CLOSE } from "../redux/toggle/toggleTypes"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import { useDispatch } from "react-redux"
import { useParams, useHistory } from "react-router-dom"
import { types } from "../modules/messageTypes"
import Loader from "../components/Loader"
import LoaderData from "../components/LoaderData"

const ModGroup: React.FC = () => {
  const { groupId }: any = useParams()
  const history = useHistory()
  const { data: users, loading: loadUsers } = useQuery(GET_TEACHERS)
  const {
    data: groups,
    loading: loadGroups,
    refetch: refetchGroups,
  } = useQuery(GET_GROUPS)
  const [
    createGroup,
    { data: newGroup, loading: loadCreateGroup, error: errorCreateGroup },
  ] = useMutation(CREATE_GROUP)
  const [
    editGroup,
    { data: editedGroup, loading: loadEditGroup, error: errorEditGroup },
  ] = useMutation(EDIT_GROUP)
  const [deleteGroup, { data: dataDelGroup }] = useMutation(DELETE_GROUP)
  // const [dataGroups, setDataGroups] = useState<IGroup[]>([])
  const dispatch = useDispatch()
  const [form, setForm] = useState([
    {
      param: "name",
      type: "text",
      value: "",
      title: "Назва класу",
      msg: "",
    },
    {
      param: "owner",
      type: "text",
      value: "",
      title: "Керівник класу",
      msg: "",
    },
  ])
  const { changeInput } = useChangeInput()
  const { setErrors } = useSetErrorsFields()

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
    const allDataGroups = groups && groups.getGroups
    if (allDataGroups && groupId) {
      let group: IGroup
      allDataGroups.forEach((item: IGroup) => {
        if (item.id === groupId) {
          group = item
        }
      })
      setForm((prev) =>
        prev.map((field) => {
          let newField = field
          Object.keys(group).forEach((key) => {
            if (field.param === key) {
              newField = {
                ...newField,
                // @ts-ignore
                value: field.param === "owner" ? group[key].id : group[key],
              }
            }
          })
          return newField
        })
      )
    }
  }, [groups, groupId])

  useEffect(() => {
    const createdGroup = newGroup && newGroup.createGroup
    if (errorCreateGroup) {
      setErrors(errorCreateGroup.message, setForm)
      dispatch({
        type: SET_TOAST,
        payload: {
          type: types.error.keyWord,
          message: "Помилка перевірки полів форми!",
        },
      })
    } else if (createdGroup) {
      refetchGroups()
      dispatch({
        type: SET_TOAST,
        payload: {
          type: types.success.keyWord,
          message: "Клас успішно створено!",
        },
      })
    }
  }, [newGroup, errorCreateGroup, setErrors, refetchGroups])

  useEffect(() => {
    const editGroup = editedGroup && editedGroup.editGroup
    if (errorEditGroup) {
      setErrors(errorEditGroup.message, setForm)
      dispatch({
        type: SET_TOAST,
        payload: {
          type: types.error.keyWord,
          message: "Помилка перевірки полів форми!",
        },
      })
    } else if (editGroup) {
      refetchGroups()
      dispatch({
        type: SET_TOAST,
        payload: {
          type: types.success.keyWord,
          message: "Клас успішно відредаговано!",
        },
      })
    }
  }, [editedGroup, errorEditGroup, setErrors, refetchGroups])

  useEffect(() => {
    const dataDeleting = dataDelGroup && dataDelGroup.deleteGroup
    if (dataDeleting) {
      refetchGroups()
      dispatch({ type: SET_TOAST, payload: dataDeleting })
    }
  }, [dispatch, dataDelGroup, refetchGroups])

  const handleDeleteGroup = (groupId: string) => {
    deleteGroup({ variables: { groupId } })
    dispatch({ type: WARNING_CLOSE })
  }

  const groupsJSX =
    groups &&
    groups.getGroups.map((group: IGroup) => {
      return (
        <GroupPreview
          key={group.id}
          deleteGroup={handleDeleteGroup}
          groupId={groupId}
          {...group}
        />
      )
    })

  const handleSubmitForm = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    const [name, owner] = form
    if (groupId) {
      editGroup({
        variables: {
          groupId,
          name: name.value.trim(),
          owner: owner.value.trim(),
        },
      })
    } else {
      createGroup({
        variables: { name: name.value.trim(), owner: owner.value.trim() },
      })
    }
  }

  const handleGoBack = () => {
    history.push("/create-group")
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
          <div className={styles.form__content}>
            <div className={styles.form__title}>
              {groupId && (
                <ButtonTab
                  Icon={BsArrowLeft}
                  click={handleGoBack}
                  exClass={styles.form__btn_back}
                />
              )}
              <div className={styles.form__title_text}>
                {groupId ? "Редагування класу" : "Створення класу"}
              </div>
            </div>
            <form
              className={styles.form__container_fields}
              onSubmit={handleSubmitForm}
            >
              <LoaderData
                load={loadCreateGroup || loadEditGroup || loadUsers}
              />
              <div className={styles.form__fields}>{fields}</div>
              <button className='btn-handler'></button>
              <div className={styles.form__btns}>
                <Button
                  title={groupId ? "Застосувати зміни" : "Створити клас"}
                  exClass={stylesBtn.btn_primary}
                  Icon={groupId ? BsPencil : BsPlus}
                  click={handleSubmitForm}
                  type='button'
                />
                {groupId && (
                  <Button
                    title='Скасувати'
                    exClass={stylesBtn.btn_simple}
                    Icon={BsX}
                    click={handleGoBack}
                    type='button'
                  />
                )}
              </div>
            </form>
            <div className={styles.form__counter}>
              Класи
              {groups ? " (" + groups.getGroups.length + ")" : ""}
            </div>
            <div className={styles.form__container_stack}>
              <div className={styles.form__stack}>
                {loadGroups ? <Loader /> : groupsJSX}
              </div>
            </div>
          </div>
          <div className={styles.form__sidebar}></div>
        </div>
      </div>
    </div>
  )
}

export default ModGroup
