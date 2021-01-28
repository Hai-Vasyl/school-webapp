import React from "react"
import Title from "../components/Title"
import { GET_GROUPS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { useHistory } from "react-router-dom"
import { RiPushpin2Line } from "react-icons/ri"
import ButtonTab from "../components/ButtonTab"
// @ts-ignore
import styles from "../styles/form.module"
import Group from "../components/Group"
import { IGroup } from "../interfaces"
import Loader from "../components/Loader"

const Groups: React.FC = () => {
  const hostory = useHistory()
  const {
    data: groups,
    loading: loadGroups,
    refetch: refetchGroups,
  } = useQuery(GET_GROUPS)

  const groupsJSX =
    groups &&
    groups.getGroups.map((group: IGroup) => {
      return <Group key={group.id} {...group} />
    })

  return (
    <div className='container'>
      <Title title='Список класів' />
      <div className='wrapper'>
        <div className={styles.form}>
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
          <div className={styles.form__sidebar}>
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
