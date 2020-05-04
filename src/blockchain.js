
const SHA256 = require("crypto-js/sha256");
const BlockClass = require("./block.js");
const bitcoinMessage = require("bitcoinjs-message");

//The Blockchain class contain the basics functions to create your own private blockchain
class Blockchain {

  constructor() {
    this.chain = [];
    this.height = -1;
    this.initializeChain();
  }

  
   async initializeChain() {
    if (this.height === -1) {
      let block = new BlockClass.Block({ data: "Genesis Block" });
      await this._addBlock(block);
    }
  }

  getChainHeight() {
    return new Promise((resolve, reject) => {
      resolve(this.height);
    });
  }

  /**
   * Utility method that return UTC timestamp
   */
  getUTCTimeStamp() {
    return new Date().getTime().toString().slice(0, -3);
  }


  _addBlock(block) {
    let self = this;
    return new Promise(async (resolve, reject) => {
      try {
        const newHeight = this.height + 1;

        block.height = newHeight;
        block.time = this.getUTCTimeStamp();

        if (newHeight > 0) {
          const previousBlockHash = await this.getBlockByHeight(this.height);
          block.previousBlockHash = previousBlockHash.hash;
        }

        block.hash = SHA256(JSON.stringify(block)).toString();
        this.chain.push(block);
        this.height = newHeight;
        resolve(block);
      } catch (e) {
        reject(e);
      }
    });
  }


  requestMessageOwnershipVerification(address) {
    return new Promise((resolve) => {
      resolve(`${address}:${this.getUTCTimeStamp()}:starRegistry`);
    });
  }


  submitStar(address, message, signature, star) {
    let self = this;
    return new Promise(async (resolve, reject) => {
        let message_time = parseInt(message.split(':')[1]);
        console.log(message_time);
        let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
        console.log(currentTime - message_time);
        if ((currentTime - message_time) <= (60*5)){
            if (bitcoinMessage.verify(message, address, signature)){
                 let block = new BlockClass.Block({data: {"star":star,"owner":address}});
                 await this._addBlock(block);
                 resolve(block);
            }
            else{
                reject(error);
            }
        }
        else{
           reject(error);
        }

    });
}


  getBlockByHash(hash) {
    let self = this;
    return new Promise((resolve, reject) => {
      const theBlock = this.chain.find((block) => hash === block.hash);

      if (!theBlock) {
        reject(new Error("Block not found with the given hash: " + hash));
        resolve(theBlock);
      }
    });
  }


  getBlockByHeight(height) {
    let self = this;
    return new Promise((resolve, reject) => {
      let block = self.chain.filter((p) => p.height === height)[0];
      if (block) {
        resolve(block);
      } else {
        resolve(null);
      }
    });
  }


  getStarsByWalletAddress(address) {
    let self = this;
    let stars = [];
    return new Promise((resolve, reject) => {
      this.chain.forEach(async (block) => {
        const data = await block.getBData();
        if (data && data.owner === address) {
          stars.push(data);
        }
      });
      resolve(stars);
    });
  }


  validateChain() {
    let self = this;
    let errorLog = [];
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < this.chain.length; i++) {
        const curBlock = this.chain[i];
        if (!(await curBlock.validate())) {
          errorLog.push({
            error: "Validation failed",
            block: curBlock,
          });
        }

        if (i === 0) {
          continue;
        }

        const prevBlock = this.chain[i - 1];
        if (curBlock.previousBlockHash !== prevBlock.hash) {
          errorLog.push({
            error: "Previous block does not match",
            block: curBlock,
          });
        }
      }
      resolve(errorLog);
    });
  }
}

module.exports.Blockchain = Blockchain;
