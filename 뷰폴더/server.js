require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const app = express();
const port = 3000;
const path = require("path");
const _path = path.join(__dirname, "./dist/");
const VSchema = require("./mdb.cjs");

app.use("/", express.static(_path));
app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/dbc", (req, res) => {
  const topo = req.body.topo;
  const weightD = req.body.weightD;
  const weightS = req.body.weightS;
  const info = req.body.info;
  const meta = req.body.meta;

  (async () => {
    const _data = { topo, weightD, weightS, info, meta };
    const vs = await new VSchema(_data);
    const t = await vs.save();
    console.log(t); // 확인용.
    res.send("생성 완료.");
  })();
});
app.post("/dbr", (req, res) => {
  (async () => {
    const t = await VSchema.find({})
      .lean()
      .then((t) => {
        res.send(t);
        console.log(t); // 확인용.
      });
  })();
});
app.listen(port, () => {
  console.log(port + "서버 동작 완료.");
});
