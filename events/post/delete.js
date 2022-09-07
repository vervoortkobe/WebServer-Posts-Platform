module.exports.run = async (req, res, fs) => {

  delete require.cache[require.resolve("../../json/posts.json")];
  let posts = require("../../json/posts.json");
  
	if(req.session.loggedin) {

    var user = req.session.username;
    var id = req.params.id;
    
    if(id) {
      
      //ADMIN
      if(user === process.env.ADMIN) {
        
        let p = posts.find(p => p.images[0].filename === id);
        if(p) {
  
          posts = posts.filter(p => {
            return p.images[0].filename !== id;
          });
  
          
          fs.writeFile("./json/posts.json", JSON.stringify(posts), (err) => {
            if(err) console.log(err);
          });
          
          fs.unlink(`./uploads/${id}.png`, (err) => {
            if(err) console.log(err);
          });
      
          console.log("\x1b[31m", `» (ADMIN) ${user} deleted a post (${id})!`, "\x1b[0m", "");
      
          return res.redirect("/");
  
        } else {
          return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
                    <center>${user} doesn't have access to manage this post!<br>
                    Redirecting to /home in 3 seconds...</center>`);
        }
        
      } else {
        //USER
        
        let p = posts.find(p => user === p.user);
        if(p) {
  
          posts = posts.filter(p => {
            return p.images[0].filename !== id;
          });
  
          
          fs.writeFile("./json/posts.json", JSON.stringify(posts), (err) => {
            if(err) console.log(err);
          });
          
          fs.unlink(`./uploads/${id}.png`, (err) => {
            if(err) console.log(err);
          });
      
          console.log("\x1b[35m", `» (USER) ${user} deleted a post (${id})!`, "\x1b[0m", "");
      
          return res.redirect("/");
  
        } else {
          return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
                    <center>${user} doesn't have access to manage this post!<br>
                    Redirecting to /home in 3 seconds...</center>`);
        }
      }
    
    } else {
      return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
                <center>Please provide a valid id param!<br>
                Redirecting to /home in 3 seconds...</center>`);
    }
        
  } else {
    return res.send(`<script>setTimeout(() => { window.location.href = "/dlogin" }, 3000);</script>
              <center>Please login before deleting!<br>
              Redirecting to /dlogin in 3 seconds...</center>`);
  }
}