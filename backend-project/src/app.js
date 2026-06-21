import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from './utils/passport.js'
import  session  from 'express-session'
import { User } from './models/user.models.js'

const app = express()



// basic config of express app
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

//cors config
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH' ,'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
///google auth
app.use(session({
  secret: process.env.ACCESS_TOKEN_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});


//importing routes
import  healthCheckRouter  from './routes/healthcheck.route.js'
import authRouter from "./routes/authUser.route.js"
import projectRouter from "./routes/projects.routes.js"
import dashboardRoutes from "./routes/dashboard.route.js";
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/dashboard", dashboardRoutes);
// tasks routes
import taskRoutes from "./routes/task.route.js"
app.use("/api/v1/tasks", taskRoutes)
// workspace routes
import workspaceRoutes from "./routes/workspace.route.js"
app.use("/api/v1/workspace", workspaceRoutes)

///api/v1/healthcheck is also known as home route

app.get("/", (req, res)=>{
    res.send("Welcome to project manager")

})

export default app;