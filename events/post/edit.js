module.exports.run = async (req, res, fs) => {

  delete require.cache[require.resolve("../../json/posts.json")];
  let posts = require("../../json/posts.json");
  
	if(req.session.loggedin) {
  
    var user = req.session.username;
    var id = req.body.id;
    var title = req.body.title;
    var post = req.body.post;
    
    if(id && title && post) {

      //ADMIN
      if(user === process.env.ADMIN) {

        let p = posts.find(p => p.images[0].filename === id);
        if(p) {
  
          let objIndex = posts.findIndex(p => p.images[0].filename == id);

          let postsSync = JSON.parse(fs.readFileSync("./json/posts.json", "utf-8"));
          
          postsSync[objIndex] = {
            title: title,
            user: postsSync.find(p => p.images[0].filename === id).user,
            date: postsSync.find(p => p.images[0].filename === id).date,
            post: post,
            images: [
              {
                fieldname: postsSync.find(p => p.images[0].filename === id).images[0].fieldname,
                originalname: postsSync.find(p => p.images[0].filename === id).images[0].originalname,
                encoding: postsSync.find(p => p.images[0].filename === id).images[0].encoding,
                mimetype: postsSync.find(p => p.images[0].filename === id).images[0].mimetype,
                destination: postsSync.find(p => p.images[0].filename === id).images[0].destination,
                filename: postsSync.find(p => p.images[0].filename === id).images[0].filename,
                path: postsSync.find(p => p.images[0].filename === id).images[0].path,
                size: postsSync.find(p => p.images[0].filename === id).images[0].size
              }
            ]
          }
        
          fs.writeFile("./json/posts.json", JSON.stringify(postsSync), (err) => {
            if(err) console.log("err writing");
          });
  
          req.session.title = title;
          req.session.post = post;
          req.session.username = user;
      
          console.log("\x1b[31m", `» (ADMIN) ${user} edited a post (${id})!`, "\x1b[0m", "");
      
          return res.redirect(`/#${id}`);

        } else {
          return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
                    <center>A post with id ${id} doesn't exist!<br>
                    Redirecting to /home in 3 seconds...</center>`);
        }
        
      } else {
        //USER

        let p = posts.find(p => p.user === user);
        if(p) {
          if(p.images[0].filename === id) {
  
            let objIndex = posts.findIndex(p => p.images[0].filename == id);
  
            let postsSync = JSON.parse(fs.readFileSync("./json/posts.json", "utf-8"));
            
            postsSync[objIndex] = {
          		title: title,
          		user: postsSync.find(p => p.images[0].filename === id).user,
          		date: postsSync.find(p => p.images[0].filename === id).date,
          		post: post,
          		images: [
          			{
          				fieldname: postsSync.find(p => p.images[0].filename === id).images[0].fieldname,
          				originalname: postsSync.find(p => p.images[0].filename === id).images[0].originalname,
          				encoding: postsSync.find(p => p.images[0].filename === id).images[0].encoding,
          				mimetype: postsSync.find(p => p.images[0].filename === id).images[0].mimetype,
          				destination: postsSync.find(p => p.images[0].filename === id).images[0].destination,
          				filename: postsSync.find(p => p.images[0].filename === id).images[0].filename,
          				path: postsSync.find(p => p.images[0].filename === id).images[0].path,
          				size: postsSync.find(p => p.images[0].filename === id).images[0].size
          			}
          		]
          	}
          
            fs.writeFile("./json/posts.json", JSON.stringify(postsSync), (err) => {
              if(err) console.log("err writing");
            });
    
            req.session.title = title;
            req.session.post = post;
            req.session.username = user;
        
            console.log("\x1b[35m", `» (USER) ${user} edited a post (${id})!`, "\x1b[0m", "");
        
            return res.redirect(`/#${id}`);
  
          } else {
            return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
                      <center>A post with id ${id} doesn't exist!<br>
                      Redirecting to /home in 3 seconds...</center>`);
          }
  
        } else {
          return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
                    <center>${user} doesn't have access to manage this post!<br>
                    Redirecting to /home in 3 seconds...</center>`);
        }
      }
      
    } else {
      return res.send(`<script>setTimeout(() => { window.location.href = "/" }, 3000);</script>
                 <center>Not all needed params were provided!<br>
                 Redirecting to /home in 3 seconds...</center>`);
 		}
        
  } else {
    return res.send(`<script>setTimeout(() => { window.location.href = "/login" }, 3000);</script>
              <center>Please login before posting!<br>
              Redirecting to /login in 3 seconds...</center>`);
  }
}