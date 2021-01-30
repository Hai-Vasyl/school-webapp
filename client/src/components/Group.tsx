import React, { useState, useEffect } from "react"
import ButtonTab from "./ButtonTab"
import { BsPencilSquare, BsPlus, BsDash } from "react-icons/bs"
import { RiPushpinLine } from "react-icons/ri"
import { IOwner } from "../interfaces"
import UserCard from "./UserCard"
import { convertDate } from "../helpers/convertDate"
// @ts-ignore
import styles from "../styles/groups.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { Link, useHistory } from "react-router-dom"
import { WARNING_OPEN } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"
import { GET_STUDENTS } from "../fetching/queries"
import { PINUNPIN_STUDENTS_GROUP } from "../fetching/mutations"
import { useLazyQuery, useMutation } from "@apollo/client"
import Button from "./Button"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import useCheck from "../hooks/useCheck"

interface IGroupProps {
  id: string
  name: string
  date: string
  owner: IOwner
  refetchGroups: any
  refetchUnpinedStudents: any
  isPinnedStudents: boolean
  resetIsPinnedStudents(): any
}

const Group: React.FC<IGroupProps> = ({
  id,
  name,
  date,
  owner,
  refetchGroups,
  refetchUnpinedStudents,
  isPinnedStudents,
  resetIsPinnedStudents,
}) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { isInclude } = useCheck()
  const [active, setActive] = useState(false)
  const [
    getStudentsGroup,
    { data: students, loading, refetch: refetchStudents },
  ] = useLazyQuery(GET_STUDENTS)
  const [
    pinUnpinStudentsGroup,
    { data: dataUnpinStudents, loading: loadUnpin },
  ] = useMutation(PINUNPIN_STUDENTS_GROUP)
  const [studentUnpin, setStudentUnpin] = useState<string[]>([])

  useEffect(() => {
    if (isPinnedStudents) {
      refetchStudents && refetchStudents()
      resetIsPinnedStudents()
    }
  }, [isPinnedStudents, resetIsPinnedStudents, refetchStudents])

  useEffect(() => {
    const dataUnpin =
      dataUnpinStudents && dataUnpinStudents.pinUnpinStudentsGroup
    if (dataUnpin) {
      refetchStudents && refetchStudents()
      refetchGroups()
      refetchUnpinedStudents()
      dispatch({ type: SET_TOAST, payload: dataUnpin })
    }
  }, [dispatch, dataUnpinStudents, refetchStudents])

  const handleToggleSection = () => {
    if (!active) {
      getStudentsGroup({ variables: { groupId: id } })
    }
    setActive((prev) => !prev)
  }

  const handleCheck = (studentId: string) => {
    if (isInclude(studentId, studentUnpin)) {
      setStudentUnpin((prev) => [...prev].filter((item) => item !== studentId))
    } else {
      setStudentUnpin((prev) => [...prev, studentId])
    }
  }

  const studentsJSX =
    students &&
    students.getStudentsGroup.map((student: IOwner) => {
      return (
        <UserCard
          key={student.id}
          isEnvChat={false}
          isLink
          user={student}
          minimize
          exClass={styles.group__student}
          check={() => handleCheck(student.id)}
          checked={isInclude(student.id, studentUnpin)}
        />
      )
    })

  const handleUnpinStudentsGroup = () => {
    pinUnpinStudentsGroup({
      variables: { groupId: id, students: studentUnpin, pin: false },
    })
    setStudentUnpin([])
  }

  return (
    <div className={`${styles.group}`}>
      <div className={`${styles.group__header} ${styles.group__header_self}`}>
        <button
          onClick={handleToggleSection}
          className={`${styles.group__name} ${styles.group__btn_section}`}
        >
          {name}
        </button>
        <ButtonTab
          exClass={styles.group__btn_edit}
          click={() => history.push(`/edit-group/${id}`)}
          Icon={BsPencilSquare}
        />
        <ButtonTab
          exClass={styles.group__btn_delete}
          click={handleToggleSection}
          Icon={active ? BsDash : BsPlus}
        />
      </div>
      <div
        className={`${styles.group__details} ${
          active && styles.group__details__open
        }`}
      >
        <div className={styles.group__body}>
          <p className={styles.group__owner_text}>Керівник</p>
          <UserCard isEnvChat={false} isLink={true} user={owner} />
        </div>
        <div className={styles.group__body}>
          <p className={styles.group__owner_text}>
            Учні{students ? " (" + students.getStudentsGroup.length + ")" : ""}
          </p>
          {studentsJSX}
        </div>
      </div>
      <div
        className={`${styles.group__btns_section} ${
          studentUnpin.length && styles.group__btns_section__open
        }`}
      >
        <Button
          exClass={stylesBtn.btn_primary}
          Icon={RiPushpinLine}
          title={`Відкріпити учнів${
            studentUnpin.length ? " (" + studentUnpin.length + ")" : ""
          }`}
          click={handleUnpinStudentsGroup}
        />
      </div>
      <div className={styles.group__footer}>
        <span className={styles.group__date_text}>Останнє оновлення</span>
        <span className={styles.group__date}>{convertDate(date)}</span>
      </div>
    </div>
  )
}

export default Group
