const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const qrCode = require("qrcode");
var CryptoJS = require("crypto-js");
const PORT = 5000;
const HOSTNAME = "192.168.3.146";

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
  const ciphertext = CryptoJS.AES.encrypt(data, "s3Cr3T").toString();
  const qrCodeSrc = await qrCode.toDataURL(ciphertext);

  res.render("scan", { qrCode: qrCodeSrc, data, ciphertext });
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`[server] : Server running on http://${HOSTNAME}:${PORT}`);
});
