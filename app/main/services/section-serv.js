'use strict';
angular.module('main')
  .service('Section', function (DBManager, $q, Config) {

    var DELTA_UPDATE_TIME = 604800;

    /**
     * Returns a section or sections info
     * @param sectionId     {string|string[]}   Id string or array of strings with the Ids
     * @param forceUpdate   {boolean}  true if needs to force the update
     * @returns {Promise}  Returns information of the section or sections
      */
    this.getSection = function (sectionId, forceUpdate) {
      if (!angular.isUndefined(forceUpdate)) {
        if (typeof(forceUpdate) !== 'boolean') {
          throw new TypeError('Invalid type for forceUpdate in .getSection call');
        }
        if (forceUpdate) {
          // Update and return the updated section
          return updateSections(sectionId);
        }
      }
      else {
        var updated = false;
        // Find the section
        return findSection(sectionId)
        // If not found,update the section list
          .catch(function () {
            updated = true;
            return updateSections(sectionId);
          })
          // If the section found is too old, try to update it (only if we didn't just update)
          .then(function (foundSection) {
            if (!updated && Date.now() - foundSection.timestamp > DELTA_UPDATE_TIME) {
              return updateSections(sectionId);
            }
          });
      }
    };

    /**
     * Returns a list of all the sections
     * @param forceUpdate   {boolean} true if needs to force the update
     * @returns {Promise}   Returns information of all the sections
      */
    this.getAllSections = function (forceUpdate) {
      return this.getSection(null, forceUpdate);
    };


    /**
     * Checks the JSON returned from callhome has a proper format
     * @param section   The JSON object of the section
     * @returns {Promise} The same JSON object or an error
      */
    function checkSectionJSON (section) {
      if (section.hasOwnProperty('code') &&
        section.hasOwnProperty('name') &&
        section.hasOwnProperty('api_url') &&
        section.hasOwnProperty('api_version') &&
        section.hasOwnProperty('api_quality')) {
        //noinspection JSUnresolvedVariable
        if (section.api_quality === 1) {
          return Promise.resolve(section);
        }
        else {
          //throw new Error('API quality is bad');
          return Promise.resolve(section);
        }
      }
      throw new Error('Wrong format in the returned JSON');
    }

    /**
     * Updates all the sections info and returns a specified set
     * @param sectionId
     * @returns {Promise}
      */
    function updateSections (sectionId) {

      var updatedSections = [];

      // Fetch all sections
      return DBManager.fetchURL(Config.ENV.CALLHOME_SECTION_URL)
        .then(function (httpAnswer) {
          // For each section object
          return $q.all(httpAnswer.data.map(function (section) {
            var updatedSection;
            // Check the section object consistency
            return checkSectionJSON(section)
            // Find the document to be updated
              .then(function () {
                return findSection(section.code)
                // Merge the old and new information
                  .then(function (found) {
                    if (found.docs.length === 1) {
                      updatedSection = angular.extend(found.docs[0], section);
                    }
                    else {
                      // Wrong info found, let's create a new object
                      return Promise.reject();
                    }
                  })
                  // Setup a new section object if not found or wrong info
                  .catch(function () {
                    updatedSection = section;
                    updatedSection.docType = DBManager.docType.SECTION;
                    return Promise.resolve(updatedSection);
                  });
              })
              // Put it back to the database
              .then(function () {
                return DBManager.putDoc(updatedSection, updatedSection.code);
              })
              // Check if we have to return this info
              // If so, add it to the array
              .then(function () {
                var sectionArray = [];
                // Handle if we have an array or just one id
                if (typeof sectionId === 'string') {
                  sectionArray = [].concat(sectionId);
                }
                else {
                  sectionArray = sectionId;
                }
                sectionArray.forEach( function (id) {
                  if (id === section.code) {
                    updatedSections.push(section);
                  }
                });
              });
          }))
            // When everything processed, return the specific section(s) we wanted
            .then(function () {
              return Promise.resolve(updatedSections);
            });
        });
    }

    /**
     * Finds a section given a section (or sections) id(s)
     * @param sectionId   {string|string[]}   Id string or array of strings with the Ids
     * @return {Promise} Returns the data found in the database
      */
    function findSection (sectionId) {
      // Fetch all sections
      if (angular.isUndefined(sectionId) || sectionId === null) {
        return DBManager.findDoc({
          selector: {
            docType: 'section'
          }
        });
      }
      // Fetch specific section(s)
      else {
        return DBManager.findDoc({
          selector: {
            code: sectionId,
            docType: 'section'
          }
        });
      }
    }

  });
