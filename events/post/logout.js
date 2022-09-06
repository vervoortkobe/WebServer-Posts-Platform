module.exports.run = async (req, res, fs) => {
  
	if(req.session.loggedin) {

    console.log(`${req.session.username} logged out!`);
    
		req.session.destroy();
		return res.redirect("/");
    
	} else {
		return res.redirect("/home");
	}
}