//Application configuration
module.exports = {
	'local' : {
		//Put in facebook application creds here
		'facebookAuth' : {
			'clientID' 		: 'your-facebookapp-clientID-here',
			'clientSecret' 	: 'your-facebookapp-secret-here',
			'callbackURL' 	: '/auth/facebook/callback'
		},

		'mongodb' : {
			'url': 'localhost',
			'name': 'test-user-data'
		}
	},
	'prod' : {

	}
};