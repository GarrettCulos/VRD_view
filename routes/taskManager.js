var express 			= require('express');
var async				= require('async');
var taskManager			= express.Router();
var TimeSheet			= require('../models/time_sheet.js');
var fs 					= require('fs');

taskManager.post('/trackTime', function(req, res, next) {
	TimeSheet.logTaskTime(req.body, function(req, result) {
		// console.log(result); 
		res.send(result);		
	});
});

taskManager.get('/getTrackedTime',function(req, res, next) {
	TimeSheet.getTrackedTime(req.query, function(time_logs) {
		res.send({time_logs: time_logs});

	});
})


taskManager.get('/getTaskTime',function(req, res, next) {
	TimeSheet.getTaskTime(req.query, function(time_logs) {
		var todays_logged_time=0;
		var	date = new Date();
		var todays_date = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

		async.forEach(time_logs,function(time_log,callback){
			if(time_log.start_time> todays_date){
				todays_logged_time = todays_logged_time + (parseInt(time_log.end_time)-parseInt(time_log.start_time));
			}
			callback(null,todays_logged_time);
		}, function(err){
			if(err){ throw err}
			res.send({logged_time:todays_logged_time});
		});
	});
})

taskManager.post('/add_accounts',function(req, res, next) {
	var account = req.account;
	Accounts.setAccount(account, function(result) {
		// console.log('Account Set');
		res.send(result);		
	});
})

module.exports.taskManager = taskManager;