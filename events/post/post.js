const moment = require("moment");

module.exports.run = async (req, res, fs) => {
  
	if(req.session.loggedin) {
    
		var title = req.body.title;
    var user = req.session.username;
		var post = req.body.post;
		var images = req.files;
    
		if(title && post && images) {
      
			let posts = require("../../json/posts.json");
			posts.unshift({ "title": title, "user": user, "date": moment().format("DD-MM-YYYY"), "post": post, "images": images });
      
			fs.writeFile("./json/posts.json", JSON.stringify(posts), (err) => {
				if(err) console.log(err);
			});
      
			req.session.title = title;
			req.session.post = post;
      req.session.username = user;
			req.session.images = images;

      if(user === process.env.ADMIN) {
        console.log("\x1b[31m", `» (ADMIN) ${user} comitted a new post!`, "\x1b[0m", "");
      } else {
        console.log("\x1b[35m", `» (USER) ${user} committed a new post!`, "\x1b[0m", "");
      }
      
			return res.redirect("/");

		} else {
      return res.send(`<script>setTimeout(() => { window.location.href = "/new" }, 3000);</script>
                <center>Please commit a post!<br>
                Redirecting to /new in 3 seconds...</center>`);
		}
    
	} else {
    return res.send(`<script>setTimeout(() => { window.location.href = "/login" }, 3000);</script>
              <center>Please login before posting!<br>
              Redirecting to /login in 3 seconds...</center>`);
	}
}