import express from "express";
import dotenv from "dotenv";
import * as DropboxSign from "@dropbox/sign";
const app = express();
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const PORT = process.env.PORT || 3000;

console.log(path.join(__dirname, "/index.html"));
const signatureRequestApi = new DropboxSign.SignatureRequestApi();

// Configure HTTP basic authorization: api_key
signatureRequestApi.username = process.env.API_KEY;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/sign", (req, res) => {
  const signer1 = {
    emailAddress: "inaolaji406@gmail.com",
    name: "Jack",
    order: 0,
  };

  const signer2 = {
    emailAddress: "jill@example.com",
    name: "Jill",
    order: 1,
  };

  const signingOptions = {
    draw: true,
    type: true,
    upload: true,
    phone: false,
    defaultType: "draw",
  };

  const fieldOptions = {
    dateFormat: "DD - MM - YYYY",
  };

  // Upload a local file
  const file = fs.createReadStream("client_proposal.pdf");
//   console.log(file);
  // or, upload from buffer
  //   const fileBuffer = {
  //     value: fs.readFileSync("example_signature_request.pdf"),
  //     options: {
  //       filename: "example_signature_request.pdf",
  //       contentType: "application/pdf",
  //     },
  //   };

  //   // or, upload from buffer alternative
  //   const fileBufferAlt = {
  //     value: Buffer.from("abc-123"),
  //     options: {
  //       filename: "txt-sample.txt",
  //       contentType: "text/plain",
  //     },
  //   };
  //   files: [file, fileBuffer, fileBufferAlt],
  const data = {
    title: "Devaladdin with Acme Co.",
    subject: "The Ecommerce website we talked about",
    message:
      "Please sign this Ecommerce website and then we can discuss more. Let me know if you have any questions.",
    signers: [signer1],
    ccEmailAddresses: ["lawyer1@dropboxsign.com", "lawyer2@example.com"],
    files: [file],
    metadata: {
      custom_id: 1234,
      custom_text: "NDA #9",
    },
    signingOptions,
    fieldOptions,
    testMode: true,
  };

  const result = signatureRequestApi.signatureRequestSend(data);
  result
    .then((response) => {
      console.log(response.body);
    //   res.send("successfull");
    })
    .catch((error) => {
      console.log("Exception when calling Dropbox Sign API:");
    //   res.send("Failed: ", error.body);
      console.log(error.body);
    });
});

app.get("/checksignature", (req, res) => {
  const signatureRequestId = "e4df6589418b3cdec7629d4bd216f1fbe90e3f48";

  const result = signatureRequestApi.signatureRequestGet(signatureRequestId);
  result
    .then((response) => {
      console.log(response.body);
    })
    .catch((error) => {
      console.log("Exception when calling Dropbox Sign API:");
      console.log(error.body);
    });
  res.json(result);
});

app.listen(PORT, () => console.log("connected on port 8000"));
