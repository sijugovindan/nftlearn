const Migrations = artifacts.require("RastrSalesMarketplace.sol");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};