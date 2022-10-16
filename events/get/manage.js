module.exports.run = async (req, res, fs) => {

  let posts = require("../../json/posts.json");

  const manage = fs.readFileSync("./html/manage.html");

  if (req.session.loggedin) {

    var user = req.session.username;
    var id = req.params.id;

    if (id) {

      //ADMIN
      if (user === process.env.ADMIN) {

        let p = posts.find(p => p.images[0].filename === id);
        if (p) {
          
          var vischeck;
          if (p.visibility == "on") {
            vischeck = "checked";
          }
          if (p.visibility == "off") {
            vischeck = "";
          }

          return res.send(`${manage}
                  <form action="edit" method="POST">
                    <input type="text" name="id" placeholder="ID" value="${p.images[0].filename}" id="id" class="form-control" readonly required><br>
                    <input type="text" name="title" placeholder="Title" value="${p.title}" id="title" class="form-control" autofocus onfocus="this.setSelectionRange(this.value.length, this.value.length);" required><br>
                    <textarea type="text" name="post" placeholder="Post" id="post" class="form-control" rows="3" style="height: 120px;" required>${p.post}</textarea><br>
                    <input type="checkbox" name="visibility" id="visibility" class="form-check-input" ${vischeck}> Visibility<br><br>
                </div>
                <center>
                  <a href="/${p.images[0].path}.png" target="_blank" id="imgurl" class="imgurl">
                    <img src="/${p.images[0].path}.png" id="image" class="image" style="max-width: 600px; height: auto; border: 1px solid black; border-radius: 10px;">
                  </a><br><br>
                </center>
                <div class="manage-form" style="padding-bottom: 150px;">
                    <input type="submit" id="submit" class="btn btn-outline-primary" value="Edit">
                  </form><br>
                </div>
              </body>
            </html>`);

        } else {
          return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
                    <center>Please provide a valid id param!<br>
                    Redirecting to /home in 3 seconds...</center>`);
        }

      } else {
        //USER

        let p = posts.find(p => user === p.user);
        if (p) {
          if (p.images[0].filename === id) {
            
            var vischeck;
            if (p.visibility === "on") {
              vischeck = "checked";
            }
            if (p.visibility === "off") {
              vischeck = "";
            }

            return res.send(`${manage}
                    <form action="edit" method="POST">
                      <input type="text" name="id" placeholder="ID" value="${p.images[0].filename}" id="id" class="form-control" readonly required><br>
                      <input type="text" name="title" placeholder="Title" value="${p.title}" id="title" class="form-control" autofocus onfocus="this.setSelectionRange(this.value.length, this.value.length);" required><br>
                      
                      <textarea type="text" name="post" placeholder="Post" id="post" class="form-control" rows="3" style="height: 120px;" required>${p.post}</textarea><br>
                      <input type="checkbox" name="visibility" id="visibility" class="form-check-input" ${vischeck}> Visibility<br><br>
                  </div>
                  <center>
                    <a href="/${p.images[0].path}.png" target="_blank" id="imgurl" class="imgurl">
                      <img src="/${p.images[0].path}.png" id="image" class="image" style="max-width: 600px; height: auto; border: 1px solid black; border-radius: 10px;">
                    </a><br><br>
                  </center>
                  <div class="manage-form" style="padding-bottom: 150px;">
                      <input type="submit" id="submit" class="btn btn-outline-primary" value="Edit">
                    </form><br>
                  </div>
                </body>
              </html>`);

          } else {
            return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
                      <center>Please provide a valid id param!<br>
                      Redirecting to /home in 3 seconds...</center>`);
          }

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
              <center>Please login before posting!<br>
              Redirecting to /dlogin in 3 seconds...</center>`);
  }
}