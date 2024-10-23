process.env.NODE_ENV || require("dotenv").config();

const express = require("express");
const cors = require("cors");
const router = require("./routes");

const whitelist = ["*", "http://localhost:8080"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback({ code: 401, message: "CORS not allowed" });
    }
  },
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions), router);
const port = process.env.PORT || 8080;
const host = "0.0.0.0";

app.listen(port, host, () => console.log(`Server listening on port ${port}`));
