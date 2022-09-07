//const fetch = require("node-fetch");

module.exports.run = async (req, res, fs) => {
  
	if(req.session.loggedin) {
		return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
              <center>Please logout before logging in!<br>
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
        
  			if(logins.find(l => l.username === username)) {
  			  if(logins.find(l => l.username === username && l.password === password)) {

            req.session.loggedin = true;
            req.session.username = username;
            req.session.password = password;
            req.session.avatar = `https://web.vervoortkobe.ga/icons/favicon.png`;

            console.log("\x1b[35m", `» (USER) ${username} logged in (DEFAULT)!`, "\x1b[0m", "");
            
            return res.redirect("/");
  				
          } else {
            return res.send(`<script>setTimeout(() => { window.location.href = "/dlogin" }, 3000);</script>
                      <center>You entered an incorrect password!<br>
                      Redirecting to /dlogin in 3 seconds...</center>`);
          }
            
        } else {
          return res.send(`<script>setTimeout(() => { window.location.href = "/register" }, 3000);</script>
                    <center>This username doesn't exist!<br>
                    Redirecting to /register in 3 seconds...</center>`);
        }
      /*}).catch(err => console.log(err));*/
      
		} else {
      return res.send(`<script>setTimeout(() => { window.location.href = "/dlogin" }, 3000);</script>
                <center>Please enter a valid username & password!<br>
                Redirecting to /dlogin in 3 seconds...</center>`);
		}
	}
}