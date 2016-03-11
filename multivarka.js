'use strict';

var mongoClient = require('mongodb').MongoClient;

var multivarka = {
    server: doNewConnection
};

function doNewConnection(url) {
    return new Connection(url);
}

function Connection(url) {
    this.url = url;
    this.query = {};
    this.negative = false;
}
Connection.prototype.collection = setCollection;
Connection.prototype.where = createQuery;
Connection.prototype.find = doFindQuery;
Connection.prototype.insert = doInsertQuery;
Connection.prototype.remove = doRemoveQuery;
Connection.prototype.set = createSet;
Connection.prototype.update = doUpdateQuery;

/**
 * функция, устанавливающая имя таблицы
 *
 * @param collection
 */
function setCollection(collection) {
    this.collect = collection;
    return this;
}

/**
 * функция, устанавливающая запрос при выборке данных
 *
 * @param field нужное поле
 */
function createQuery(field) {
    addOperations.call(this, field);
    return this;
}

/**
 * функция, добавляющая операции, которые нужны при выборке данных
 *
 * @param field
 */
function addOperations(field) {
    this.equal = function (param) {
        this.query[field] = this.negative ? {$ne: param} : param;
        return this;
    };
    this.lessThan = function (param) {
        this.query[field] = this.negative ? {$gte: param} : {$lt: param};
        return this;
    };
    this.greatThan = function (param) {
        this.query[field] = this.negative ? {$lte: param} : {$gt: param};
        return this;
    };
    this.include = function (param) {
        this.query[field] = this.negative ? {$nin: param} : {$in: param};
        return this;
    };
    this.not = function () {
        this.negative = !this.negative;
        return this;
    };
}

/**
 * функция, выполняющая поиск полей, соответствующих запросу, и передающая результат в Callback
 *
 * @param callback
 */
function doFindQuery(callback, answer) {
    var collectionName = this.collect;
    var query = this.query || {};
    var db;
    var responce = mongoClient.connect(this.url)
        .then(database => {
            db = database;
            return db.collection(collectionName).find(query).toArray();
        })
        .then(result => {
            callback(null, result, answer);
            db.close();
        })
        .catch(err => {
            callback(err);
            db.close();
        });
    return responce;
};

/**
 * функция, выполняющая вставку нового поля в таблицу
 *
 * @param newDoc
 * @param callback
 */
function doInsertQuery(newDoc, callback) {
    var collectionName = this.collect;
    var db;
    var responce = mongoClient.connect(this.url)
    .then(database => {
        db = database;
        return db.collection(collectionName).insert(newDoc);
    })
    .then(() => {
        callback(null, null, 'Insert ' + newDoc.name);
        db.close();
    })
    .catch(err => {
        callback(err);
        db.close();
    });
    return responce;
};

/**
 * функция, выполняющая удаление полей из таблицы
 *
 * @param callback
 */
function doRemoveQuery(callback, answer) {
    var collectionName = this.collect;
    var query = this.query || {};
    var db;
    var responce = mongoClient.connect(this.url)
        .then(database => {
            db = database;
            return db.collection(collectionName).remove(query);
        })
        .then(() => {
            callback(null, null, answer);
            db.close();
        })
        .catch(err => {
            callback(err);
            db.close();
        });
    return responce;
};

/**
 * функция, устанавлвающая какое поле нужно изменить
 *
 * @param field поле, которое надо изменить
 * @param value новое значение поля
 */
function createSet(field, value) {
    this.updateField = {$set: {}};
    this.updateField.$set[field] = value;
    return this;
}

/**
 * функция, выполняющая обновление данных студентов
 *
 * @param callback
 */
function doUpdateQuery(callback) {
    var collectionName = this.collect;
    var query = this.query || {};
    var updateField = this.updateField;
    var db;
    var responce = mongoClient.connect(this.url)
        .then(database => {
            db = database;
            return db.collection(collectionName).updateMany(query, updateField);
        })
        .then(result => {
            callback(null, result);
            db.close();
        })
        .catch(err => {
            callback(err);
            db.close();
        });
    return responce;
};

module.exports = multivarka;
