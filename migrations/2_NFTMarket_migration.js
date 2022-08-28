const Migrations = artifacts.require("NFTMarket.sol");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};