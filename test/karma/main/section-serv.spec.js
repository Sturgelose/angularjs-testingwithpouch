'use strict';

describe('module: main, service: Section', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  var pouchDB;
  var sectionJson;
  var $httpBackend;
  var $rootScope;
  var Section;
  var Config;
  var $q;
  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');
    Section = $injector.get('Section');
    Config = $injector.get('Config');
    $q = $injector.get('$q');
    pouchDB = $injector.get('DBManager');
    // Load fixtures
    fixture.setBase('test/karma/fixtures');
    sectionJson = fixture.load('json/section-list.json');

    $httpBackend
      .expectGET(Config.ENV.CALLHOME_SECTION_URL).respond(200, sectionJson);
  }));

  describe('.getSection', function () {

    it('should fetch all sections', function (done) {
      var sectionA = sectionJson[0];

      Section.getSection('SectionA')
        .then(function (answerSection) {
          expect(answerSection).not.to.be.null;

          // End the test
          done();
        });

      $rootScope.$digest();
      $rootScope.$digest();
      $rootScope.$digest();
      $rootScope.$digest();
      $rootScope.$digest();
      $rootScope.$digest();


      //$httpBackend.flush();
    });

  });

});
