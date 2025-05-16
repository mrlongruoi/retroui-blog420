import mongoose from "mongoose";

export const ConnectDB = async () =>{
    await mongoose.connect('mongodb+srv://mrlong01012020:phamlong92@cluster0.qqfvp0f.mongodb.net/?retryWrites=true&w=majority');
    console.log("DB Connected");
}