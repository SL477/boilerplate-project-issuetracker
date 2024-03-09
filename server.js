'use strict';

import express from 'express';
import pkg from 'body-parser';
const { json, urlencoded } = pkg;
// var expect      = require('chai').expect;
import cors from 'cors';
import apiRoutes from './routes/api.js';
import fccTestingRoutes from './routes/fcctesting.js';
import runner from './test-runner.js';
import { config } from 'dotenv';
// import Helmet from 'helmet';
const app = express();

config();

// Helmet
// app.use(Helmet());
app.disable('x-powered-by');

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(json());
app.use(urlencoded({ extended: true }));

// Sample front-end
app.route('/:project/').get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
});

//Index page (static HTML)
app.route('/').get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// For FCC testing purposes
fccTestingRoutes(app);

// Routing for API
apiRoutes(app);

// 404 Not Found Middleware
// eslint-disable-next-line no-unused-vars
app.use(function (req, res, next) {
    res.status(404).type('text').send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port ' + listener.address().port);
    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function () {
            try {
                runner.run();
                console.log('Run tests');
            } catch (e) {
                var error = e;
                console.log('Tests are not valid:');
                console.log(error);
            }
        }, 3500);
    }
});

export default app; //for testing
