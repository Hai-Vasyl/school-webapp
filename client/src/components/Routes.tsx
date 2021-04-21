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
// import Chat from "./Chat"
import ImageMod from "./ImageMod"
// import Notifications from "./Notifications"
import ImageLightBox from "./ImageLightBox"
import ImageLightBoxLight from "./ImageLightBoxLight"
import { ChatWidget } from "@papercups-io/chat-widget"

const Routes = () => {
  const {
    auth: { user },
    toggle: {
      dropDown,
      authForm,
      notifications,
      chat,
      menuPage,
      warning: { toggle: warnToggle },
      modImage: { toggle: modImageToggle },
      lightbox: { toggle: lightboxToggle },
      lightboxlight: { toggle: lightboxlightToggle },
      navbar,
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
      default:
        return mapReduce(routes.unregistered)
    }
  }

  return (
    <>
      <Navbar />
      <Auth />
      <Warning />
      <ImageMod />
      <ImageLightBox />
      <ImageLightBoxLight />
      <ChatWidget
        accountId={process.env.REACT_APP_PAPERCUP_ACCOUTID || ""}
        title='Ліцей 45 ЛМР'
        subtitle='Ласкаво просимо до чату'
        primaryColor='#005aa9'
        greeting='Запитайте що-небудь 😊'
        awayMessage=''
        newMessagePlaceholder='Написати питання...'
        showAgentAvailability={false}
        agentAvailableText="We're online right now!"
        agentUnavailableText="We're away at the moment."
        requireEmailUpfront={false}
        iconVariant='outlined'
        baseUrl='https://app.papercups.io'
      />
      {/* <Chat /> */}
      {/* <Notifications /> */}
      <div
        className={`background ${
          (dropDown ||
            authForm ||
            notifications ||
            chat ||
            warnToggle ||
            modImageToggle ||
            lightboxToggle ||
            lightboxlightToggle ||
            navbar) &&
          "background--active"
        } ${(lightboxToggle || lightboxlightToggle) && "background--over"}`}
        onClick={() => dispatch({ type: RESET_TOGGLE })}
      ></div>
      <div
        onClick={() => dispatch({ type: RESET_TOGGLE })}
        className={`background background-light ${
          menuPage && "background--active"
        }`}
      ></div>
      <Switch>
        {getRoutes()}
        <Redirect to='/' />
      </Switch>
    </>
  )
}

export default Routes
