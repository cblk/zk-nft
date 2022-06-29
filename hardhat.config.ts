require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");
import "@nomiclabs/hardhat-ethers";
import {PRIVATE_KEY, INFURA_KEY} from "./config";

module.exports = {
    zksolc: {
        version: "0.1.0",
        compilerSource: "docker",
        settings: {
            optimizer: {
                enabled: true,
            },
            experimental: {
                dockerImage: "matterlabs/zksolc",
            },
        },
    },
    zkSyncDeploy: {
        zkSyncNetwork: "https://zksync2-testnet.zksync.dev",
        ethNetwork: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    },
    networks: {
        hardhat: {
            zksync: true,
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
            accounts: [PRIVATE_KEY]
        },
    },
    solidity: {
        version: "0.8.10",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            },
            outputSelection: {
                '*': {
                    '*': ['storageLayout']
                }
            }
        }
    },
};
