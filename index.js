const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const fs = require("fs");
const session = require("express-session");
//const bodyParser = require("body-parser");
const path = require("path");
const moment = require("moment");
const multer  = require("multer")
const upload = multer({ dest: "uploads/" });
require("dotenv").config();
process.env.PORT = 80;

const app = express();

app.use(session({
	secret: process.env.EXPRESS_APP_SESSIONSECRET,
	resave: true,
	saveUninitialized: true
}));

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static("public"));

fs.readdir("./events/get/", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("\x1b[31m", "❌  I couldn't find the events folder!");
    console.log("\x1b[0m", "");
    return;
  }
   
  jsfile.forEach((f, i) => {
    let props = require(`./events/get/${f}`);
    console.log("\x1b[0m", `• get/${f} was loaded!`);
  });
});

fs.readdir("./events/post/", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("\x1b[31m", "❌  I couldn't find the events folder!");
    console.log("\x1b[0m", "");
    return;
  }
   
  jsfile.forEach((f, i) => {
    let props = require(`./events/post/${f}`);
    console.log("\x1b[0m", `• post/${f} was loaded!`);
  });
});

app.get("/", (req, res) => {
  
  let eventfile = require("./events/get/home.js");
  if(eventfile) eventfile.run(req, res, fs);
  
  let stats = require("./json/stats.json");
  stats.views += 1;
  
  fs.writeFile("./json/stats.json", JSON.stringify(stats), (err) => {
    if(err) console.log("err writing");
  });
});

app.get("/home", (req, res) => {
  res.redirect("/");
});

app.get("/ping", (req, res) => {
  let eventfile = require("./events/get/ping.js");
  if(eventfile) eventfile.run(req, res, fs);
});

