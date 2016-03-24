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
        this.negative = false;
        return this;
    };
    this.lessThan = function (param) {
        this.query[field] = this.negative ? {$gte: param} : {$lt: param};
        this.negative = false;
        return this;
    };
    this.greatThan = function (param) {
        this.query[field] = this.negative ? {$lte: param} : {$gt: param};
        this.negative = false;
        return this;
    };
    this.include = function (param) {
        this.query[field] = this.negative ? {$nin: param} : {$in: param};
        this.negative = false;
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
function doFindQuery(callback, queryDescription) {
    var collectionName = this.collect;
    return connectToDB.call(this, queryDescription, (db, query) => {
        return db.collection(collectionName).find(query).toArray();
    }, 'find', callback);
};

/**
  * функция, выполняющая вставку нового поля в таблицу
 *
 * @param newDoc
 * @param callback
 */
function doInsertQuery(newDoc, callback, queryDescription) {
    var collectionName = this.collect;
    return connectToDB.call(this, queryDescription, (db, query) => {
        return db.collection(collectionName).insert(newDoc);
    }, 'insert', callback);
};

/**
 * функция, выполняющая удаление полей из таблицы
 *
 * @param callback
 */
function doRemoveQuery(callback, queryDescription) {
    var collectionName = this.collect;
    return connectToDB.call(this, queryDescription, (db, query) => {
        return db.collection(collectionName).remove(query);
    }, 'remove', callback);
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
function doUpdateQuery(callback, queryDescription) {
    var collectionName = this.collect;
    var updateField = this.updateField;
    return connectToDB.call(this, queryDescription, (db, query) => {
        return db.collection(collectionName).updateMany(query, updateField);
    }, 'update', callback);
};

/**
 * функция, реализующая подключение к Mongo и выполняющая запросы
 *
 * @param queryDescription описание запроса. Необходимо для вывода ответа
 * @param {function} doQuery функция, реализующая запрос к БД
 * @param {string} typeQuery find|remove|insert|update тип запроса
 * @param {function} callback колбек, для вывода ответа на экран
 */
function connectToDB(queryDescription, doQuery, typeQuery, callback) {
    var db;
    return mongoClient.connect(this.url)
        .then(database => {
            db = database;
            return doQuery(db, this.query);
        })
        .then(result => {
            if (typeQuery === 'find') {
                callback(null, result, queryDescription);
            } else {
                callback(null, null, queryDescription);
            }
            db.close();
        })
        .catch(err => {
            callback(err);
            db.close();
        });
}

module.exports = multivarka;
