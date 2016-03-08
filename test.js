'use strict';

const multivarka = require('./multivarka');

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .remove((err) => {
        if (!err) {
            console.log('Collection was cleaned');
        }
    });

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

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .insert(petr, (err) => {
        if (!err) {
            console.log('Insert petr');
        } else {
            console.error(err);
        }
    });

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .insert(kate, (err) => {
        if (!err) {
            console.log('Insert kate');
        } else {
            console.error(err);
        }
    });

multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .insert(daniil, (err) => {
        if (!err) {
            console.log('Insert daniil');
        } else {
            console.error(err);
        }
    });

var query1 = multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('group').equal('ПИ-302');

var query2 = multivarka
    .server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('group').equal('КБ-301')
    .where('grade').equal(4);

query1.remove(function (err) {
    if (!err) {
        console.log('Удалены Люди из ПИ-302');
    }
});

query1.find(function (err, data) {
    if (!err) {
        console.log('Люди из ПИ-302: ');
        console.log(data);
    }
});

query2.find(function (err, data) {
    if (!err) {
        console.log('Люди из КБ-301 с оценкой: ');
        console.log(data);
    }
});

multivarka.
    server('mongodb://localhost/urfu-2015')
    .collection('students')
    .where('group').include(['ПИ-301', 'ПИ-302', 'КБ-301'])
    .find(function (err, data) {
        if (!err) {
            console.log('Люди из ПИ-301', 'ПИ-302', 'КБ-301: ');
            console.log(data);
        }
    });
