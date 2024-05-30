import express, { json, urlencoded, Request } from "express"
import swaggerUi from "swagger-ui-express"
import { RegisterRoutes } from "../routes"
import mapper from "mybatis-mapper";
import cors from 'cors';

export const app = express()

// init mapper
mapper.createMapper([
  'query/userRead.xml', 'query/userWrite.xml',
]);

const allowedOrigins = [];
if (process.env.NODE_ENV == 'development') {
}
else if (process.env.NODE_ENV == 'stage') {
  allowedOrigins.push('https:/stage.com');
}
else if (process.env.NODE_ENV == 'production') {
  // allowedOrigins.push('https://production.com');
}

if (allowedOrigins.length > 0) {
  const _corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
  };
  app.use(cors<Request>(_corsOptions));
}
else {
  app.use(cors({credentials: true, origin: true}))
}

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
)
app.use(json())
app.use(express.static("public"))

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
)

RegisterRoutes(app)