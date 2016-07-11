var db 					= require('../init_db');
var model 				= require('./jiragation');
var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

var TimeSheet = function() {

};

// Pull Time Sheet
TimeSheet.getTimeSheet = function(callback) {
	// console.log('model - accout');
	var queryString = "SELECT * FROM time_sheet";
	
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

TimeSheet.logTaskTime = function(req, callback) {
	model.TimeSheet.create({
		task_id: req.task_id,
		start_time: req.start_time,
		end_time: req.end_time,
	}).then(function(results) {
		callback(results);
	}, function(err){
		console.log(err);
		throw err;
	});
};

//pull time log for specific task_id
TimeSheet.getTaskTime = function(res, callback) {
	
	var queryString = "SELECT * FROM time_sheet WHERE task_id = '" + res.task_id + "'";
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT })
	.then(function(results){
		callback(results);
		// console.log(results);
	})
	.catch(function(err){
  		// console.log(err);
  		throw err;
  	});
};

TimeSheet.getTrackedTime = function(res, callback) {
	console.log(res);
	// var earlier_Date =  new Date( res.earlier_time);
	// var later_Date  new Date ( res.later_time);
	var queryString = "SELECT * FROM time_sheet WHERE createdAt >= '" + res.earlier_time + "' AND createdAt <= '" + res.later_time + "'";

	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT })
	.then(function(results){
		callback(results);
		// console.log(results);
	})
	.catch(function(err){
  		// console.log(err);
  		throw err;
  	});
};


module.exports = TimeSheet;