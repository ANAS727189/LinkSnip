import mongoose from "mongoose";



 const connectDB = () => mongoose.connect('mongodb+srv://anaskhan083:anaskhan083@cluster0.bh9np.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log("Database connected");
})


export {connectDB};

