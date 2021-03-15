const express = require("express")
const { ApolloServer, PubSub } = require("apollo-server-express")

// import { ApolloServer, PubSub } from "apollo-server"
import mongoose from "mongoose"
import { config } from "dotenv"
import isAuth from "./context/isAuth"
import schema from "./schema"
import cors from "cors"

config()
const { PORT, MONGO_USER, MONGO_PASS, MONGO_DB, NODE_ENV } = process.env
const isDev = NODE_ENV === "development"

;(async () => {
  try {
    const app = express()
    app.use(cors())

    await mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.osxef.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      () => console.log("MongoDB started successfully!")
    )

    const pubsub = new PubSub()

    // const server = new ApolloServer({
    //   typeDefs,
    //   resolvers,
    // });

    const server = new ApolloServer({
      ...schema,
      playground: isDev,
      context: ({ req, res }: { req: any; res: any }) => ({
        req,
        res,
        pubsub,
        isAuth: isAuth(req),
      }),
    })
    server.applyMiddleware({ app })

    if (NODE_ENV === "production") {
      app.use(express.static("dist/client"))
    }

    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`)
    })

    // server.listen({ port: PORT }).then(({ url }) => {
    //   console.log(`Server started on url: ${url}`)
    // })
  } catch (error) {
    console.error(`Server error: ${error.message}`)
  }
})()
