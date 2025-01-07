import mongoose from "mongoose";
import { promise } from "zod";

type ConnectionObject ={
    isConnected?:number;
}

const connection : ConnectionObject={};

async function dbConnect():Promise<void>{
          if(connection.isConnected){
            console.log("Alerady connected to the database")
            return
          };

          try {
              const db = await mongoose.connect(process.env.MONGODB_URI || "",{})

              connection.isConnected = db.connections[0].readyState;

              console.log("Database Connected Successfully")
          } catch (error) {
            
            console.error('Database connection failed:', error);
            process.exit(1)
          }
}


export default dbConnect;