const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const SayHelloTo = await hre.ethers.getContractFactory("SayHelloTo");
  const sayHelloTo = await SayHelloTo.deploy();

  await sayHelloTo.deployed();

  console.log(
    `SayHelloTo deployed to ${sayHelloTo.address}`
  );

  const adresses = {
    sayHelloTo: sayHelloTo.address
  }

  fs.writeFile('./examplefrontend/src/adresses.json', JSON.stringify(adresses,null,2), (err) => {
    if (err) throw err;
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
