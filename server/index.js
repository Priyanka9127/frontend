import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js'; // Imported
import employeeRouter from './routes/employee.js'; // Imported
import salaryRouter from './routes/salary.js'; // Imported
import leaveRouter from './routes/leave.js'
import settingRouter from './routes/setting.js'
import attendanceRouter from './routes/attendance.js'
import dashboardRouter from './routes/dashboard.js'
import connectToDatabase from './db/db.js';
import dotenv from 'dotenv';

dotenv.config();
connectToDatabase();

const app = express();

app.use(cors(
    {
    origin: 'http://localhost:5173', // allow frontend access
    credentials: true               // if using cookies or auth headers
}

));
app.use(express.json());
app.use(express.static('public/uploads')); 
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter); 
app.use('/api/employee', employeeRouter); 
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/setting', settingRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/dashboard', dashboardRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
export default app;