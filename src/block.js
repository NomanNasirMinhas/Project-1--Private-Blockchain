/*
This class defines chararcteristics of a block
 */

const SHA256 = require("crypto-js/sha256");
const hex2ascii = require("hex2ascii");

class Block {
  // Constructor - argument data will be the object containing the transaction data
  constructor(data) {
    this.hash = null; 
    this.height = 0; 
    this.body = Buffer(JSON.stringify(data)).toString("hex"); 
    this.time = 0; 
    this.previousBlockHash = null; 
  }

  /*
The validate() method will validate if the block has been tampered or not.
Been tampered means that someone from outside the application tried to change values in the block data as a consequence the hash of the block should be different.
Steps:
- Return a new promise to allow the method be called asynchronous.
- Create an auxiliary variable and store the current hash of the block in it (this represent the block object)
- Recalculate the hash of the entire block (Use SHA256 from crypto-js library)
- Compare if the auxiliary hash value is different from the calculated one.
- Resolve true or false depending if it is valid or not.
   */

   validate() {
    let self = this;
    return new Promise((resolve) => {
      curHash = this.hash;
      const recalculatedHash = SHA256(JSON.stringify(this)).toString();
      resolve(curHash === recalculatedHash);
    });
  }


  getBData() {
/*
Auxiliary Method to return the data stored in the body of the block but decoded.
Steps:
- Use hex2ascii module to decode the data
- Because data is a javascript object use JSON.parse(string) to get the Javascript Object
- Resolve with the data and make sure that you don't need to return the data for the genesis block or Reject with an error.
*/
    return new Promise((resolve, reject) => {
      if (!this.previousBlockHash) {
        reject(null);
      }
      const decodedData = JSON.parse(hex2ascii(this.body));
      resolve(decodedData);
    });
  }
}

module.exports.Block = Block; 
