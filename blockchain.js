import hash from "hash.js";

let sha256 = hash.sha256;

console.log(sha256().update('abc').digest('hex'));



class Blockchain {
  constructor() {
    this.chain = [];
    this.currentTransactions = [];
  }

  /*
  Create a new Block in the Blockchain
  @param proof {Number} The proof given by the Proof of Work algorithm
  @param previousHash {String} Hash of previous Block
  @return {Object} New Block
  */
  newBlock(proof, previousHash) {

    let block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.currentTransactions,
      proof: proof,
      previous_hash: previousHash, //|| self.hash(self.chain[-1]),
    }

    this.currentTransactions = [];
    this.chain.push(block);

    return block;

  }


  /**
  Creates a new transaction to go into the next mined Block
  @param sender {String} Address of the Sender
  @param recipient {String} Address of the Recipient
  @param amount {Number} Amount
  @return {Number} The index of the Block that will hold this transaction
  */
  newTransaction(sender, recipient, amount) {
    let transaction = {
      sender: sender,
      recipient: recipient,
      amount: amount
    } 
    this.currentTransactions.push(transaction);

    return this.getLastBlock().index + 1

  }

  /*
  Creates a SHA-256 hash of a Block
  @param block {Object} Block
  @return {String}
  */
  hash(block) {

    blockStr = JSON.stringify(block);

    return sha256().update(blockStr).digest('hex')

  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }


  /*
  Simple Proof of Work Algorithm:
   - Find a number p' such that hash(pp') contains leading 4 zeroes, where p is the previous p'
   - p is the previous proof, and p' is the new proof
  @param lastProof {Number}
  @return {Number}
  */
  proofOfWork(lastProof) {
    let proof = 0

    while(!this.validProof(lastProof, proof)) {
      proof++;
    }

    return proof
  }

  /*
  Validates the Proof: Does hash(lastProof, proof) contain 2 trailing zeroes?
  @param lastProof {Number} Previous Proof
  @param proof {number} Current Proof
  @return {Boolean} True if correct, False if not.
  */
  validProof(lastProof, proof) {

  }

}










console.log('test');
console.log(Date.now())


export default Blockchain;