const fetch = require("node-fetch");

async function getJSONRes(body) {
	let fullBody = "";

	for await (const data of body) {
		fullBody += data.toString();
	}
	return JSON.parse(fullBody);
}

module.exports.run = async (req, res, fs) => {
  
	if(req.session.loggedin) {
		return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
              <center>Please logout before logging in!<br>
              Redirecting to /home in 3 seconds...</center>`);
    
	} else {

		var code = req.query.code;

  	if(!code) {
      return res.redirect("/");
    }
  
  	if (code) {
  		try {
  			const tokenResData = await fetch("https://discord.com/api/oauth2/token", {
  				method: "POST",
  				body: new URLSearchParams({
  					client_id: process.env.DISCORD_OAUTH2_CLIENTID,
  					client_secret: process.env.DISCORD_OAUTH2_CLIENTSECRET,
  					code,
  					grant_type: "authorization_code",
  					redirect_uri: process.env.DISCORD_OAUTH2_REDIRECT_URI,
  					scope: "identify",
  				}),
  				headers: {
  					"Content-Type": "application/x-www-form-urlencoded",
  				},
  			});

        if(tokenResData.statusCode === 401) {
          return res.send(`<script>setTimeout(() => { window.location.href = "/dlogin" }, 3000);</script>
                    <center>Please enter a valid username & password!<br>
                    Redirecting to /dlogin in 3 seconds...</center>`);
        }
  
  			const oauthData = await getJSONRes(tokenResData.body);
        console.log(oauthData);
  			
  			const userResult = await fetch("https://discord.com/api/users/@me", {
  				headers: {
  					authorization: `${oauthData.token_type} ${oauthData.access_token}`,
  				},
  			});
  
  			await getJSONRes(userResult.body).then(body => {
  				console.log(body);

  				req.session.loggedin = true;
          req.session.username = `${body.username}#${body.discriminator}`;
          req.session.avatar = `https://cdn.discordapp.com/avatars/${body.id}/${body.avatar}.png?size=128`;
          
  				return res.redirect("/");
  			});
        
  		} catch(err) {
        console.log(err);
      }
  	}
  }
}