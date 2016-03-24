'use strict';

const co = require('co');
const multivarka = require('./multivarka');

const petr = {
    name: 'Пётр',
    group: 'ПИ-302',
    grade: 4
};

const kate = {
    name: 'Катя',
    group: 'КБ-301',
    grade: 5
};

const daniil = {
    name: 'Даниил',
    group: 'КБ-301',
    grade: 4
};

const piratka = {
    name: 'Дарья',
    group: 'ПИ-401',
    grade: 3
};

const sergey = {
    name: 'Сергей',
    group: 'КН-402',
    grade: 4
};

var query0 = multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students');

var query1 = multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('group').equal('ПИ-302');

var query2 = multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('group').equal('КБ-301')
    .where('grade').equal(4);

var query2 = multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('group').equal('КБ-301')
    .where('grade').equal(4);

var query3 = multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('grade').not().greatThan(4)
    .where('group').include(['КБ-301', 'КН-402']);


var callback = (err, data, description) => {
    if (description !== undefined) {
        console.log(description);
    }
    if (!err) {
        if (data) {
            console.log(data);
        }
    } else {
        console.error(err);
    }
};

co(function *() {
    yield query0.remove(callback, 'Collection was cleaned');
    yield query0.insert(daniil, callback, 'Insert Daniil');
    yield query0.insert(petr, callback, 'Insert Petr');
    yield query0.insert(kate, callback, 'Insert Kate');
    yield query0.insert(piratka, callback, 'Insert Piratka');
    yield query0.insert(sergey, callback, 'Insert Sergey');
    yield query1.remove(callback, 'Удалены Люди из ПИ-302');
    yield query1.find(callback, 'Люди из ПИ-302: ');
    yield query2.find(callback, 'Люди из КБ-301 с оценкой: ');
    yield query3.find(callback, 'Люди c 4: ');
    yield multivarka.
        server('mongodb://localhost/urfu-2015')
        .collection('students')
        .where('group').include(['ПИ-301', 'ПИ-302', 'КБ-301'])
        .find(callback, 'Люди из ПИ-301, ПИ-302, КБ-301: ');
});
