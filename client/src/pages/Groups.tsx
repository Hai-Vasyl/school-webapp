import React, { useState, useEffect } from "react"
import Title from "../components/Title"
import { GET_GROUPS } from "../fetching/queries"
import { useQuery, useMutation } from "@apollo/client"
import { RiPushpin2Line } from "react-icons/ri"
// @ts-ignore
import styles from "../styles/form.module"
// @ts-ignore
import stylesGroups from "../styles/groups.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import Group from "../components/Group"
import { IGroup, IOwner } from "../interfaces"
import { GET_STUDENTS_NOGROUP } from "../fetching/queries"
import Loader from "../components/Loader"
import UserCard from "../components/UserCard"
import LoaderData from "../components/LoaderData"
import Button from "../components/Button"
import FieldPicker from "../components/FieldPicker"
import useCheck from "../hooks/useCheck"
import { PINUNPIN_STUDENTS_GROUP } from "../fetching/mutations"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import { useDispatch } from "react-redux"

const Groups: React.FC = () => {
  const dispatch = useDispatch()
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
  const [
    pinUnpinStudentsGroup,
    { data: dataPinStudents, loading: loadPin },
  ] = useMutation(PINUNPIN_STUDENTS_GROUP)
  const [form, setForm] = useState([
    { title: "Список класів", param: "groups", msg: "", value: "" },
  ])
  const [studentPin, setStudentPin] = useState<string[]>([])
  const [isPinnedStudents, setIsPinnedStudents] = useState(false)
  const { isInclude } = useCheck()

  const resetIsPinnedStudents = () => {
    setIsPinnedStudents(false)
  }

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

  useEffect(() => {
    const dataPin = dataPinStudents && dataPinStudents.pinUnpinStudentsGroup
    if (dataPin) {
      refetchGroups()
      refetchStudents()
      setIsPinnedStudents(true)
      dispatch({ type: SET_TOAST, payload: dataPin })
    }
  }, [dispatch, dataPinStudents, refetchStudents])

  const groupsJSX =
    groups &&
    groups.getGroups.map((group: IGroup) => {
      return (
        <Group
          key={group.id}
          {...group}
          isPinnedStudents={form[0].value === group.id && isPinnedStudents}
          refetchUnpinedStudents={refetchStudents}
          refetchGroups={refetchGroups}
          resetIsPinnedStudents={resetIsPinnedStudents}
        />
      )
    })

  const options = groups
    ? groups.getGroups.map((group: IGroup) => {
        return { label: group.name, value: group.id }
      })
    : []

  const handleCheck = (studentId: string) => {
    if (isInclude(studentId, studentPin)) {
      setStudentPin((prev) => [...prev].filter((item) => item !== studentId))
    } else {
      setStudentPin((prev) => [...prev, studentId])
    }
  }

  const handlePinStudentsGroup = () => {
    const [group] = form
    pinUnpinStudentsGroup({
      variables: { groupId: group.value, students: studentPin, pin: true },
    })
    setStudentPin([])
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
          checked={isInclude(student.id, studentPin)}
          exClass={stylesGroups.group__student_extend}
        />
      )
    })

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
            <div className={stylesGroups.group__container_stack}>
              <div
                className={`${styles.form__container_stack} ${stylesGroups.group__stack}`}
              >
                {loadStudents ? <Loader /> : studentsJSX}
              </div>
              <div
                className={`${styles.form__btns} ${stylesGroups.group__btns} ${
                  studentPin.length && stylesGroups.group__btns__open
                }`}
              >
                <Button
                  exClass={stylesBtn.btn_primary}
                  Icon={RiPushpin2Line}
                  title={`Долучити учнів${
                    studentPin.length ? " (" + studentPin.length + ")" : ""
                  }`}
                  click={handlePinStudentsGroup}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Groups
