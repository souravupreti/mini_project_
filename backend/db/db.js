import mongoose from "mongoose";
export const db_conenct=async()=>{
    try {
        const connect=await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, 
        })
        console.log(`DB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.error("Error connecting to DB", error);
        process.exit(1);
        
    }
}