//BOOTSTRAP DIR HOST
let bootstraps = fs.readdirSync("./bootstrap-5.1.3-dist/css/themes/", { withFileTypes: true });
bootstraps.forEach(b => {
  app.get(`/bootstrap-5.1.3-dist/css/themes/${encodeURI(`${b.name}`)}`, (req, res) => {
    res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/css/themes/${decodeURI(`${b.name}`)}`);
  });
});

//BOOTSTRAP JS
app.get("/bootstrap-5.1.3-dist/js/bootstrap.min.js", (req, res) => {
  res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/js/bootstrap.min.js`);
});

//BOOTSTRAP JS MAP
app.get("/bootstrap-5.1.3-dist/js/bootstrap.min.js.map", (req, res) => {
  res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/js/bootstrap.min.js.map`);
});

//ICONS DIR HOST
let icons = fs.readdirSync("./icons/", { withFileTypes: true });
icons.forEach(i => {
  app.get(`/icons/${encodeURI(`${i.name}`)}`, (req, res) => {
    res.sendFile(path.join(__dirname + `/icons/${decodeURI(`${i.name}`)}`));
  });
});

app.get("/login", function(req, res) {
  let eventfile = require("./events/get/login.js")
  if(eventfile) eventfile.run(req, res, fs);
});

app.post("/auth", (req, res) => {
  let eventfile = require("./events/post/auth.js")
  if(eventfile) eventfile.run(req, res, fs);
});

app.get("/dlogin", function(req, res) {
  let eventfile = require("./events/get/dlogin.js")
  if(eventfile) eventfile.run(req, res, fs);
});

app.get("/dauth", function(req, res) {
  let eventfile = require("./events/get/dauth.js")
  if(eventfile) eventfile.run(req, res, fs);
});

/*app.get("/json/logins.json", (req, res) => {
  if(!req.query.user) return res.json({"error": "no user query included"});
  if(req.query.user === process.env.ADMIN) {
    res.sendFile(`${__dirname}/json/logins.json`);
  } else {
    return res.json({"error": "incorrect user query included"});
  }
});*/

app.get("/register", function(req, res) {
  let eventfile = require("./events/get/register.js")
  if(eventfile) eventfile.run(req, res, fs);
});

app.post("/register", (req, res) => {
  let eventfile = require("./events/post/register.js")
  if(eventfile) eventfile.run(req, res, fs);
});

app.get("/new", (req, res) => {
  let eventfile = require("./events/get/new.js")
  if(eventfile) eventfile.run(req, res, fs);
});

app.get("/manage/:id", async (req, res) => {
  let eventfile = require("./events/get/manage.js")
  if(eventfile) eventfile.run(req, res, fs);
});

app.post("/manage/edit", (req, res) => {
  let eventfile = require("./events/post/edit.js")
  if(eventfile) eventfile.run(req, res, fs);
});

app.post("/delete/:id", (req, res) => {
  let eventfile = require("./events/post/delete.js")
  if(eventfile) eventfile.run(req, res, fs);
});

app.post("/logout", (req, res) => {
  let eventfile = require("./events/post/logout.js")
  if(eventfile) eventfile.run(req, res, fs);
});

//UPLOAD VIA MULTER
app.post("/post", upload.array("images", 1), async (req, res) => {
  let eventfile = require("./events/post/post.js")
  if(eventfile) eventfile.run(req, res, fs);
});

//UPLOADS DIR HOST
let uploads = fs.readdirSync("./uploads/", { withFileTypes: true });
uploads.forEach(u => {
  app.get(`/uploads/${encodeURI(`${u.name}`)}`, (req, res) => {
	  res.sendFile(`${__dirname}/uploads/${decodeURI(`${u.name}`)}`);
  });
});

//UPLOADS AUTO UPLOAD ON WRITE
fs.watch("./uploads", (eventType, fileName) => {
	//console.log(eventType);
	//console.log(fileName);

  if(!fileName.endsWith(".png")) {
    fs.rename(`./uploads/${fileName}`, `./uploads/${fileName}.png`, (err) => {
  		//if(err) console.log("err writing");
    });
  }

	let uploads = fs.readdirSync("./uploads/", { withFileTypes: true });
	uploads.forEach(u => {
		app.get(`/uploads/${encodeURI(`${u.name}`)}`, (req, res) => {
			res.sendFile(`${__dirname}/uploads/${decodeURI(`${u.name}`)}`);
		});
	});
});

//LISTENER
const listener = app.listen(process.env.PORT, () => {
  function eventsReady() {
    let jsfilecount = 0;
    fs.readdir("./events/get/", (err, files) => {
      let jsfile = files.filter(f => f.split(".").pop() === "js");
      jsfilecount += jsfile.length;
    });
    fs.readdir("./events/post/", (err, files) => {
      let jsfile = files.filter(f => f.split(".").pop() === "js");
      jsfilecount += jsfile.length;
    });
    setTimeout(() => {
      console.log("\x1b[36m", `» Loaded Events: ${jsfilecount}`);
      //console.log("\x1b[0m", "");
    }, 100);
  }
  
  function bootstrapReady() {
    let bsfilecount = 0;
    fs.readdir("./bootstrap-5.1.3-dist/css/themes", (err, files) => {
      let bsfile = files.filter(f => f.split(".").pop() === "css");
      bsfilecount += bsfile.length;
    });
    setTimeout(() => {
      console.log("\x1b[36m", `» Loaded Bootstrap: ${bsfilecount}`);
      //console.log("\x1b[0m", "");
    }, 100);
  }

  function iconsReady() {
    let ifilecount = 0;
    fs.readdir("./icons/", (err, files) => {
      let ifile = files.filter(f => f.split(".").pop() === "png");
      ifilecount += ifile.length;
    });
    setTimeout(() => {
      console.log("\x1b[36m", `» Loaded Icons: ${ifilecount}`);
      console.log("\x1b[0m", "");
    }, 100);
  }
  
  function appReady() {
    console.log("\x1b[32m", `✔️  Your app is listening on port ${listener.address().port}!`, "\x1b[0m", "");
  }

  eventsReady();
  bootstrapReady();
  iconsReady();
  setTimeout(appReady, 500);
});