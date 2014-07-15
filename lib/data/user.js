// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

	local            : {
		email        : String,
		password     : String
	},
	facebook         : {
		id           : String,
		token        : String,
		email        : String,
		name         : String
	},
	twitter          : {
		id           : String,
		token        : String,
		displayName  : String,
		username     : String
	},
	google           : {
		id           : String,
		token        : String,
		email        : String,
		name         : String
	}

});

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return password == this.local.password;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);