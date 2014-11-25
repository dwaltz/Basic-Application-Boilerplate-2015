// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

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

userSchema.pre('save', function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('local.password')) return next();

	// generate a salt
	// When you are hashing your data the module will go through a series of rounds to give you a secure hash.
	// The value you submit there is not just the number of rounds that the module will go through to hash your data.
	// The more rounds the more computationally expensive.
	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.local.password, salt, function(err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.local.password = hash;
			next();
		});
	});
});

// checking if password is valid
userSchema.methods.validPassword = function(password, next) {
	bcrypt.compare(password, this.local.password, function(err, isMatch) {
		if (err) return next(err);
		next(null, isMatch);
	});
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);