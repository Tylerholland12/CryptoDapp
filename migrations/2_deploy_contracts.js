const Token = artifacts.require("Token");
const CryptoDapp = artifacts.require("CryptoDapp");

// make sure to use `async`
// `await  does not work other wise
module.exports = async function(deployer) {
  // Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  // Deploy CryptoDapp to ETH network
  await deployer.deploy(CryptoDapp, token.address);
  const cryptoDapp = await CryptoDapp.deployed()

  // Transfer all tokens to CryptoDapp (1 million)
  await token.transfer(cryptoDapp.address, '1000000000000000000000000')
};
