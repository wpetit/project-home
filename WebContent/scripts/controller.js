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
			$scope.sonarResources = data.sonarResources;
			$scope.sonarUrl = data.sonarUrl;
			if(data.sonarDirectAccessUrl == null || data.sonarDirectAccessUrl == "") {
				$scope.sonarDirectAccessUrl = data.sonarUrl;
			} else {
				$scope.sonarDirectAccessUrl = data.sonarDirectAccessUrl;
			}
			$scope.jenkinsUrl = data.jenkinsUrl;
			$scope.sonarPeriod = data.sonarPeriodForComparison;
			$scope.getJenkinsJobs();
			$scope.getSonarViolations();
		}).error(function(data) {
			$scope.globalError="The project-home has not been customized. Please initialize it."
		});
	};

	$scope.getJenkinsJobs = function() {
		for (i = 0; i < $scope.jenkinsJobs.length; i++) {
			var jenkinsJob = $scope.jenkinsJobs[i];
			environmentService.getJobInformation($scope.jenkinsUrl,jenkinsJob).success(
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
				if($scope.sonarResources.length != 0 && $scope.sonarResources.indexOf(data[i].key) != -1) {
					var perdiod =
					$scope.getResourceAnalysis(data[i].name,data[i].key,data[i].id,$scope.getPeriodDateTime(data[i]));
				}
			}
		}).error(function(data, status) {
			$scope.sonarStatus = "Sonar is not available for the moment : Error " + status+".";
		});
	};
	
	$scope.getPeriodDateTime = function(resourcesData) {
		var periodDateTime = null;
		if($scope.sonarPeriod == 1) {
			periodDateTime = resourcesData.p1d;
		} else if($scope.sonarPeriod == 2) {
			periodDateTime = resourcesData.p2d; 
		} else {
			periodDateTime = resourcesData.p3d;
		}
		return periodDateTime;
	};
	
	$scope.getResourceAnalysis = function(resourceName,resourceKey,resourceId,fromDateTime) {
		environmentService.getSonarViolationsByResourceAndTime($scope.sonarUrl,resourceKey,fromDateTime).success(function(dataByResource) {
			if(fromDateTime != null) {
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
				resourceAnalysis.complexity = new Object();
				resourceAnalysis.complexity.previousNumber=dataByResource[0].cells[0].v[7];
				resourceAnalysis.complexity.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[7];
				resourceAnalysis.classComplexity = new Object();
				resourceAnalysis.classComplexity.previousNumber=dataByResource[0].cells[0].v[8];
				resourceAnalysis.classComplexity.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[8];
				resourceAnalysis.fileComplexity = new Object();
				resourceAnalysis.fileComplexity.previousNumber=dataByResource[0].cells[0].v[9];
				resourceAnalysis.fileComplexity.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[9];
				resourceAnalysis.functionComplexity = new Object();
				resourceAnalysis.functionComplexity.previousNumber=dataByResource[0].cells[0].v[10];
				resourceAnalysis.functionComplexity.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[10];
				resourceAnalysis.duplicatedBlocks = new Object();
				resourceAnalysis.duplicatedBlocks.previousNumber=dataByResource[0].cells[0].v[11];
				resourceAnalysis.duplicatedBlocks.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[11];
				resourceAnalysis.duplicatedFiles = new Object();
				resourceAnalysis.duplicatedFiles.previousNumber=dataByResource[0].cells[0].v[12];
				resourceAnalysis.duplicatedFiles.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[12];
				resourceAnalysis.duplicatedLines = new Object();
				resourceAnalysis.duplicatedLines.previousNumber=dataByResource[0].cells[0].v[13];
				resourceAnalysis.duplicatedLines.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[13];
				resourceAnalysis.duplicatedLinesDensity = new Object();
				resourceAnalysis.duplicatedLinesDensity.previousNumber=dataByResource[0].cells[0].v[14];
				resourceAnalysis.duplicatedLinesDensity.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[14];
				resourceAnalysis.coverage = new Object();
				resourceAnalysis.coverage.previousNumber=dataByResource[0].cells[0].v[15];
				resourceAnalysis.coverage.number=dataByResource[0].cells[dataByResource[0].cells.length-1].v[15];
							
				$scope.sonarAnalysis.push(resourceAnalysis);
			}
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