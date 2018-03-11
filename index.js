'use strict'
import express from "express";
import parser from "body-parser";
import path from "path";
import uuidv4 from "uuid/v4";
import Blockchain from "./blockchain.js";

const app = express();

app.use(parser.json());
app.use(parser.urlencoded( {extended: false} ));

app.use(express.static(path.join(__dirname, 'public')));

let chain = new Blockchain();
let nodeIdentifier = uuidv4().replace('-', '');



app.get('/mine', function(req, res) {
  let lastBlock = chain.getLastBlock();
  let lastProof = lastBlock.proof;
  let proof = chain.proofOfWork(lastProof);

  chain.newTransaction("0", nodeIdentifier, 1);

  let previousHash = chain.hash(lastBlock);
  let block = chain.newBlock(proof, previousHash);

  let response = {
    message: "New Block Forged",
    block: block
  }

  res.send(response);
})

app.post('/transactions/new', function(req, res) {
  let {sender, recipient, amount} = req.body;

  let index = chain.newTransaction(sender, recipient, amount);

  let response = `Transaction will be added to Block ${index}`;

  res.send(response);
})

app.get('/chain', function(req, res) {
  res.send(chain);
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
})