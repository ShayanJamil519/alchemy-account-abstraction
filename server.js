const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { createSigner } = require("./createSigner");
const fs = require("fs");
const { parseEther } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { createWalletClient, http } = require("viem");
const { sepolia } = require("viem/chains");
const { counterfactualAddress } = require("./accountInfo.json");
const { isAADeployed } = require("./isAADeployed");
const { createAccountAddress } = require("./AADeploy");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/generate_wallet", async (req, res) => {
  try {
    const signer = await createSigner();
    const counterfactualAddress = await signer.account.getAddress();

    let data = {};
    data["counterfactualAddress"] = counterfactualAddress;

    fs.writeFileSync("./accountInfo.json", JSON.stringify(data, null, 2));

    res.json({ counterfactualAddress });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/exec_trx", async (req, res) => {
  try {
    const PRIV_KEY = process.env.PRIV_KEY;
    const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;

    const account = privateKeyToAccount(`0x${PRIV_KEY}`);

    const wallet = createWalletClient({
      account: account,
      chain: sepolia,
      transport: http(ALCHEMY_API_URL),
    });

    // Check if the AA wallet has been deployed
    const _isAADeployed = await isAADeployed();

    if (_isAADeployed) {
      const address = await createAccountAddress();

      const txHash = await wallet.sendTransaction({
        to: address,
        value: parseEther("0.0001"),
      });

      return  res.json({ transactionHash: txHash });
    }

    const txHash = await wallet.sendTransaction({
      to: counterfactualAddress,
      value: parseEther("0.0001"),
    });

    res.json({ transactionHash: txHash });
  } catch (error) {
    // console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const server = app.listen(5000, () => {
  console.log(`Server is working on PORT: 5000`);
});
