const INFT = artifacts.require("INFT");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  const totalSupploy = BigInt(7235188) * BigInt(1e18);
  _deployer.deploy(INFT, `0x${totalSupploy.toString(16)}`);
  
};
