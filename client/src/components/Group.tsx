import React, { useState } from "react"
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
import { useLazyQuery } from "@apollo/client"
import Button from "./Button"

interface IGroupProps {
  id: string
  name: string
  date: string
  owner: IOwner
}

const Group: React.FC<IGroupProps> = ({ id, name, date, owner }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [active, setActive] = useState(false)
  const [getStudentsGroup, { data: students, loading }] = useLazyQuery(
    GET_STUDENTS
  )
  const [studentUnpin, setStudentUnpin] = useState<string[]>([])

  const handleToggleSection = () => {
    if (!active) {
      getStudentsGroup({ variables: { groupId: id } })
    }
    setActive((prev) => !prev)
  }

  const isCheckedStudent = (studentId: string) => {
    let isChecked = false
    studentUnpin.forEach((item) => {
      if (item === studentId) {
        isChecked = true
      }
    })
    return isChecked
  }

  const handleCheck = (studentId: string) => {
    if (isCheckedStudent(studentId)) {
      setStudentUnpin((prev) => [...prev].filter((item) => item !== studentId))
    } else {
      setStudentUnpin((prev) => [...prev, studentId])
    }
  }

  console.log({ studentUnpin })
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
          checked={isCheckedStudent(student.id)}
        />
      )
    })

  const handleUnpinStudentsGroup = () => {
    console.log("UNPIN")
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
            studentUnpin ? " (" + studentUnpin.length + ")" : ""
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
