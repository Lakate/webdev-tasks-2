'use strict';

var mongoClient = require('mongodb').MongoClient;

var multivarka = {
    server: doNewConnection
};

function doNewConnection(url) {
    return {
        url: url,
        query: {},
        negative: false,
        collection: setCollection,
        where: createQuery,
        find: doFindQuery,
        insert: doInsertQuery,
        remove: doRemoveQuery,
        set: createSet,
        update: doUpdateQuery
    };
}

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
function doFindQuery(callback) {
    var collectionName = this.collect;
    var query = this.query || {};
    var db;
    mongoClient.connect(this.url)
        .then(database => {
            db = database;
            return db.collection(collectionName).find(query).toArray();
        })
        .then(result => {
            callback(null, result);
            db.close();
        })
        .catch(err => {
            callback(err);
        });
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
    mongoClient.connect(this.url)
    .then(database => {
        db = database;
        return db.collection(collectionName).insert(newDoc);
    })
    .then(result => {
        callback(null, result);
        db.close();
    })
    .catch(err => {
        callback(err);
    });
};

/**
 * функция, выполняющая удаление полей из таблицы
 *
 * @param callback
 */
function doRemoveQuery(callback) {
    var collectionName = this.collect;
    var query = this.query || {};
    var db;
    mongoClient.connect(this.url)
        .then(database => {
            db = database;
            return db.collection(collectionName).remove(query);
        })
        .then(result => {
            callback(null, result);
            db.close();
        })
        .catch(err => {
            callback(err);
        });
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
    mongoClient.connect(this.url)
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
        });
}

module.exports = multivarka;
