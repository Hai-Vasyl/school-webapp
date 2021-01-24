import React from "react"

interface IUserAvaProps {
  color: string
  ava: string
  firstname?: string
  lastname?: string
}

const UserAva: React.FC<IUserAvaProps> = ({
  color,
  ava,
  firstname,
  lastname,
}) => {
  if (ava && ava.length) {
    return <img className='avatar' src={ava} alt='userAva' />
  }
  return (
    <span className='avatar' style={{ backgroundColor: color }}>
      <span className='avatar__firstname'>
        {firstname && firstname.slice(0, 1)}
      </span>
      <span className='avatar__lastname'>
        {lastname && lastname.slice(0, 1)}
      </span>
    </span>
  )
}

export default UserAva
