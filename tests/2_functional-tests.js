/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

import chaiHttp from 'chai-http';
import { assert as _assert, use, expect } from 'chai';
var assert = _assert;
import server from '../server.js';
import { suite, test } from 'mocha';
const chaiServer = use(chaiHttp);

suite('Functional Tests', function () {
    suite('POST /api/issues/{project} => object with issue data', function () {
        test('Every field filled in', function (done) {
            chaiServer
                .request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Every field filled in',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    expect(err).to.be.null;
                    //fill me in too!
                    // console.log(
                    //     'POST /api/issues/{project} => object with issue data',
                    //     res
                    // );
                    //assert.equal(res.issue_title, "Title");
                    //assert.equal(res.issue_text, "text");
                    //assert.equal(res.created_by, 'Functional Test - Every field filled in');
                    //assert.equal(res.assigned_to, "Chai and Mocha");
                    done();
                });
        });

        test('Required fields filled in', function (done) {
            chaiServer
                .request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'Text',
                    created_by: 'Functional Test - Required fields filled in',
                })
                .end(function (err, res) {
                    // console.log(res);
                    assert.equal(res.status, 200);
                    expect(err).to.be.null;
                    //assert.equal(res.issue_title, "Title");
                    //assert.equal(res.issue_text, "text");
                    //assert.equal(res.created_by, 'Functional Test - Required fields filled in');
                    done();
                });
        });

        test('Missing required fields', function (done) {
            chaiServer
                .request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                })
                .end(function (err, res) {
                    if (err) {
                        // console.log(err);
                        done();
                    } else {
                        // console.log(res);
                        assert.equal(res.status, 200);
                        //assert.equal(res.message, "issueRecord validation failed");
                        done();
                    }
                });
        });
    });

    suite('PUT /api/issues/{project} => text', function () {
        test('No body', function (done) {
            chaiServer
                .request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'Text',
                    created_by: 'update Test - Required fields filled in',
                })
                // eslint-disable-next-line no-unused-vars
                .end(function (err, res1) {
                    chaiServer
                        .request(server)
                        .put('/api/issues')
                        .send({
                            _id: res1._id,
                            // status_text: 'update test',
                        })
                        .end(function (err, res) {
                            if (err) {
                                // console.log(err);
                                //console.log(res);
                                assert.equal(res.status, 404);
                                assert.equal(err.message, 'Not Found');
                                done();
                            } else {
                                assert.equal(res.status, 404);
                                //console.log(res);
                                done();
                            }
                        });
                });
        });

        test('One field to update', function (done) {
            chaiServer
                .request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'Text',
                    created_by: 'update Test - Required fields filled in',
                })
                .end(function (err, res1) {
                    chaiServer
                        .request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: res1._id,
                            status_text: 'update test',
                        })
                        .end(function (err, res) {
                            if (err) {
                                // console.log(err);
                                // console.log(res);
                                done();
                            } else {
                                assert.equal(res.status, 200);
                                assert.equal(res.text, 'successfully updated');
                                //assert.equal(res.status_text, "update test");
                                // console.log(res);
                                done();
                            }
                        });
                });
        });

        test('Multiple fields to update', function (done) {
            chaiServer
                .request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'Text',
                    created_by: 'update Test - Required fields filled in',
                })
                .end(function (err, res1) {
                    chaiServer
                        .request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: res1._id,
                            status_text: 'update test',
                            issue_text: 'updated text',
                        })
                        .end(function (err, res) {
                            if (err) {
                                // console.log(err);
                                // console.log(res);
                                done();
                            } else {
                                assert.equal(res.status, 200);
                                assert.equal(res.text, 'successfully updated');
                                //assert.equal(res.status_text, "update test");
                                // console.log(res);
                                done();
                            }
                        });
                });
        });
    });

    suite(
        'GET /api/issues/{project} => Array of objects with issue data',
        function () {
            test('No filter', function (done) {
                chaiServer
                    .request(server)
                    .get('/api/issues/test')
                    .query({})
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        assert.property(res.body[0], 'issue_title');
                        assert.property(res.body[0], 'issue_text');
                        assert.property(res.body[0], 'created_on');
                        assert.property(res.body[0], 'updated_on');
                        assert.property(res.body[0], 'created_by');
                        // assert.property(res.body[0], 'assigned_to');
                        assert.property(res.body[0], 'open');
                        // assert.property(res.body[0], 'status_text');
                        assert.property(res.body[0], '_id');
                        done();
                    });
            });

            test('One filter', function (done) {
                chaiServer
                    .request(server)
                    .get('/api/issues/test')
                    .query({ open: true })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        assert.property(res.body[0], 'issue_title');
                        assert.property(res.body[0], 'issue_text');
                        assert.property(res.body[0], 'created_on');
                        assert.property(res.body[0], 'updated_on');
                        assert.property(res.body[0], 'created_by');
                        // assert.property(res.body[0], 'assigned_to');
                        assert.property(res.body[0], 'open');
                        // assert.property(res.body[0], 'status_text');
                        assert.property(res.body[0], '_id');
                        done();
                    });
            });

            test('Multiple filters (test for multiple fields you know will be in the db for a return)', function (done) {
                chaiServer
                    .request(server)
                    .get('/api/issues/test')
                    .query({ open: true, assigned_to: 'Chai and Mocha' })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        assert.property(res.body[0], 'issue_title');
                        assert.property(res.body[0], 'issue_text');
                        assert.property(res.body[0], 'created_on');
                        assert.property(res.body[0], 'updated_on');
                        assert.property(res.body[0], 'created_by');
                        assert.property(res.body[0], 'assigned_to');
                        assert.property(res.body[0], 'open');
                        assert.property(res.body[0], 'status_text');
                        assert.property(res.body[0], '_id');
                        done();
                    });
            });
        }
    );

    suite('DELETE /api/issues/{project} => text', function () {
        test('No _id', function (done) {
            chaiServer
                .request(server)
                .delete('/api/issues/test')
                .send()
                .end(function (err, res) {
                    if (err) {
                        // console.log(err);
                        // console.log(res);
                        done();
                    } else {
                        //console.log(res);
                        assert.equal(res.status, 200);
                        assert.equal(
                            res.text,
                            '{"success":"deleted undefined"}'
                        );
                        done();
                    }
                });
        });

        test('Valid _id', function (done) {
            chaiServer
                .request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'Text',
                    created_by: 'delete Test - Required fields filled in',
                })
                .end(function (err, res1) {
                    chaiServer
                        .request(server)
                        .delete('/api/issues/test')
                        .send({
                            _id: res1._id,
                        })
                        .end(function (err, res) {
                            if (err) {
                                // console.log(err);
                                // console.log(res);
                                done();
                            } else {
                                assert.equal(res.status, 200);
                                //assert.equal(res.text, "successfully updated");
                                //assert.equal(res.status_text, "update test");
                                // console.log(res);
                                done();
                            }
                        });
                });
        });
    });
});
