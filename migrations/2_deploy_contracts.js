//const ConvertLib = artifacts.require("ConvertLib");
//const MetaCoin = artifacts.require("MetaCoin");
const Dapp = artifacts.require("Dapp");
module.exports = function(deployer) {
  deployer.deploy(Dapp,1);
  //deployer.link(ConvertLib, MetaCoin);
  //deployer.deploy(MetaCoin);
};
