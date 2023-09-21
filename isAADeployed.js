const { ethers } = require('ethers');
const fs = require("fs");

const { counterfactualAddress } = require('./accountInfo.json');

const AAContractAddress = counterfactualAddress; 

// Initialize an ethers.js provider with your Ethereum node URL

// const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_URL)


async function isAADeployed() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
    const code = await provider.getCode(AAContractAddress);

    // Check if the code at the contract address is empty (not deployed)
    return code !== '0x';
    
  } catch (error) {
    return false;
  }
}


module.exports={
    isAADeployed

}