'use strict';
angular.module('main')
  .service('DBManager', function ($log, pouchDB, $http) {

    // Enable auto compaction to keep it always small
    var db = pouchDB('ESNappDB', {auto_compaction: true}); // eslint-disable-line camelcase

    // Index for a content type for a list of sections
    db.createIndex({
      index: {
        fields: ['docType', 'contentType'],
        name: 'contentList',
        ddoc: 'contentList'
      }
    });

    // Index for section info
    db.createIndex({
      index: {
        fields: ['code', 'docType'],
        name: 'docList',
        ddoc: 'docList'
      }
    });

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
