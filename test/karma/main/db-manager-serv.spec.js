'use strict';

describe('module: main, service: DBManager', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var DBManager;
  beforeEach(inject(function (_DBManager_) {
    DBManager = _DBManager_;
  }));

  it('should do something', function () {
    expect(!!DBManager).toBe(true);
  });

});
