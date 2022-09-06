module.exports.run = async (req, res, fs) => {

  delete require.cache[require.resolve("../../json/posts.json")];
  let posts = require("../../json/posts.json");
  let xposts = "";
      
  if(posts.length === 0) xposts = "No posts yet...";

  const home_head = fs.readFileSync("./html/home_head.html");

//LOGGED IN
  if(req.session.loggedin) {
  
    var user = req.session.username;
    
    //ADMIN
    if(user === process.env.ADMIN) {

      console.log("\x1b[31m", `» (ADMIN) ${user} visited /!`, "\x1b[0m", "");
      
      posts.forEach(p => {
        let ximages = "";
        
        p.images.forEach(i => {
          ximages = ximages.concat(`<a href="/${i.path}.png" target="_blank"><img src="/${i.path}.png" style="max-width: 600px; height: auto; border: 1px solid black; border-radius: 10px;"></a>`);
          xposts = xposts.concat(`<br><div data-aos="fade-down" id="${i.filename}" class="alert alert-dismissible alert-light" style="border: 3px solid black; border-radius: 10px; padding: 10px; max-width: 800px; height: auto;">
  
            <button id="share_${i.filename}" class="btn btn-outline-info btn-sm" style="position: relative; left: 360px;" onclick="share(this.id)">Share</button><br>
  
            <h4 id="title" class="alert-heading">${p.title}</h4><br>
            <p id="info" class="mb-0">by <i>${p.user}</i> on <i>${p.date}</i></p><br>
            <p id="post" class="mb-0" style="max-width: 700px, height: auto;">${p.post}</p><br>
            ${ximages}<br><br>
            <a href="/manage/${i.filename}"><button id="manage" class="btn btn-outline-primary">Manage</button></a><br><br>
            <form action="delete/${i.filename}" method="POST">
              <input type="submit" value="Delete" id="delete" class="btn btn-outline-danger"><br><br>
            </form>
          </div>`);
        });
      });
  
      return res.send(`
        ${home_head}
          <meta property="og:image" content="https://${req.hostname}/icons/favicon.png">
        </head>
        <body>
          <center><br>
            Welcome back, <b>${user}</b>!<br>
            Logged in!<br><br>
            <a href="/new">
              <button id="create" class="btn btn-outline-success">Create another post</button>
            </a><br><br>
            <form action="logout" method="POST">
              <input type="submit" value="Log out!" class="btn btn-outline-warning">
            </form><br>
            <h1>Posts</h1>
            ${xposts}<br><br>
          </center>
        </body>
      </html>`);

    } else {
      //USER

      console.log("\x1b[35m", `» (USER) ${user} visited /!`, "\x1b[0m", "");
      
      posts.forEach(p => {
        let ximages = "";
        
        p.images.forEach(i => {
          ximages = ximages.concat(`<a href="/${i.path}.png" target="_blank"><img src="/${i.path}.png" style="max-width: 600px; height: auto; border: 1px solid black; border-radius: 10px;"></a>`);
          
          //USER'S OWN POSTS
          if(p.user === user) {
            xposts = xposts.concat(`<br><div data-aos="fade-down" id="${i.filename}" class="alert alert-dismissible alert-light" style="border: 3px solid black; border-radius: 10px; padding: 10px; max-width: 800px; height: auto;">
  
              <button id="share_${i.filename}" class="btn btn-outline-info btn-sm" style="position: relative; left: 360px;" onclick="share(this.id)">Share</button><br>
  
              <h4 id="title" class="alert-heading">${p.title}</h4><br>
              <p id="info" class="mb-0">by <i>${p.user}</i> on <i>${p.date}</i></p><br>
              <p id="post" class="mb-0" style="max-width: 700px, height: auto;">${p.post}</p><br>
              ${ximages}<br>
              <a href="/manage/${i.filename}"><button id="manage" class="btn btn-outline-warning">Manage</button></a><br><br>
              <form action="delete/${i.filename}" method="POST">
                <input type="submit" value="Delete" id="delete" class="btn btn-outline-danger"><br><br>
              </form>
            </div>`);
            
          } else {
            //NOT USER'S OWN POSTS
            xposts = xposts.concat(`<br><div data-aos="fade-down" id="${i.filename}" class="alert alert-dismissible alert-light" style="border: 3px solid black; border-radius: 10px; padding: 10px; max-width: 800px; height: auto;">
  
              <button id="share_${i.filename}" class="btn btn-outline-info btn-sm" style="position: relative; left: 360px;" onclick="share(this.id)">Share</button><br>
  
              <h4 id="title" class="alert-heading">${p.title}</h4><br>
              <p id="info" class="mb-0">by <i>${p.user}</i> on <i>${p.date}</i></p><br>
              <p id="post" class="mb-0" style="max-width: 700px, height: auto;">${p.post}</p><br>
              ${ximages}<br><br>
            </div>`);
          }
        });
      });
  
      return res.send(`
        ${home_head}
          <meta property="og:image" content="https://${req.hostname}/icons/favicon.png">
        </head>
        <body>
          <center><br>
            Welcome back, <b>${user}</b>!<br>
            Logged in!<br><br>
            <a href="/new">
              <button id="create" class="btn btn-outline-success">Create another post</button>
            </a><br><br>
            <form action="logout" method="POST">
              <input type="submit" value="Log out!" class="btn btn-outline-warning">
            </form><br>
            <h1>Posts</h1>
            ${xposts}<br><br>
          </center>
        </body>
      </html>`);
    }

  } else {
    //LOGGED OUT

    console.log("\x1b[33m", `» (UNKNOWN) Anonymous visited /!`, "\x1b[0m", "");
    
    posts.forEach(p => {
      let ximages = "";
      
      p.images.forEach(i => {
        ximages = ximages.concat(`<a href="/${i.path}.png" target="_blank"><img src="/${i.path}.png" style="max-width: 600px; height: auto; border: 1px solid black; border-radius: 10px;"></a>`);
        xposts = xposts.concat(`<br><div data-aos="fade-down" id="${i.filename}" class="alert alert-dismissible alert-light" style="border: 3px solid black; border-radius: 10px; padding: 10px; max-width: 800px; height: auto;">
  
          <button id="share_${i.filename}" class="btn btn-outline-info btn-sm" style="position: relative; left: 360px;" onclick="share(this.id)">Share</button><br>
  
          <h4 id="title" class="alert-heading">${p.title}</h4><br>
          <p id="info" class="mb-0">by <i>${p.user}</i> on <i>${p.date}</i></p><br>
          <p id="post" class="mb-0" style="max-width: 700px, height: auto;">${p.post}</p><br>
          ${ximages}<br><br>
        </div>`);
      });
    });

    return res.send(`
      ${home_head}
        <meta property="og:image" content="https://${req.hostname}/icons/favicon.png">
      </head>
      <body>
        <center><br>
          Not logged in!<br><br>
          <a href="/dlogin">
            <button id="dlogin" class="btn btn-outline-primary">Discord Login</button>
          </a><br><br>
          <h1>Posts</h1>
          ${xposts}<br><br>
        </center>
      </body>
    </html>`);

/*    return res.send(`
      ${home_head}
        <meta property="og:image" content="https://${req.hostname}/icons/favicon.png">
      </head>
      <body>
        <center><br>
          Not logged in!<br><br>
          <a href="/dlogin">
            <button id="dlogin" class="btn btn-outline-primary">Discord Login</button>
          </a><br><br>
          <a href="/login">
            <button id="login" class="btn btn-outline-primary">Login</button>
          </a><br><br>
          <a href="/register">
            <button id="register" class="btn btn-outline-primary">Register</button>
          </a><br><br>
          <h1>Posts</h1>
          ${xposts}<br><br>
        </center>
      </body>
    </html>`);*/
  }
}