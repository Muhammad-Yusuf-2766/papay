const dotenv = require("dotenv");
dotenv.config();


const http = require("http");
const mongoose = require("mongoose").default;

const connectionString = process.env.MONGO_URL;
mongoose.set('strictQuery', false)
// mongooseni yangi versiyasida connect qilib oldim. eski connect usuli bsohqacha.
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
  // console.log(mongoose);
  const app = require("./app");
  const server = http.createServer(app);
  let PORT = process.env.PORT || 3003;
  server.listen(PORT, function () {
    console.log(
      `The Server is running successfully on port ${PORT}, http://localhost:${PORT}`
    );
  });
})
.catch((err) => {
  console.log("Error on connection MongoDB: ", err);
});