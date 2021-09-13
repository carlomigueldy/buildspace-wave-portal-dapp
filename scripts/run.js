const hre = require("hardhat");

async function main() {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract deployed to: ", waveContract.address);
  console.log("Contract deployed by: ", owner.address);

  let waveCount = await waveContract.getTotalWaves();
  console.log("Total waves 👋: ", waveCount.toString());
  const waveTxn = await waveContract.wave();
  await waveTxn.wait();
  waveCount = await waveContract.getTotalWaves();
  console.log(`User ${owner.address} waved`, waveCount.toString());

  const randomPersonWaveTxn = await waveContract.connect(randomPerson).wave();
  await randomPersonWaveTxn.wait();
  waveCount = await waveContract.getTotalWaves();
  console.log(`User ${randomPerson.address} waved`, waveCount.toString());

  console.log("Total waves 👋: ", waveCount.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
