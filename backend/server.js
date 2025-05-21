import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/db.js";
import complaintRoutes from "./Routes/complaint.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors);

app.use('/api',complaintRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

dbConnect();
