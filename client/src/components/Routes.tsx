import React, { ReactNode } from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import { RootStore } from "../redux/store"
import { IRoute } from "../interfaces"
import { routes } from "../modules/routes"
import { useSelector, useDispatch } from "react-redux"
import { RESET_TOGGLE } from "../redux/toggle/toggleTypes"
import { access } from "../modules/accessModifiers"

const Routes = () => {
  const {
    auth: { user },
    toggle: { dropDown, authForm, notifications, chat },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  const mapReduce = (routes: IRoute[]): ReactNode => {
    return routes.map(({ exact, path, Component }) => {
      return (
        <Route
          key={path}
          exact={exact}
          path={path}
          component={(props: any) => <Component {...props} />}
        />
      )
    })
  }

  const getRoutes = () => {
    switch (user.role) {
      case access.admin.keyWord:
        return mapReduce(routes.admin)
      case access.teacher.keyWord:
        return mapReduce(routes.teacher)
      case access.student.keyWord:
        return mapReduce(routes.student)
      case access.user.keyWord:
        return mapReduce(routes.user)
      default:
        return mapReduce(routes.unregistered)
    }
  }

  return (
    <>
      <div
        className={`background ${
          (dropDown || authForm || notifications || chat) &&
          "background--active"
        }`}
        onClick={() => dispatch({ type: RESET_TOGGLE })}
      ></div>
      <Switch>
        {getRoutes()}
        <Redirect to='/' />
      </Switch>
    </>
  )
}

export default Routes
