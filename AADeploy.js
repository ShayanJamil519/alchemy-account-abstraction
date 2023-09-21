const { createSigner } = require("./createSigner");
const fs = require("fs");



async function createAccountAddress() {
  try {
    const signer = await createSigner();
    const address = await signer.account.getAddress();

    let data = {};
    data["address"] = address;

    fs.writeFileSync("./accountInfo.json", JSON.stringify(data, null, 2));

    return address
  } catch (error) {
    return error;
  }
}



module.exports ={

    createAccountAddress

}