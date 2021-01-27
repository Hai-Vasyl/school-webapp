import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import { RootStore } from "../redux/store"
import { IRoute } from "../interfaces"
import { routes } from "../modules/routes"
import { useSelector, useDispatch } from "react-redux"
import { RESET_TOGGLE } from "../redux/toggle/toggleTypes"
import { access } from "../modules/accessModifiers"
import Navbar from "./Navbar"
import Auth from "./Auth"
import Warning from "./Warning"
import Chat from "./Chat"
import Notifications from "./Notifications"

const Routes = () => {
  const {
    auth: { user },
    toggle: {
      dropDown,
      authForm,
      notifications,
      chat,
      warning: { toggle: warnToggle },
    },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  // TODO: BUG ROUTES
  // const mapReduce = (routes: IRoute[]): ReactNode => {
  //   return routes.map(({ exact, path, Component }) => {
  //     return (
  //       <Route
  //         key={path}
  //         exact={exact}
  //         path={path}
  //         component={(props: any) => <Component {...props} />}
  //       />
  //     )
  //   })
  // }

  const mapReduce = (routes: IRoute[]) => {
    return routes.map((route) => {
      return <Route key={route.path} {...route} component={route.Component} />
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
      <Navbar />
      <Auth />
      <Warning />
      {/* <Chat /> */}
      <Notifications />
      <div
        className={`background ${
          (dropDown || authForm || notifications || chat || warnToggle) &&
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
