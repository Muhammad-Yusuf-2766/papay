console.log("Web Serverni boshlaymiz")
// modullarni install va chaqirish
const express = require("express");
const app = express();
const router = require("./router")
const router_bssr = require("./router_bssr")
const cors = require('cors')

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
    uri:process.env.MONGO_URL,
    collection:"sessions",
});
const cookieParser = require ('cookie-parser')

// // MongoDB chaqirish:  mongoose orqali chaqirganim uchun bu usulni o'chirib qo'ydim.
// const db = require("./server").db();
// const mongodb = require("mongodb");

// 1: Kirish code
app.use(express.static('public'));
app.use("/uploads", express.static(__dirname + '/uploads'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    credentials: true,
    origin: true
}))
app.use(cookieParser())

// 2: Session code
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 30, // for 30 minutes
        },
        store: store,
        resave: true,          // bu user har browserga kirganda sessionning vaqtini yangilashlik uchun
        saveUninitialized: true,
    })
);

app.use(function(req, res, next){
    res.locals.member = req.session.member;
    next(); 
})

// 3. Views kodlar
app.set("views", "views");
app.set("view engine", "ejs");

// Routing code
app.use("/resto", router_bssr);
app.use("/", router);

module.exports = app;