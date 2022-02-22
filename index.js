require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const qrCode = require("qrcode");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 5000;
const HOSTNAME = process.env.HOSTNAME || "localhost";
const secret = "s3Cr3T";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/scan", async (req, res) => {
  let { body } = req;
  body["T"] = Math.round(new Date().getTime() / 1000);
  body["Wi"] = +body["Wi"];
  body["E"] = +body["E"];
  body["id"] = +body["id"];

  const data = JSON.stringify(body);

  const token = jwt.sign(body, secret, { expiresIn: "12h" });
  const qrCodeSrc = await qrCode.toDataURL(JSON.stringify(token), {
    errorCorrectionLevel: "L",
  });
  res.render("scan", { qrCode: qrCodeSrc, data, token, secret });
});

app.get("/jwt-parse", async (req, res) => {
  try {
    let { query } = req;
    const decoded = await jwt.verify(query.token, secret);
    return res.send({ result: decoded });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`[server] : Server running on http://${HOSTNAME}:${PORT}`);
});
