var db 					= require('../init_db.js');

var Sequelize 			= db.Sequelize;

var sequelize 			= db.sequelize;

var user = function() {

};

// Pull Time Sheet
user.getUser = function(callback) {
	// console.log('model - accout');
	var queryString = "SELECT * FROM users";
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT })
	.then(function(results){
		callback(results);
		// console.log(results);
	})
	.catch(function(err){
  		console.log(err);
  		throw err;
  	});

};

user.setUserInfo = function(user_info, callback) {

	var firstName = user_info.firstName;
	var givenName = user_info.givenName;
	var preferedName = user_info.preferedName;
	
	var queryString = "UPDATE users SET ";

	if(firstName){
		queryString += "firstName = '" + firstName+"'";
	}
	if(givenName){
		if(firstName){
			queryString += " , ";
		}
		queryString += "givenName = '" + givenName+"'";
	}
	if(preferedName){
		if(firstName || givenName){
			queryString += " , ";
		}
		queryString += "preferedName = '" + preferedName+"'";
	}

	queryString += "  WHERE id = 1;";



	/* Insert account into database table */
	sequelize.query(queryString, { type: Sequelize.QueryTypes.INSERT })
		.then(function(results){
			callback(results);
			// console.log(results);
		})
		.catch(function(err){
	  		console.log(err);
	  		throw err;
	  });

}

module.exports = user;