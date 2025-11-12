const mongoose = require('mongoose');
const express = require('express')
const Post = require('../models/upload');
const nodemailer = require('nodemailer')
const mukhiya = require('../models/mukhiya');
const schemes = require('../models/shareScheme')
const User = require('../models/gramin')

const wards = require('../models/ward')
const Router = express().router


Router.get("/mukhyiya-login",(req,res)=>{
    res.render("mukhiya-wardlogin")
})

const verify = (req, res, next) => {
    if (!req.session.userId && ! req.session.password ) {
        return res.redirect("/login");
    }
    next();
};


Router.get("/ward-login",(req,res)=>{
    res.render("ward-login")
})

Router.get("/scheme/:id",verify,async(req,res)=>{
 const info = await mukhiya.findById(req.params.id)
  if(req.session.userId!=info._id){
        return res.send("Acess Denied ❌")
     }
    res.render("dashboard",{info})
})

Router.get("/mukhiyaHome/:id",verify,async(req,res)=>{
    const info = await mukhiya.findById(req.params.id)
    const posts = await Post.find().sort({createdAt:-1})
     if(req.session.userId!=info._id){
        return res.send("Acess Denied ❌")
     }
    res.render("mukhiya-home",{posts,info})
})

Router.get("/wardHome/:ward",verify,async(req,res)=>{
     const info = await wards.findOne({ward:req.params.ward})
        const  posts = await Post.find().sort({createdAt:-1})
         if(req.session.userId!=info._id){
        return res.send("Acess Denied ❌")
     }
    res.render("ward-home",{info,posts})
})




Router.get("/pbRecord",(req,res)=>{
    res.render("ward-record")
})

Router.get("/DashBoard/:id",verify, async(req, res) => {
     const info = await mukhiya.findById(req.params.id);
      if(req.session.userId!=info._id){
        return res.send("Acess Denied ❌")
     }
  res.render("dashboard", {info});
    });


Router.get("/mail-send/:id", async (req, res) => {
      const info = await mukhiya.findById(req.params.id)
       if(req.session.userId!=info._id){
        return res.send("Acess Denied ❌")
     }
    res.render("mail-send",{info});
});



Router.get("/mail-send", async (req, res) => {
    res.render("wardmail");
});



Router.post("/status/:id",verify, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;


    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).send("Post not found");
    }

    console.log("Updated Post:", updatedPost);
    res.send("Status updated successfully ✅");
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).send("Server Error");
  }
});


Router.post("/scheme/:id",verify, async (req, res) => {
  try {
    const { role, name, email, Heading, message } = req.body;

    if (!Heading || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const mukhiyaInfo = await mukhiya.findById(req.params.id);
    if (!mukhiyaInfo) {
      return res.status(404).json({ message: "Mukhiya not found" });
    }

    const newScheme = new schemes({ role, name, email, Heading, message });
    await newScheme.save();

    console.log("Scheme created successfully");

    res.redirect(`/mukhiyaHome/${mukhiyaInfo._id}`);
    // or for API:
    // res.status(201).json({ message: "Scheme created", scheme: newScheme });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


Router.post("/mail-send/:id",verify, async (req, res) => {
    try {
        const {role,from, to, subject, message } = req.body
        const info = await mukhiya.findById(req.params.id)

        console.log(info.name);
         if(req.session.userId!=info._id){
        return res.send("Acess Denied ❌")
     }
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "codewithshivam24@gmail.com",
                pass: "hbgprhwppbfalyac"
            }
        })

        const mail = {
            from: `"${role}" <${from}>`,
            to: to,
            subject: subject,
            html: `<p><b>${message}</b></p>`
        }

        await transporter.sendMail(mail);
        res.redirect(`/mukhiyaHome/${info._id}`)
        // res.status(200).json({
        //     message: "mail send sucessful",
        //     status: "ok"
        // })
    }
    catch (error) {
        res.status(401).json({
            message: "server error Please Try again"
        })
    }
})






Router.post("/mail-send", async (req, res) => {
    try {
        const {role,from, to, subject, message } = req.body

        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "codewithshivam24@gmail.com",
                pass: "hbgprhwppbfalyac"
            }
        })

        const mail = {
            from: `"${role}" <${from}>`,
            to: to,
            subject: subject,
            html: `<p><b>${message}</b></p>`
        }

        await transporter.sendMail(mail);
        // res.redirect(`/mukhiyaHome/${info._id}`)
        res.status(200).json({
            message: "mail send sucessful",
            status: "ok"
        })
    }
    catch (error) {
        res.status(401).json({
            message: "server error Please Try again"
        })
    }
})








Router.post("/mukhyiya-login", async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email,password);
        
        const info = await mukhiya.findOne({ email })
        if (!info) {
            return res.status(201).json({
                message: "please signup now"
            })
        }
        else {
            if (info.password != password) {
                return res.json({
                    message: "email or password is invalid"
                })
            }

            req.session.userId = info._id;
            req.session.password = info.password;
           
             res.redirect(`/mukhiyaHome/${info._id}`);
        }
    }
    catch (error) {
        console.log("server error", error)
        res.status(401).json({
            message: "server error request failed"
        })
    }
})


Router.post("/ward-login", async (req, res) => {
    try {
        const { email,ward, password } = req.body
        console.log(email,password);
        
        const info = await wards.findOne({ email })
        if (!info) {
            return res.status(201).json({
                message: "please signup now"
            })
        }
        else {
            if (info.password != password) {
                return res.json({
                    message: "email or password is invalid"
                })

            }
            if (info.ward != ward) {
                return res.json({
                    message: "ward not match"
                })
           
        }
            req.session.userId = info._id;
            req.session.password = info.password;

        res.redirect(`/wardHome/${info.ward}`);
    }
}
    catch (error) {
        console.log("server error", error)
        res.status(401).json({
            message: "server error request failed"
        })
    }
})




module.exports = Router