import { Group } from "../models"
import { IIsAuth, IField } from "../interfaces"

export const Query = {
  async getGroups(_: any, __: IField, { isAuth }: { isAuth: IIsAuth }) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: validation for each field and check in models
      const groups = await Group.find()
      return groups
    } catch (error) {
      throw new Error(`Getting all groups error: ${error.message}`)
    }
  },
}

export const Mutation = {
  async createGroup(
    _: any,
    { owner, name }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: validation for each field and check in models

      if (!name.length) {
        throw new Error(
          JSON.stringify({
            name: {
              value: name,
              msg: ["Це поле не може бути порожнім!"],
            },
          })
        )
      }

      const group = new Group({
        owner,
        name,
        date: new Date(),
      })
      const newGroup = await group.save()

      return newGroup
    } catch (error) {
      throw new Error(error.message)
    }
  },
  async editGroup(
    _: any,
    { groupId, owner, name }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: validation for each field and check in models

      if (!name.length) {
        throw new Error(
          JSON.stringify({
            name: {
              value: name,
              msg: ["Це поле не може бути порожнім!"],
            },
          })
        )
      }

      await Group.updateOne({ _id: groupId }, { owner, name, date: new Date() })
      const changedGroup = await Group.findById(groupId)
      return changedGroup
    } catch (error) {
      throw new Error(error.message)
    }
  },
}
