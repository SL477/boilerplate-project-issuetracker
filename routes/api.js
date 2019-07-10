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
  created_on: { type: Date },
  updated_on: { type: Date },
  created_by: { type: String, required: true },
  project: { type: String },
  assigned_to: { type: String },
  status_text: { type: String },
  open: { type: Boolean }
});
var issueObject = Mongoose.model('issueRecord', issueSchema);

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
module.exports = function (app) {
Mongoose.connect(process.env.DB, { useNewUrlParser: true }, function (err) {
  if (err) {
    console.log(err);
    res.send(err);
  } else {
  }});

//console.log(process.env.DB);

  //Mongoose.connect(process.env.DB, { useNewUrlParser: true }, function (err) {
    /*if (err) {
      console.log(err);
    } else {*/
      //console.log("db connected");
      app.route('/api/issues/:project')
      
        .get(function (req, res){
          var project = req.params.project;
          //console.log(req.query);

          /*Mongoose.connect(process.env.DB, { useNewUrlParser: true }, function (err) {
            if (err) {
              console.log(err);
              res.send(err);
            } else {*/
              //console.log("db connected");
              var queryObj = {"project": project};
              for (var property in req.query) {
                queryObj[property] = req.query[property];
              }
              //console.log(queryObj);
              issueObject.find(queryObj).select('_id issue_title issue_text created_on updated_on created_by assigned_to open status_text').exec(function (err, docs) {
                if (err) {
                  console.log(err);
                  res.send(err);
                } else {
                  console.log(docs);
                  res.json(docs);
                }
              }); 
            /*}
          });*/

          //res.json({"hi":"hi"});
        })
        
        .post(function (req, res){
          var project = req.params.project;
          console.log(req.body);
          /*Mongoose.connect(process.env.DB, { useNewUrlParser: true }, function (err) {
            if (err) {
              console.log(err);
            } else {*/
              console.log("db connected");
              issueObject.create({issue_title: req.body.issue_title, 
                issue_text: req.body.issue_text, 
                created_by: req.body.created_by,
                project: req.params.project, 
                assigned_to: req.body.assigned_to == 'undefined'? "" : req.body.assigned_to, 
                status_text: req.body.status_text == 'undefined'? "" : req.body.status_text,
                created_on: new Date(),
                updated_on: new Date(),
                open: true}, function (err, data) {
                  if (err) {
                    console.log(err);
                    res.send(err);
                  } else {
                    console.log(data);
                    res.json({"_id": data._id, 
                      "issue_title": data.issue_title,
                      "issue_text": data.issue_text,
                      "created_on": data.created_on,
                      "updated_on": data.updated_on,
                      "created_by": data.created_by,
                      "assigned_to": data.assigned_to,
                      "open": data.open,
                      "status_text": data.status_text
                  });
                  }
                });
              
            /*}
          });*/
          //res.json({"hi":"hi"});
        })
        
        .put(function (req, res){
          var project = req.params.project;
          console.log(req.body);
          var updater = {};
          var hasUpdate = false;
          if (req.body.issue_title != "") {
            updater['issue_title'] = req.body.issue_title;
            hasUpdate = true;
          }

          if (req.body.issue_text != "") {
            updater['issue_text'] = req.body.issue_text;
            hasUpdate = true;
          }

          if (req.body.created_by != "") {
            updater['created_by'] = req.body.created_by;
            hasUpdate = true;
          }

          if (req.body.assigned_to != "") {
            updater['assigned_to'] = req.body.assigned_to;
            hasUpdate = true;
          }

          if (req.body.open == "false") {
            console.log("close issue");
            updater["open"] == false;
            hasUpdate = true;
          }

          if (hasUpdate) {

            updater["updated_on"] = new Date();

            issueObject.updateOne({'_id': req.body._id}, updater,function (err, doc) {
              if (err) {
                console.log(err);
                res.send('could not update ' + req.body._id);
              } else {
                console.log(doc);
                res.send("successfully updated");
              }
            });
          } else {
            //res.json({"hi":"hi"});
            res.send('no updated field sent');
          }
        })
        
        .delete(function (req, res){
          var project = req.params.project;
          if (req.body._id == "") {
            res.send("_id error");
          } else {
            issueObject.deleteOne({'_id': req.body._id}, function (err) {
              if (err){
                res.json({'failed': 'could not delete ' + req.body._id});
              } else {
                res.json({'success': 'deleted ' + req.body._id});
              }
            });
          }
          //console.log(req.body);
          //res.json({"hi":"hi"});
        });
      //}
  //});

//}});
};