'use strict';
angular.module('main')
  .service('DBManager', function ($log, pouchDB, $http, $q) {

    // Enable auto compaction to keep it always small
    var db = pouchDB('ESNappDB', {auto_compaction: true}); // eslint-disable-line camelcase

    this.createIndexes = function () {
      // Index for a content type for a list of sections
      var index1 = db.createIndex({
        index: {
          fields: ['docType', 'contentType'],
          name: 'contentList',
          ddoc: 'contentList'
        }
      });

      // Index for section info
      var index2 = db.createIndex({
        index: {
          fields: ['code', 'docType'],
          name: 'docList',
          ddoc: 'docList'
        }
      });

      return $q.all([index1, index2]);
    };

    this.createIndexes();

    this.docType = {
      SECTION: 'section',
      COUNTRY: 'country',
      CONTENT: 'content'
    };

    this.contentType = {
      EVENT: 'event',
      NEWS: 'news',
      PARTNER: 'partner'
    };


    function addTimestamp (document) {
      document.timestamp = Date.now();
      return Promise.resolve(document);
    }


    this.putDoc = function (document, id) {
      // Update the timestamp
      return Promise.resolve(addTimestamp(document))
        // Put in the DB
        .then(function (document) {
          return db.put(document, id);
        });
    };

    this.findDoc = function (query) {
      return db.find(query);
    };

    this.fetchURL = function (url) {
      return $http.get(url, {cache: false, withCredentials: true});
    };

  });
