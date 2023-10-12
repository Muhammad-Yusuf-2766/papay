console.log("Web Serverni boshlaymiz")
// modullarni install va chaqirish
const express = require("express");
const app = express();

// MongoDB chaqirish
const db = require("./server").db();
const mongodb = require("mongodb");

// 1: Kirish code
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// 2: Session code

// 3. Views kodlar
app.set("views", "views");
app.set("view engine", "ejs");

// Routing code

module.exports = app;