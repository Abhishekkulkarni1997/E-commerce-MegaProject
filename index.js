import mongoose from "mongoose";
import app from "./app.js";

import config from "./config/index.js";

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URL);
    console.log("DB Connected successfully");

    app.on("error", (err) => {
      console.log("Error ", err);
      throw err;
    });

    const onListening = () => {
      console.log(`listening on ${config.PORT}`);
    };

    app.listen(config.PORT, onListening);
  } catch (error) {
    console.log("ERROR", error);
    throw error;
  }
})();
