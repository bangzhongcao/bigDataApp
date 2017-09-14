angular.module('starter.directive', [])

.directive('appHeadSearch',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/headSearch.html',
		// scope:{
		// 	isHide:'='
		// },
		link:function($scope){
			// 搜索框颜色渐变
			var banner = document.getElementsByClassName('head_search')[0];
		    var height = 130;
		    var scrollPane = document.getElementsByClassName('scroll');
		    // scrollPane.onscroll = function(){
		    //     var top = document.body.scrollTop;
		    //     console.log(height);
		    //     if(top > height){
		    //     	banner.style.backgroundColor = 'rgba(135,206,235, 1)';
		    //     }else{
		    //         var op = top/height* 1;
		    //         banner.style.backgroundColor = 'rgba(135,206,235, '+op+')';
		    //     }
		    // }
		}
	}
}])

.directive('appCarousel',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/carousel.html',
		scope:{
			list:'='
		},
		link:function($scope){
		}
	}
}])


// .directive('appListHead',[function(){
// 	return {
// 		restrict:'A',
// 		replace:true,
// 		templateUrl:'template/view/listHead.html',
// 		scope:{
// 			backstyle:'=',
// 			stitle:'='
// 		},
// 		link:function($scope){
// 			$scope.back = function(){
// 				window.history.back();
// 			}
// 		}
// 	}
// }])

.directive('appModuleList',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/module.html',
		scope:{
			list:'='
		}
	}
}])

.directive('appCourseList',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/courseList.html',
		scope:{
			titleName:'@',
			list:'=',
			more:'@'
		}
	}
}])

.directive('appNewsList',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/newsList.html',
		scope:{
			titleName:'@',
			list:'=',
			more:'@'
		}
	}
}])

.directive('appPaperList',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/paperList.html',
		scope:{
			list:'=',
			titleName:'@',
			more:'@'
		}
	}
}])

.directive('appVideoList',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/videoList.html',
		scope:{
			list:'=',
			titleName:'@',
			more:'@'
		}
	}
}]);