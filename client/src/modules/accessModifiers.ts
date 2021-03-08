import { FaUserCog, FaUserTie, FaUser } from "react-icons/fa"

export const access = {
  admin: {
    keyWord: "admin",
    title: "Адміністратор",
    Icon: FaUserCog,
  },
  teacher: {
    keyWord: "teacher",
    title: "Вчитель",
    Icon: FaUserTie,
  },
  user: {
    title: "Користувач",
    keyWord: "user",
  },
  unregistered: {
    keyWord: "unregistered",
  },
}

export const getUserAccess = (role: string) => {
  const users = Object.keys(access)
  for (let i = 0; i < users.length; i++) {
    if (users[i] === role) {
      // @ts-ignore
      return access[users[i]]
    }
  }
}
