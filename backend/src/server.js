import  express from "express"
import dotenv from "dotenv"
import  cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from './routes/authRoute.js'
import userRoutes from './routes/userRoute.js'
import chatRoutes from './routes/chatRoute.js'
import { connectDB } from "./lib/db.js";

// import cors from "cors";
const app = express()
dotenv.config();

app.use(cors(
  {
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  }   
));


const PORT = process.env.PORT || 3000 

app.use(express.json());
app.use(cookieParser()); 

app.use("/api/auth",authRoutes) 
app.use("/api/users",userRoutes )  

app.use("/api/chat", chatRoutes ) 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB();
})





