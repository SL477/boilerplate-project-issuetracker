/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var Mongoose = require('mongoose');

//schema
var issueSchema = new Mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  /*created_on: { type: Date },
  updated_on: { type: Date },*/
  created_by: { type: String, required: true },
  project: { type: String },
  assigned_to: { type: String },
  status_text: { type: String },
  open: { type: Boolean }
});
var issueObject = Mongoose.model('issueRecord', issueSchema);

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
//console.log(process.env.DB);
module.exports = function (app) {
  //Mongoose.connect(process.env.DB, { useNewUrlParser: true }, function (err) {
    /*if (err) {
      console.log(err);
    } else {*/
      console.log("db connected");
      app.route('/api/issues/:project')
      
        .get(function (req, res){
          var project = req.params.project;
          res.json({"hi":"hi"});
        })
        
        .post(function (req, res){
          var project = req.params.project;
          console.log(req.body);
          res.json({"hi":"hi"});
        })
        
        .put(function (req, res){
          var project = req.params.project;
          res.json({"hi":"hi"});
        })
        
        .delete(function (req, res){
          var project = req.params.project;
          res.json({"hi":"hi"});
        });
      //}
  //});
};
