'use strict';

const sql = require('mssql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use( bodyParser.json() );

app.set('port', (process.env.API_PORT || 3001));

const config = {
    server: 'idlf08a7kb.database.windows.net',
    user: 'coachseek@idlf08a7kb',
    password: 'W#ggie1267',
    database: 'Coachseek',
    options: {
        encrypt: true
    }
};

app.get('/business', function(req, res) {
    sql.connect(config).then(() => {
        if(req.query.filter && req.query.filter !== 'undefined' && req.query.filter !== ''){
            new sql.Request().input('filter', req.query.filter)
                .query`SELECT * FROM Business WHERE NAME LIKE '%' + @filter + '%'`.then(function(recordset) {
                res.send(recordset);
            }).catch(function(err) {
                console.log(err);
            });
        } else if (req.query.id) {
            sql.query`SELECT * FROM Business WHERE Id = ${req.query.id}`.then(function(record) {
                res.send(record);
            }).catch(function(err) {
                console.log(err);
            });
        } else {
            sql.query`SELECT TOP 10 * from Business`.then(function(recordset) {
                res.send(recordset);
            }).catch(function(err) {
                console.log(err);
            });
        }
    }).catch((err) => {
        console.log(err);
    });
});

function getUpdatePromises(body){
    let promises = [];
    promises.push(sql.query`UPDATE Business SET Name=${body.Name}, AuthorisedUntil=${body.AuthorisedUntil} WHERE id = ${body.id}`);
    if(body.courseEmailId){
        promises.push(sql.query`UPDATE EmailTemplate SET Subject=${body.courseEmailSubject}, Body=${body.courseEmailBody} WHERE id = ${body.courseEmailId}`);
    } else if (body.courseEmailBody && body.courseEmailSubject){
        promises.push(sql.query`INSERT INTO EmailTemplate (BusinessId, Type, Subject, Body) VALUES (${body.id}, 'OnlineBookingCustomerCourse', ${body.courseEmailSubject}, ${body.courseEmailBody});`)
    }

    if(body.sessionEmailId){
        promises.push(sql.query`UPDATE EmailTemplate SET Subject=${body.sessionEmailSubject}, Body=${body.sessionEmailBody} WHERE id = ${body.sessionEmailId}`);
    } else if (body.sessionEmailBody && body.sessionEmailSubject){
        promises.push(sql.query`INSERT INTO EmailTemplate (BusinessId, Type, Subject, Body) VALUES (${body.id}, 'OnlineBookingCustomerSession', ${body.sessionEmailSubject}, ${body.sessionEmailBody});`)
    }
    return promises;
}

app.get('/email-templates', function(req, res) {
    sql.connect(config).then(() => {
        sql.query`SELECT * from EmailTemplate WHERE BusinessId = ${req.query.id}`.then(function(recordset) {
            res.send(recordset);
        }).catch(function(err) {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
});

app.post('/business', function(req, res) {
    sql.connect(config).then(() => {
        Promise.all(getUpdatePromises(req.body))
        .then(function(record) {
            res.send({});
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(401);
        });
    }).catch((err) => {
        console.log(err);
    });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});