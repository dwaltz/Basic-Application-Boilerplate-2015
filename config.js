//Application configuration
module.exports = {
	'local' : {
		'facebookAuth' : {
			'clientID' 		: 'your-secret-clientID-here',
			'clientSecret' 	: 'your-client-secret-here',
			'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
		},

		'mongodb' : {
			'url': 'localhost',
			'name': 'test-user-data'
		}
	},
	'prod' : {

	}
};