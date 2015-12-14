'use strict';

describe('module: main, service: Section', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Section;
  beforeEach(inject(function (_Section_) {
    Section = _Section_;
  }));

  it('should do something', function () {
    expect(!!Section).toBe(true);
  });

});
