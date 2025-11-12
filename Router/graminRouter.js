const mongoose = require('mongoose');
const User = require('../models/gramin');
const Post = require('../models/upload');
const express = require('express');
const bcrypt = require('bcrypt');
const schemes = require('../models/shareScheme')
// const Status = require('../models/status');
const session = require('express-session')

const Router = express.Router();



// --- Views ---
Router.get("/", (req, res) => res.render("index"));
Router.get("/register", (req, res) => res.render("register"));
Router.get("/login", (req, res) => res.render("gramin-login"));


// --- Register ---
Router.post("/register", async (req, res) => {
    try {
        const { name, email, password, ward, village } = req.body;
        const info = await User.findOne({ email });
        if (info) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, village, ward, password });
        await newUser.save();

        res.redirect("/login");
    } catch (error) {
        console.error("Server error", error);
        return res.status(500).json({ message: "Server error. Request failed" });
    }
});

// --- Login ---
Router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const info = await User.findOne({ email });

        if (!info) {
            return res.status(400).json({ message: "Please sign up first" });
        }

        // const isMatch = await bcrypt.compare(password, info.password);
        if (info.password!=password) {
            return res.status(400).json({ message: "Email or password is invalid" });
        }

        // Save session
        req.session.userId = info._id;
        req.session.password = info.password;
        req.session.name = info.name;

        res.redirect(`/home/${info._id}`);
    } catch (error) {
        console.error("Server error", error);
        res.status(500).json({ message: "Server error. Request failed" });
    }
});


const verify = (req, res, next) => {
    if (!req.session.userId && ! req.session.password ) {
        return res.redirect("/login");
    }
    next();
};


// Router.get("/graminDashBoard/:id", verify, (req, res) => {
//     res.render("gramin-record");
// });

Router.get("/graminDashBoard/:id",verify, async(req, res) => {
     const info = await User.findById(req.params.id);
     const  posts = await Post.find({userId:req.params.id}).sort({createdAt:-1})

     if(req.session.userId!=info._id){
        return res.send("Acess Denied ❌")
     }
     
  res.render("gramin-record", {info,posts});
    });

Router.get("/home/:id",verify, async (req, res) => {
  const info = await User.findById(req.params.id);
  const posts = await schemes.find().sort({createdAt:-1})
  
     if(req.session.userId!=info._id){
        return res.send("Acess Denied ❌")
     }
     
  res.render("graminDataShow", {info, posts });
});


Router.get("/postProblem/:id",verify, async (req, res) => {
  const info = await User.findById(req.params.id);
  
     if(req.session.userId!=info._id){
        return res.send("Acess Denied ❌")
     }
     
  res.render("gramin-problem", { info });
});


Router.post("/postProblem/:id",verify, async (req, res) => {
    try {
        const { userId, name, email, ward, village, problem } = req.body;
        const info = await User.findById(req.params.id);

        if (!info) {
            return res.status(404).json({ message: "User not found" });
        }

     if(req.session.userId!=info._id){
        return res.send("Acess Denied ❌")
     }
     
        const newPost = new Post({ userId, name, email, village, ward, problem });
       
        await newPost.save();
    

        res.redirect(`/graminDashBoard/${info._id}`);
    } catch (error) {
        console.error("Server error", error);
        return res.status(500).json({ message: "Server error. Request failed" });
    }
});

module.exports = Router;
