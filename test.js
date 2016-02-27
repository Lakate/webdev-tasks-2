'use strict';

const multivarka = require('./multivarka');

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .remove(function (err, result) {
        if (!err) {
            console.log("Collection was cleaned");
            //console.log(result);
        }
    });

const petr = {
    name: 'Пётр',
    group: 'ПИ-302',
    grade: 4
};

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .insert(petr, function (err, result) {
        if (!err) {
            console.log("Insert:");
            console.log(result);
        }
    });

const kate = {
    name: 'Катя',
    group: 'КБ-301',
    grade: 5
};

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .insert(kate, function (err, result) {
        if (!err) {
            console.log("Insert:");
            console.log(result);
        }
    });

multivarka.
    server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('group').equal('ПИ-301')
    .find(function (err, data) {
        if (!err) {
            console.log('Группа ПИ-301: ');
            console.log(data);
        }
    });

multivarka.
    server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('grade').lessThan(5)
    .find(function (err, data) {
        if (!err) {
            console.log('Оценки меньше 5 у: ');
            console.log(data);
        }
    });

multivarka.
    server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('grade').greatThan(4)
    .find(function (err, data) {
        if (!err) {
            console.log('Оценки больше 4 у: ');
            console.log(data);
        }
    });

multivarka.
    server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('group').include(['ПИ-301', 'ПИ-302', 'КБ-301'])
    .find(function (err, data) {
        if (!err) {
            console.log('Группы ПИ-301', 'ПИ-302', 'КБ-301: ');
            console.log(data);
        }
    });

multivarka.
    server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('group').not().equal('ПИ-302')
    .find(function (err, data) {
        if (!err) {
            console.log('Все группы, кроме ПИ-302: ');
            console.log(data);
        }
    });
