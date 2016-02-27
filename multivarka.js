'use strict';

var mongoClient = require('mongodb').MongoClient;

module.exports = {
    server: setUrl,
    collection: setCollection,
    where: createQuery,
    negative: false,
    find: doFindQuery,
    insert: doInsertQuery,
    remove: doRemoveQuery
};

/**
 * функция, устанавливающая адрес сервера бд
 *
 * @param url
 */
function setUrl(url) {
    this.url = url;
    return this;
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
    this.query = {};
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
    var query = this.query;
    mongoClient.connect(this.url, function (err, db) {
        if (err) {
            console.error(err);
        } else {
            var collection = db.collection(collectionName);
            collection.find(query).toArray(function (err, result) {
                callback(err, result);
                db.close();
            });
        }
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
    mongoClient.connect(this.url, function (err, db) {
        if (err) {
            console.error(err);
        } else {
            var collection = db.collection(collectionName);
            collection.insert(newDoc, function (err, result) {
                callback(err, result);
                db.close();
            });
        }
    });
};

/**
 * функция, выполняющая удаление полей из таблицы
 *
 * @param callback
 */
function doRemoveQuery(callback) {
    var collectionName = this.collect;
    mongoClient.connect(this.url, function (err, db) {
        if (err) {
            console.error(err);
        } else {
            var collection = db.collection(collectionName);
            collection.remove(function (err, result) {
                callback(err, result);
                db.close();
            });
        }
    });
};
