const mongoose = require("mongoose");

const connectDatabase=()=>{
   mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then((con) => console.log(`Database connected: ${con.connection.host}`))
  .catch((e) => console.log(e));
}
module.exports=connectDatabase;
