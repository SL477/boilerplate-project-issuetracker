/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

import { Schema, model, connect } from 'mongoose';

// schema
const issueSchema = new Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: { type: Date },
    updated_on: { type: Date },
    created_by: { type: String, required: true },
    project: { type: String },
    assigned_to: { type: String },
    status_text: { type: String },
    open: { type: Boolean },
});
const issueObject = model('issueRecord', issueSchema);

export default function (app) {
    connect(process.env.DB)
        .then(console.log('Connected'))
        .catch((ex) => console.error(ex));

    app.route('/api/issues/:project')

        .get(function (req, res) {
            const project = req.params.project;
            const queryObj = { project: project };
            for (let property in req.query) {
                queryObj[property] = req.query[property];
            }

            issueObject
                .find(queryObj)
                .select(
                    '_id issue_title issue_text created_on updated_on created_by assigned_to open status_text'
                )
                .then((docs) => {
                    // console.log(
                    //     docs,
                    //     'query',
                    //     queryObj,
                    //     'query params',
                    //     req.query,
                    //     req.query.open,
                    //     req.query.assigned_to,
                    //     req.params
                    // );
                    res.json(docs);
                })
                .catch((err) => {
                    console.error(err);
                    res.send(err);
                });
        })

        .post(function (req, res) {
            issueObject
                .create({
                    issue_title: req.body.issue_title,
                    issue_text: req.body.issue_text,
                    created_by: req.body.created_by,
                    project: req.params.project,
                    assigned_to:
                        req.body.assigned_to == 'undefined'
                            ? ''
                            : req.body.assigned_to,
                    status_text:
                        req.body.status_text == 'undefined'
                            ? ''
                            : req.body.status_text,
                    created_on: new Date(),
                    updated_on: new Date(),
                    open: true,
                })
                .then((data) => {
                    console.log(data);
                    res.json({
                        _id: data._id,
                        issue_title: data.issue_title,
                        issue_text: data.issue_text,
                        created_on: data.created_on,
                        updated_on: data.updated_on,
                        created_by: data.created_by,
                        assigned_to: data.assigned_to,
                        open: data.open,
                        status_text: data.status_text,
                    });
                })
                .catch((err) => {
                    console.error(err);
                    res.send(err);
                });
        })

        .put(function (req, res) {
            // var project = req.params.project;
            //console.log(req.body);
            const updater = {};
            let hasUpdate = false;
            if (req.body.issue_title != '') {
                updater['issue_title'] = req.body.issue_title;
                hasUpdate = true;
            }

            if (req.body.issue_text != '') {
                updater['issue_text'] = req.body.issue_text;
                hasUpdate = true;
            }

            if (req.body.created_by != '') {
                updater['created_by'] = req.body.created_by;
                hasUpdate = true;
            }

            if (req.body.assigned_to != '') {
                updater['assigned_to'] = req.body.assigned_to;
                hasUpdate = true;
            }

            if (req.body.open == 'false' || !req.body.open) {
                console.log('close issue');
                updater['open'] = false;
                hasUpdate = true;
            }

            if (hasUpdate) {
                updater['updated_on'] = new Date();
                issueObject
                    .updateOne(
                        {
                            _id: req.body._id,
                        },
                        updater
                    )
                    .then(() => {
                        // console.log(
                        //     'updated',
                        //     data,
                        //     'update data',
                        //     updater,
                        //     'id',
                        //     req.body._id,
                        //     req.body.open
                        // );
                        res.send('successfully updated');
                    })
                    .catch((err) => {
                        console.error(err);
                        res.send('could not update ' + req.body._id);
                    });
            } else {
                res.send('no updated field sent');
            }
        })

        .delete(function (req, res) {
            if (req.body._id == '') {
                res.send('_id error');
            } else {
                issueObject
                    .deleteOne({
                        _id: req.body._id,
                    })
                    .then(() =>
                        res.json({ success: 'deleted ' + req.body._id })
                    )
                    .catch(() =>
                        res.json({
                            failed: 'could not delete ' + req.body._id,
                        })
                    );
            }
        });
}
