import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js'
import errorHandler from './middleware/error.js';

dotenv.config();
const app = express();
app.use(cors({
  origin: "https://mern-auth-system-dzly.onrender.com",
  credentials: true,
}));
app.use(express.json());

connectDB();

app.use("/api/user", authRoute);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


