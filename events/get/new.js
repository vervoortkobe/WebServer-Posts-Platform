module.exports.run = async (req, res, fs) => {
  
  const newpost = fs.readFileSync("./html/new.html", "utf8");
  
	if(req.session.loggedin) {
		return res.send(`${newpost}`);
    
	} else {
		return res.send(`<script>setTimeout(() => { window.location.href = "/login" }, 3000);</script>
              <center>Please login before posting!<br>
              Redirecting to /login in 3 seconds...</center>`);
	}
}