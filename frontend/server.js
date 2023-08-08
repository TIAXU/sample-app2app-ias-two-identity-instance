const xsenv = require("@sap/xsenv");
const IAS = xsenv.getServices({ myIas: { label: "identity" } }).myIas;

const axios = require("axios");
const express = require("express");
const app = express();

app.listen(process.env.PORT);

app.get("/homepage", async (req, res) => {
  const jwtToken = await _fetchJwtToken();
  const result = await _callBackend(jwtToken);
  res.send(`<h3>Response from backend:</h3><p>${result}</p>`);
});

async function _fetchJwtToken() {
  const options = {
    method: "POST",
    url: `${IAS.url}/oauth2/token?grant_type=client_credentials&client_id=${IAS.clientid}&resource=urn:sap:identity:application:provider:name:homepage`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(IAS.clientid + ":" + IAS.clientsecret).toString("base64"),
    },
  };
  const response = await axios(options);
  return response.data.access_token;
}

async function _callBackend(token) {
  const options = {
    method: "GET",
    url: "https://backendapp-tia-2-instance.cfapps.eu12.hana.ondemand.com/endpoint",
    headers: {
      Accept: "application/json",
      Authorization: "bearer " + token,
    },
  };
  const response = await axios(options);
  return response.data;
}
