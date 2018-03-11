import hash from "hash.js";
import axios from "axios";

let sha256 = hash.sha256;


class Blockchain {
  constructor() {
    this.chain = [];
    this.currentTransactions = [];

    this.nodes = new Set();

    this.newBlock(100, 1);
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
      previousHash: previousHash, //|| self.hash(self.chain[-1]),
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

    let blockStr = JSON.stringify(block);

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
  Validates the Proof: Does hash(lastProof, proof) contain 3 leading zeroes?
  @param lastProof {Number} Previous Proof
  @param proof {number} Current Proof
  @return {Boolean} True if correct, False if not.
  */
  validProof(lastProof, proof) {
    let guess = `${lastProof}${proof}`;
    let guessHash = sha256().update(guess).digest('hex');
    return guessHash.substring(0,3) === '000';
  }

  registerNode(address) {
    this.nodes.add(address);
    console.log(this.nodes);
  }

  validChain(chain) {
    let lastBlock = this.chain[0];
    let idx = 1;

    while (idx < chain.length) {
      let block = chain[idx];

      if (block.previousHash !== this.hash(lastBlock)) {
        return false;
      }

      if (!this.validProof(lastBlock.proof, block.proof)) {
        return false;
      }

      lastBlock = block;
      idx++;
    }

    return true;
  }

  /*
  This is our Consensus Algorithm, it resolves conflicts by replacing our chain with the longest one in the network.
  @return {Boolean} True if our chain was replaced, False if not
  */
  resolveConflicts() {
    let newChain;
    let maxLength = this.chain.length;

    async function testNodes() {
      for (let node of this.nodes) {
        console.log('node: ', node, `${node}/chain`);
        let response = await axios.get(`${node}/chain`);

        let chain = response.chain;

        if (chain.length > maxLength && this.validChain(chain)) {
          maxLength = chain.length;
          newChain = chain;
        }
      }
      if (newChain) {
        this.chain = newChain;
        return true;
      }

      return false;
    }

    return testNodes();

  }


}





export default Blockchain;