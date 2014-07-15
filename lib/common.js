//common methods for use all anywhere within the application

//checking for authentication
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/welcome');
}

module.exports = {
	isLoggedIn: isLoggedIn
};