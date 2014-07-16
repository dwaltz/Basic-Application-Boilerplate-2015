//Application configuration
module.exports = {
	'local' : {
		//Put in facebook application creds here
		'facebookAuth' : {
			'clientID' 		: 'your-facebookapp-clientID-here',
			'clientSecret' 	: 'your-facebookapp-secret-here',
			'callbackURL' 	: '/auth/facebook/callback'
		},

		'twitterAuth' : {
			'consumerKey' 		: 'your-consumer-key-here',
			'consumerSecret' 	: 'your-client-secret-here',
			'callbackURL' 		: '/auth/twitter/callback'
		},

		'googleAuth' : {
			'consumerKey' 		: 'your-consumer-key-here',
			'consumerSecret' 	: 'your-client-secret-here',
			'callbackURL' 		: '/auth/google/callback'
		},

		'mongodb' : {
			'url': 'localhost',
			'name': 'test-user-data'
		}
	},
	'prod' : {

	}
};