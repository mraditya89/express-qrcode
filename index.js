require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const qrCode = require("qrcode");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 5000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/scan", async (req, res) => {
  let { body } = req;
  body["T"] = new Date().getTime();

  const data = JSON.stringify(body);
  const secret = "s3Cr3T";
  const token = jwt.sign(body, secret, { expiresIn: "12h" });
  const qrCodeSrc = await qrCode.toDataURL(token);
  res.render("scan", { qrCode: qrCodeSrc, data, token, secret });
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`[server] : Server running on http://${HOSTNAME}:${PORT}`);
});
