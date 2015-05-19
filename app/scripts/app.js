/* global app: true */
/* global appControllers: true */
/* global appFilters: true */
"use strict";

var app = angular.module('environmentApp', [ 'ngRoute', 'ui.bootstrap',
		'appControllers', 'appFilters']);

var appControllers = angular.module('appControllers', []);

var appFilters = angular.module('appFilters', []);

