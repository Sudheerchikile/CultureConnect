import  express from "express"
import dotenv from "dotenv"
import  cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from './routes/authRoute.js'
import userRoutes from './routes/userRoute.js'
import chatRoutes from './routes/chatRoute.js'
import { connectDB } from "./lib/db.js";

import path from "path"
import { fileURLToPath } from "url"

// import cors from "cors";
const app = express()

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

app.use(cors(
  {
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both possible Vite ports
    credentials: true, // Allow cookies to be sent with requests
  }   
));


const PORT = process.env.PORT || 3000 

app.use(express.json());
app.use(cookieParser()); 

app.use("/api/auth",authRoutes) 
app.use("/api/users",userRoutes )  

app.use("/api/chat", chatRoutes ) 

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"..", 'frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "..", 'frontend', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB();
})





