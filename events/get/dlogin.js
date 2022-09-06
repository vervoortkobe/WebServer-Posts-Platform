module.exports.run = async (req, res, fs) => {
  
  const dlogin = fs.readFileSync("./html/dlogin.html", "utf8");
  
	if(req.session.loggedin) {
		return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
              <center>Please logout before logging in!<br>
              Redirecting to /home in 3 seconds...</center>`);
    
	} else {
		return res.send(dlogin);
	}
}