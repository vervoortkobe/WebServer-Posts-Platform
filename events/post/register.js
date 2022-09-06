const fetch = require("node-fetch");

module.exports.run = async (req, res, fs) => {
  
	if(req.session.loggedin) {
    return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
              <center>Please logout before registering!<br>
              Redirecting to /home in 3 seconds...</center>`);
    
	} else {
    
		var username = req.body.username;
		var password = req.body.password;
    
		if(username && password) {
      let logins = require("../../json/logins.json");
      
      /*fetch(`https://web.vervoortkobe.ga/json/logins.json?user=${process.env.ADMIN}`)
      .then(data => data.json())
      .then(logins => {*/
        //console.log(logins);
      
        if(logins.length === 0) {
          
          logins.push({ "username": username, "password": password });
          fs.writeFile("./json/logins.json", JSON.stringify(logins), (err) => {
            if(err) console.log("err writing");
          });
          
          req.session.loggedin = true;
          req.session.username = username;
          req.session.password = password;
          var user = req.session.username;
  
          console.log("\x1b[35m", `» (USER) ${user} registered (DEFAULT)!`, "\x1b[0m", "");
          
          return res.redirect("/");
        }
        
  			if(logins.find(l => l.username === username)) {
          res.send(`<script>setTimeout(() => { window.location.href = "/register" }, 3000);</script>
                    <center>Another user already has this username!<br>
                    Redirecting to /register in 3 seconds...</center>`);
          
        } else {
          logins.push({ "username": username, "password": password });
          
          fs.writeFile("./json/logins.json", JSON.stringify(logins), (err) => {
            if(err) console.log(err);
          });
          
          req.session.loggedin = true;
          req.session.username = username;
          req.session.password = password;
          var user = req.session.username;

          console.log("\x1b[35m", `» (USER) ${user} registered (DEFAULT)!`, "\x1b[0m", "");
          
          return res.redirect("/");
        }
			/*}).catch(err => console.log(err));*/
      
		} else {
      return res.send(`<script>setTimeout(() => { window.location.href = "/register" }, 3000);</script>
                <center>Please enter a valid username & password!<br>
                Redirecting to /register in 3 seconds...</center>`);
		}
	}
}