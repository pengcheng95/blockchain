'use strict'
import express from "express";
import parser from "body-parser";
import path from "path";
import blockchain from "./blockchain.js";

const app = express();

app.use(parser.json());
app.use(parser.urlencoded( {extended: false} ));

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;



app.listen(port, () => {
	console.log(`App listening on port ${port}`);
})