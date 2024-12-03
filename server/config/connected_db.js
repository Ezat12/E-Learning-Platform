const mongoose = require("mongoose");

const connectedDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((res) => {
      console.log(`connected data base `);
    })
    .catch((e) => {
      console.log("Error Data Base");
    });
};

module.exports = connectedDB;
