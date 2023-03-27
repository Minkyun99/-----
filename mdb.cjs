const mongoose = require("mongoose");
const Vschema = require("./schema.cjs");

// 상위(root)에 .env안에 작성하기.
const USER = process.env.mdbid;
const PWD = process.env.mdbpwd;

const DB = "admin";
const HOST = "127.0.0.1:27017"; // localhost로는 접속이 불가.

const mongodbURL = `mongodb://${USER}:${PWD}@${HOST}/${DB}`;

// mongoose.set('useFindAndModify, false)  // MongoDB 버전 6부터는 자동관리라 제외. 책에 나오는 내용.
mongoose.set("strictQuery", false); // MongoDB 버전 6부터 변경사항.
mongoose
  .connect(mongodbURL, { useNewUrlParser: true })
  .then(() =>
    console.log("몽고DB 접속 완료. \n몽구스 스키마 로드 완료. \n쿼리 대기중.")
  )
  .catch((e) => console.error(e));
module.exports = Vschema;
