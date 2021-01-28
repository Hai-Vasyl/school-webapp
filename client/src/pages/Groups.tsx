import React, { useState, useEffect } from "react"
import Title from "../components/Title"
import { GET_GROUPS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { useHistory } from "react-router-dom"
import { RiPushpin2Line } from "react-icons/ri"
import ButtonTab from "../components/ButtonTab"
// @ts-ignore
import styles from "../styles/form.module"
// @ts-ignore
import stylesGroups from "../styles/groups.module"
import Group from "../components/Group"
import { IGroup, IOwner } from "../interfaces"
import { GET_STUDENTS_NOGROUP } from "../fetching/queries"
import Loader from "../components/Loader"
import UserCard from "../components/UserCard"
import LoaderData from "../components/LoaderData"
import Button from "../components/Button"
import FieldPicker from "../components/FieldPicker"
import useCheck from "../hooks/useCheck"

const Groups: React.FC = () => {
  const history = useHistory()
  const {
    data: groups,
    loading: loadGroups,
    refetch: refetchGroups,
  } = useQuery(GET_GROUPS)
  const {
    data: students,
    loading: loadStudents,
    refetch: refetchStudents,
  } = useQuery(GET_STUDENTS_NOGROUP)
  const [form, setForm] = useState([
    { title: "Список класів", param: "groups", msg: "", value: "" },
  ])
  const [studentUnpin, setStudentUnpin] = useState<string[]>([])
  const { isInclude } = useCheck()

  useEffect(() => {
    const groupsData = groups && groups.getGroups
    if (groupsData) {
      setForm((prevForm) =>
        prevForm.map((field) => {
          if (field.param === "groups") {
            return {
              ...field,
              value: groupsData[0].id,
            }
          }
          return field
        })
      )
    }
  }, [groups])

  const groupsJSX =
    groups &&
    groups.getGroups.map((group: IGroup) => {
      return <Group key={group.id} {...group} refetchGroups={refetchGroups} />
    })

  const options = groups
    ? groups.getGroups.map((group: IGroup) => {
        return { label: group.name, value: group.id }
      })
    : []

  const handleCheck = (studentId: string) => {
    if (isInclude(studentId, studentUnpin)) {
      setStudentUnpin((prev) => [...prev].filter((item) => item !== studentId))
    } else {
      setStudentUnpin((prev) => [...prev, studentId])
    }
  }

  const studentsJSX =
    students &&
    students.getStudentsNoGroup.map((student: IOwner) => {
      return (
        <UserCard
          isEnvChat={false}
          key={student.id}
          isLink
          user={student}
          check={() => handleCheck(student.id)}
          checked={isInclude(student.id, studentUnpin)}
          exClass={stylesGroups.group__student_extend}
        />
      )
    })

  console.log({ studentUnpin })
  return (
    <div className='container'>
      <Title title='Список класів' />
      <div className='wrapper'>
        <div className={`${styles.form} ${styles.form__extend}`}>
          <div className={styles.form__content}>
            <div className={styles.form__title}>
              <div className={styles.form__title_text}>
                Перелік класів та їх учнів
              </div>
            </div>
            <div className={styles.form__container_stack}>
              <div className={styles.form__stack}>
                {loadGroups ? <Loader /> : groupsJSX}
              </div>
            </div>
          </div>
          <div className={styles.form__content}>
            <div className={styles.form__title}>
              <div className={styles.form__title_text}>
                Список учнів, які не належать класу
              </div>
            </div>
            <form className={styles.form__container_fields}>
              <LoaderData load={loadGroups} />
              <div className={styles.form__fields}>
                <FieldPicker
                  field={form[0]}
                  change={setForm}
                  options={options}
                />
              </div>
            </form>
            <div className={styles.form__counter}>
              Учні
              {students ? " (" + students.getStudentsNoGroup.length + ")" : ""}
            </div>
            <div className={styles.form__container_stack}>
              <div className={styles.form__stack}>
                {loadStudents ? <Loader /> : studentsJSX}
              </div>
            </div>
            <div>
              <RiPushpin2Line />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Groups
