"use strict";

app.service('environmentService', function($http, $q) {
    	var self = this;
    	this.configuration = undefined;
    
    	this.getConfiguration = function() {
    	    if(!self.configuration) {
    		return $http.get('resources/environment.json').then(function (result) {
    		    self.configuration = result.data;
    		    return self.configuration;
    		});
    	    } else {
    		var deferred = $q.defer();
    		deferred.resolve(self.configuration);
    		return deferred.promise;
    	    }
    	};
    
	this.getJobInformation = function(jenkinsUrl,job, authBase64) {
	    var headers = authBase64 !== null ? {authorization : "Basic "+ authBase64} : {};
	    return $http.get(jenkinsUrl+'/job/'+job+'/api/json', {headers : headers});
	};
	this.getBuildDetail = function(jenkinsUrl,build, authBase64) {
	    var headers = authBase64 !== null ? {authorization : "Basic "+ authBase64} : {};
	    return $http.get(build.url.substring(build.url.indexOf('/job')).replace('/job',jenkinsUrl+'/job')+'/api/json', {headers : headers}); 
	};
	this.getSonarResourcesAndAnalysisPeriod = function(sonarUrl, authBase64) {
	    var headers = authBase64 !== null ? {authorization : "Basic "+ authBase64} : {};
	    return $http.get(sonarUrl+'/api/resources?includetrends=true', {headers : headers}); 
	};
	this.getSonarViolationsByResourceAndTime = function(sonarUrl,resourceKey,fromDate, authBase64) {
	    var headers = authBase64 !== null ? {authorization : "Basic "+ authBase64} : {};
    	    return $http.get(sonarUrl+'/api/timemachine?resource='+resourceKey+'&fromDateTime='+fromDate+'&metrics=violations,blocker_violations,critical_violations,major_violations,minor_violations,info_violations,complexity,class_complexity,file_complexity,function_complexity,duplicated_blocks,duplicated_files,duplicated_lines,duplicated_lines_density,coverage,sqale_index', {headers : headers});
	};
	this.triggerBuild = function(jenkinsUrl, job, authBase64) {
	    var headers = authBase64 !== null ? {authorization : "Basic "+ authBase64} : {};
	    return $http.post(jenkinsUrl+'/job/'+job+'/build', {headers : headers});
	};
});
