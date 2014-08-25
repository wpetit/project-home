environmentAppControllers.controller('EnvironmentAppCtrl', function($scope,
		environmentService, $location, $modal) {
	$scope.getAll = function() {
		environmentService.getAll().success(function(data) {
			$scope.applicationName = data.applicationName;
			$scope.applicationLogo = data.applicationLogo;
			$scope.applicationLinks = data.applicationLinks;
			$scope.applicationTools = data.applicationTools;
			$scope.envs = data.env;
			$scope.jenkinsJobs = data.jenkinsJobs;
			$scope.sonarUrl = data.sonarUrl;
			$scope.jenkinsUrl = data.jenkinsUrl;
			$scope.getJenkinsJobs();
			$scope.getSonarViolations();
		}).error(function(data) {
			$scope.globalError="The project-home has not been customized. Please initialize it."
		});
	};

	$scope.getJenkinsJobs = function() {
		for (i = 0; i < $scope.jenkinsJobs.length; i++) {
			var jenkinsJob = $scope.jenkinsJobs[i];
			environmentService.getJobInformation($scope.jenkinsUrl,jenkinsJob.job).success(
					function(data) {
						var job = data;
						job.buildsDetails = new Array();
						$scope.jobs.push(job);
						$scope.getJenkinsBuilds(job);
					}).error(function(data, status) {
						$scope.jenkinsStatus = "Jenkins is not available for the moment : Error " + status+".";
					});
		}
	};

	$scope.getJenkinsBuilds = function(job) {
		for (i = 0; i < job.builds.length; i++) {
			var build = job.builds[i];
			environmentService.getBuildDetail($scope.jenkinsUrl,build).success(function(data) {
				job.buildsDetails.push(data);
			}).error(function(data, status) {
				$scope.jenkinsStatus = "Jenkins is not available for the moment : Error " + status+".";
			});
		}
	};

	$scope.getSonarViolations = function() {
		environmentService.getSonarResourcesAndAnalysisPeriod($scope.sonarUrl).success(function(data) {
			$scope.sonarAnalysis = new Array();
			for(i=0; i< data.length;i++) {
				$scope.getResourceAnalysis(data[i].name,data[i].key,data[i].id,data[i].p3d);
			}
		}).error(function(data, status) {
			$scope.sonarStatus = "Sonar is not available for the moment : Error " + status+".";
		});
	};
	
	$scope.getResourceAnalysis = function(resourceName,resourceKey,resourceId,fromDateTime) {
		environmentService.getSonarViolationsByResourceAndTime($scope.sonarUrl,resourceKey,fromDateTime).success(function(dataByResource) {
			var resourceAnalysis = new Object();
			resourceAnalysis.name=resourceName;
			resourceAnalysis.key=resourceKey;
			resourceAnalysis.id=resourceId;
			resourceAnalysis.violations = new Object();
			resourceAnalysis.violations.previousNumber=dataByResource[0].cells[0].v[0];
			resourceAnalysis.violations.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[0];
			resourceAnalysis.blockerViolations = new Object();
			resourceAnalysis.blockerViolations.previousNumber=dataByResource[0].cells[0].v[1];
			resourceAnalysis.blockerViolations.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[1];
			resourceAnalysis.criticalViolations = new Object();
			resourceAnalysis.criticalViolations.previousNumber=dataByResource[0].cells[0].v[2];
			resourceAnalysis.criticalViolations.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[2];
			resourceAnalysis.majorViolations = new Object();
			resourceAnalysis.majorViolations.previousNumber=dataByResource[0].cells[0].v[3];
			resourceAnalysis.majorViolations.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[3];
			resourceAnalysis.minorViolations = new Object();
			resourceAnalysis.minorViolations.previousNumber=dataByResource[0].cells[0].v[4];
			resourceAnalysis.minorViolations.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[4];
			resourceAnalysis.infoViolations = new Object();
			resourceAnalysis.infoViolations.previousNumber=dataByResource[0].cells[0].v[5];
			resourceAnalysis.infoViolations.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[5];
			resourceAnalysis.violationsDensity = new Object();
			resourceAnalysis.violationsDensity.previousNumber=dataByResource[0].cells[0].v[6];
			resourceAnalysis.violationsDensity.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[6];
			$scope.sonarAnalysis.push(resourceAnalysis);
		}).error(function(data, status) {
			$scope.sonarStatus = "Sonar is not available for the moment : Error " + status+".";
		});
	};
	
	$scope.getResourceAnalysisByKey = function(key) {
		for(i=0;i<$scope.sonarAnalysis.length;i++) {
			if($scope.sonarAnalysis[i].key == key) {
				return $scope.sonarAnalysis[i];
			}
		}
	};

	$scope.jenkinsStatus = null;
	$scope.sonarStatus = null;
	$scope.jobs = new Array();
	$scope.getAll();
});