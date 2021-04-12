import React from "react"

interface IUserAvaProps {
  color: string
  ava: string
  firstname?: string
  lastname?: string
  large?: boolean
  middle?: boolean
}

const UserAva: React.FC<IUserAvaProps> = ({
  color,
  ava,
  firstname,
  lastname,
  middle,
  large,
}) => {
  if (ava && ava.length) {
    return <img className='avatar' src={ava} alt='userAva' />
  }
  return (
    <span
      className={`avatar ${middle && "avatar__middle"} ${
        large && "avatar__large"
      }`}
      style={{ backgroundColor: color }}
    >
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
