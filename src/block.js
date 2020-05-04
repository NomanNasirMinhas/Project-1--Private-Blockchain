const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {

	constructor(data){
		this.hash = null;                                           // Hash of the block
		this.height = 0;                                            // Block Height (consecutive number of each block)
		this.body = Buffer(JSON.stringify(data)).toString('hex');   // Will contain the transactions stored in the block, by default it will encode the data
		this.time = 0;                                              // Timestamp for the Block creation
		this.previousBlockHash = null;                              // Reference to the previous Block Hash
    }
    
    
    validate() {
        let self = this;
        return new Promise((resolve, reject) => {
            // Save in auxiliary variable the current block hash
            let hash = self.hash;
            self.hash = null;
            // Recalculate the hash of the Block
            let calculated_hash = SHA256(JSON.stringify(self)).toString();
            self.hash = hash;
            // Comparing if the hashes changed
            if (hash == calculated_hash){
                resolve(true);
            }
           else{
                resolve(false);
           }

            // Returning the Block is not valid
            
            // Returning the Block is valid

        });
    }

   
    getBData() {
        let self = this;

        return new Promise((resolve, reject) => {
        // Getting the encoded data saved in the Block
        let encoded_data = self.body;
        // Decoding the data to retrieve the JSON representation of the object
        let decoded_data = hex2ascii(encoded_data);
        // Parse the data to an object to be retrieve.
        let data_object = JSON.parse(decoded_data);

        if (data_object.data == "Genesis Block"){
            resolve(decoded_data);
        }
        else{
            console.log("Error in getBData()");
        }
        // Resolve with the data if the object isn't the Genesis block
    });
    }
}
module.exports.Block = Block;  