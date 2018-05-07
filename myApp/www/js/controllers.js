angular.module('starter.controllers', [])
// 登录
.controller('loginCtrl',['$rootScope','$scope','$state','$interval','$timeout','$http',function($rootScope,$scope,$state,$interval,$timeout,$http){
  //输入框获取焦点 失去焦点
  $scope.isFocus = false;
  $scope.Focus = function(){
    $scope.isFocus = true;

  }
  $scope.Blur = function(){
    $scope.isFocus = false;
  }
  // 按钮disabled
  $scope.isDisabled = false;
  $scope.IsUserInfoRight = function(){
    $scope.isDisabled = $scope.user_Id&&$scope.user_pass;
  }

  //初始化用户信息
  // 表单验证
  $scope.isTip = false;
  $scope.tips = '';
  // 提示框显示时间
  function showTips(info){
    $scope.isTip = true;
    $scope.tips = info;
    var times = $timeout(function() {
      $scope.isTip = false;
      $scope.tips = '';
      $timeout.cancel(times);
    }, 2000);
  }

  // 提交
  $scope.submit = function(){
    // var DefaultHeadPic = '/img/headPic.png';
    $http({
      method:'POST',
      url:'/students_info',
      data:{
        "Id":$scope.user_Id,
        "Pass":$scope.user_pass
      }
    }).success(function(res){
      console.log(res);
      if(res.data.result){
        sessionStorage.setItem('userId',$scope.user_Id);
        sessionStorage.setItem('userName', res.data.user.name);
        if(res.data.user.email){
          $rootScope.userEmail = res.data.user.email;
          $state.go('tab.dash');//进入首页
        }else{
          $state.go('bindEmail');//进入邮箱绑定页面
        }
      }else{
        showTips('学号或密码错误');
      }
    }).error(function(res){
      showTips('服务器连接错误');
    });
  }
}])

//忘记密码页面
.controller('forgetCtrl',['$scope','$state','$interval','$timeout','$http','$rootScope',
  function($scope,$state,$interval,$timeout,$http,$rootScope){
  $scope.isDisabled = false;
  $scope.mail_addr = '';
  $scope.mail_code = '';
  // 判断信息是否正确
  $scope.IsInfoRight = function(){
    $scope.isDisabled = $scope.mail_addr && $scope.mail_code.length===6;
  }

  //提示信息
  $scope.isTip = false;
  $scope.tips = '';
  // 提示框显示时间
  function showTips(info){
    $scope.isTip = true;
    $scope.tips = info;
    var times = $timeout(function() {
      $scope.isTip = false;
      $scope.tips = '';
      $timeout.cancel(times);
    }, 2000);
  }

  // 验证码倒计时
  function countDown(){
    $scope.isCode = true;
      var count = 120;
      $scope.time='120s';
      var interval = $interval(function(){
        if(count<=0){
          $interval.cancel(interval);
          $scope.time = '';
          $scope.isCode = false;
        }else{
          count--;
          $scope.time = count+'s';
        }
      },1000);
  }
  //发送验证码
  $scope.isCode = false;
  var mailReg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
  var identify_num = '';//验证码
  var mailaddr = '';
  $scope.getCode = function(){
    if(mailReg.test($scope.mail_addr)){
        countDown();
        $http({
          method:'POST',
          url:'/get_verification',
          data:{
            mail:$scope.mail_addr
          }
        }).success(function(res){
          identify_num = res.data.identify;
          mailaddr = res.data.mail;
        }).error(function(res){
          alert(res);
        });
    }else{
      showTips('请输入正确的邮箱');
    } 
  }
  // 点击进入下一步
  $scope.submitMail = function(){
    if($scope.isDisabled){
      if($scope.isCode){
          if($scope.mail_code===identify_num && $scope.mail_addr === mailaddr){
            $state.go('alterPass');
          }else{
            showTips('验证码不正确');
          }
      }else{
          showTips('请重新获取验证码');
          identify_num = '';
      }
    }
  }
}])


//修改密码页面
.controller('alterPassCtrl',['$scope','$state','$interval','$timeout','$http',function($scope,$state,$interval,$timeout,$http){
  // 初始化
  $scope.new_pass = '';
  $scope.sec_pass = '';
  //提示信息
  $scope.isTip = false;
  $scope.tips = '';
  // 提示框显示时间
  function showTips(info){
    $scope.isTip = true;
    $scope.tips = info;
    var times = $timeout(function() {
      $scope.isTip = false;
      $scope.tips = '';
      $timeout.cancel(times);
    }, 2000);
  }

  // 确定按钮默认为disabled
  $scope.isDisabled = false;
  // 下一步按钮disabled
  $scope.IsPassRight = function(){
    $scope.isDisabled = $scope.userId && $scope.new_pass.length >=6 && $scope.sec_pass.length>=6&&$scope.new_pass==$scope.sec_pass;
  }
  // 提交新密码
  $scope.submitAlterPass = function(){
    if($scope.new_pass === $scope.sec_pass){
      $http({
        method:'POST',
        url:'/alter_pass',
        data:{'id':$scope.userId,'newPass':$scope.sec_pass}
      }).success(function(res){
        if(res.data.status){
          console.log(res);
          $state.go('login');
        }
      }).error(function(res){
        console.log(res);
      })
    }else{
      showTips('两次密码输入不相同');
    }
  }
}])


//绑定邮箱页面
.controller('bindEmailCtrl',['$scope','$state','$interval','$timeout','$http',function($scope,$state,$interval,$timeout,$http){
  $scope.isDisabled = false;
  $scope.mail_code = '';
  // 判断信息是否正确，信息填入正确后，确定按钮变为可点击状态
  $scope.IsInfoRight = function(){
    $scope.isDisabled = $scope.mail_addr && $scope.mail_code.length===6;
  }

  //提示信息
  $scope.isTip = false;
  $scope.tips = '';
  // 提示框显示时间
  function showTips(info){
    $scope.isTip = true;
    $scope.tips = info;
    var times = $timeout(function() {
      $scope.isTip = false;
      $scope.tips = '';
      $timeout.cancel(times);
    }, 2000);
  }

  // 验证码倒计时
  function countDown(){
    $scope.isCode = true;
      var count = 120;
      $scope.time='120s';
      var interval = $interval(function(){
        if(count<=0){
          $interval.cancel(interval);
          $scope.time = '';
          $scope.isCode = false;
        }else{
          count--;
          $scope.time = count+'s';
        }
      },1000);
  }
  //发送验证码
  $scope.isCode = false;
  var mailReg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
  var identify_num = '';//验证码
  var mailaddr = '';
  $scope.getCode = function(){
    if(mailReg.test($scope.mail_addr)){
        countDown();
        $http({
          method:'POST',
          url:'/get_verification',
          data:{
            mail:$scope.mail_addr
          }
        }).success(function(res){
          identify_num = res.data.identify;
          mailaddr = res.data.mail;
        }).error(function(res){
          alert(res);
        });
    }else{
      showTips('请输入正确的邮箱');
    } 
  }
  // 点击绑定邮箱
  $scope.submitMail = function(){
    if($scope.isDisabled){
      if($scope.isCode){
          if($scope.mail_code===identify_num && $scope.mail_addr === mailaddr){
            // 绑定邮箱
            $http.post('/bindEmail',{'id':sessionStorage.userId,'email':mailaddr}).then(function(res){
              $state.go('tab.dash');
              // $rootScope.userEmail = $scope.mail_addr;
            })
          }else{
            showTips('验证码不正确');
          }
      }else{
          showTips('请重新获取验证码');
          identify_num = '';
      }
    }
  }
}])


// 首页
.controller('DashCtrl',['$scope','$ionicScrollDelegate','$http','$window','$rootScope',function($scope,$ionicScrollDelegate,$http,$window,$rootScope) {
  $scope.isHidden = false;
  // // 搜索框颜色渐变
  $scope.scroll = function(){
    var banner = $window.document.getElementById('searchTab');
    var imgList = $window.document.getElementById('img-carousel');
    var height = imgList.offsetHeight - banner.offsetHeight;
    var top = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
    if(top>=0){
      $scope.$apply(function(){
        $scope.isHidden = false;
      });
      if(top>height){
        banner.style.backgroundColor = 'rgba(212,63,58,1)';
      }else{
        var op = top/height* 1;
        banner.style.backgroundColor = 'rgba(212,63,58, '+op+')';
      }
    }else{
      $scope.$apply(function(){
        $scope.isHidden = true;
      });
    }
  }
  // 获取收藏列表
  $http({
    method:'GET',
    url:'likeList',
    params:{uId:201611143001},
  }).success(function(res){
    $rootScope.likeList = res;
  })
  // 下拉刷新
  $scope.doRefresh = function(){
    // 获取最新资源
    // TO DO
    console.log('下拉刷新');
    $scope.$broadcast('scroll.refreshComplete');
  }
  // 模块入口
  $scope.modulelist = [
      {
        url:'course',
        img:'img/course.png',
        name:'课程'
      },{
        url:'news',
        img:'img/news.png',
        name:'新闻'
      },{
        url:'video',
        img:'img/video.png',
        name:'纪录片'
      },{
        url:'paper',
        img:'img/paper.png',
        name:'论文'
      }
  ];
    //课程列表
  $scope.courselist = [
      {
          "id":1,
          "img":"img/course1.png",
          "name":"Spark从零开始",
          "teachName":"Terby",
          "intro":"本课程旨在让同学们了解Spark基础知识，掌握Spark基础开发。"
      },
      {
          "id":2,
          "img":"img/course2.png",
          "name":"Python数据分析-基础技术篇",
          "teachName":"途索",
          "intro":"使用Python进行数据分析的基础模块简介。"
      },
      {
          "id":3,
          "img":"img/course3.png",
          "name":"R语言入门与进阶",
          "teachName":" 扬帆远航_",
          "intro":"这门课将会带领您领略R语言的精髓,打开R语言的大门。"
      }
  ];
  // 新闻列表
  $scope.newslist = [
    {
      id:1,
      img:'img/news1.png',
      name:'指南 ▏如何快速全面建立自己的大数据知识体系？',
      time:'2017-07-24 09:37'
    },{
      id:2,
      img:'img/news2.png',
      name:'关于大数据中的用户画像那些事，看这篇一文章就够了',
      time:'2017-07-21 15:25'
    }
  ];
// 纪录片列表
  $scope.videolist = [
    {
      id:1,
      img:'img/video1.png',
      name:'互联网时代',
      episodes:'12集'
    },{
      id:2,
      img:'img/video2.png',
      name:'现代生活的秘密规则：算法',
      episodes:'1集'
    },{
      id:3,
      img:'img/video3.png',
      name:'谷歌与世界头脑',
      episodes:'1集'
    }
  ];
// 论文列表
  $scope.paperlist = [
    {
      id:1,
      pclass:'[硕士学位论文]',
      name:'面向大数据查询的索引技术研究',
      author:'朱春莹  计算机科学与技术 山东大学',
      time:'2016(学位年度)',
      keyword:'数据查询 数据分类'
      // url:'common/paper/The Solution of Web Font-end Performance Optimization .pdf'
    },{
      id:2,
      pclass:'[会议论文]',
      name:' 大数据及其应用',
      author:'冯斐   2015航空试验测试技术学术交流会',
      time:'2015',
      keyword:'大数据 特征 处理技术 大数据应用'
      // url:'common/paper/The Solution of Web Font-end Performance Optimization .pdf'
    },{
      id:3,
      pclass:'[期刊论文]',
      name:' 大数据与推荐系统',
      author:'李翠平 蓝梦微 邹本友 王绍卿 赵衎衎 《大数据》',
      time:'2015年1期',
      keyword:'大数据 OLAP SQL分析 SQL on Hadoop'
      // url:'common/paper/The Solution of Web Font-end Performance Optimization .pdf'
    }
  ];
  // 轮播图
  $scope.imglist = [
    {
      url:'main',
      img:'img/carousel1.png'
    },{
      url:'main',
      img:'img/carousel2.jpg'
    },{
      url:'main',
      img:'img/carousel3.jpg'
    }
  ];
}])

// 搜索
.controller('searchCtrl',['$scope','$http','$state','$stateParams','$rootScope','$ionicViewSwitcher',
  function($scope,$http,$state,$stateParams,$rootScope,$ionicViewSwitcher){
  // 存储全局搜索的值
  if(sessionStorage.globalSearch){
      $scope._GlobalList = JSON.parse(sessionStorage.globalData);
      $scope.isCourse = Number(sessionStorage.isCourse);
      $scope.isVideo = Number(sessionStorage.isVideo);
      $scope.isNews = Number(sessionStorage.isNews);
      $scope.isPaper = Number(sessionStorage.isPaper);
      $scope.keyWord = sessionStorage.keyWord;
  }
  var searchColors = {
    'global':{
      "background-color" : "#d43f3a"
    },
    'course':{
      "background-color" : "#741D88"
    },
    'news':{
      "background-color" : "#2194CA"
    },
    'paper':{
      "background-color" : "#DA9627"
    },
    'video':{
      "background-color" : "#17A668"
    }
  };
  $scope.labelList = {'global':'全局','course':'课程','news':'新闻','paper':'论文','video':'视频'};
  // 获取传递的值
  $scope.background_color = searchColors[$stateParams.key];
  $scope.labels = $scope.labelList[$stateParams.key];
  $scope.model = $stateParams.key;// 模式

  // 是否已完成搜索
  $rootScope.hasSearch = false;
  // 搜索
  $scope.search = function(event){
    // var keycode = event.keyCode;
    // if(keycode===13){
        //进行搜索
        if($scope.keyWord){
          if($scope.model==='global'){
            // 全局搜索
            $http.get('globalSearch',{params:{'key':$scope.keyWord}}).then(function(res){
              $scope._GlobalList = res.data;
              $scope.isCourse = $scope._GlobalList.courselist.length;
              $scope.isVideo = $scope._GlobalList.videolist.length;
              $scope.isNews = $scope._GlobalList.newslist.length;
              $scope.isPaper = $scope._GlobalList.paperlist.length;
              // 用sessionStorage存储起来
              sessionStorage.globalSearch = 1,
              sessionStorage.globalData = JSON.stringify($scope._GlobalList);
              sessionStorage.isCourse = $scope.isCourse;
              sessionStorage.isVideo = $scope.isVideo;
              sessionStorage.isNews = $scope.isNews;
              sessionStorage.isPaper = $scope.isPaper;
              sessionStorage.keyWord = $scope.keyWord;
            })
          }else if($scope.model==='course'){
            // 课程搜索
            $http.get('courseSearch',{params:{'key':$scope.keyWord}}).then(function(res){
              $rootScope.hasSearch = true;
              $rootScope._CourseList = res.data;
              $state.go('course');
              $ionicViewSwitcher.nextDirection("forward");
              $scope.keyWord = '';
            })
          }else if($scope.model==='paper'){
            // 论文搜索
            $http.get('paperSearch',{params:{'key':$scope.keyWord}}).then(function(res){
              $rootScope._PaperList = res.data;
              $rootScope.hasSearch = true;
              $state.go('paper');
              $ionicViewSwitcher.nextDirection("forward");
              $scope.keyWord = '';
            })
          }else if($scope.model==='news'){
            // 新闻搜索
            $http.get('newsSearch',{params:{'key':$scope.keyWord}}).then(function(res){
              $rootScope._NewsList = res.data;
              $rootScope.hasSearch = true;
              $state.go('news');
              $ionicViewSwitcher.nextDirection("forward");
              $scope.keyWord = '';
            })
          }else if($scope.model==='video'){
            // 纪录片搜索
            $http.get('videoSearch',{params:{'key':$scope.keyWord}}).then(function(res){
              $rootScope._VideoList = res.data;
              $rootScope.hasSearch = true;
              $state.go('video');
              $ionicViewSwitcher.nextDirection("forward");
              $scope.keyWord = '';
            })
          }
        }       
    // }
  }
  // 取消搜索
  $scope.cancelSearch = function(){
    $scope.keyWord = '';
    $scope._GlobalList = {};
    $scope.isCourse = 0;
    $scope.isVideo = 0;
    $scope.isNews = 0;
    $scope.isPaper = 0;
    $rootScope.hasSearch = false;//判断是否已经搜索设为false
    //清楚sessionStorage中的global存储值
    sessionStorage.removeItem('globalSearch');
    sessionStorage.removeItem('globalData');
    sessionStorage.removeItem('isCourse');
    sessionStorage.removeItem('isVideo');
    sessionStorage.removeItem('isPaper');
    sessionStorage.removeItem('isNews');
    sessionStorage.removeItem('keyWord');

    if($scope.model==='global'){
      $state.go('tab.dash');
      $ionicViewSwitcher.nextDirection("back");
    }else{
      window.history.back();
    }
    
  }
}])
//课程列表
.controller('courseCtrl',['$scope','$http','$state','$rootScope',function($scope,$http,$state,$rootScope){
  $scope.back_course_style = {
    "background-color" : "#741D88"
  };
  $scope.course_title = '课程';
  $scope.courselist = [];
  // 获得课程列表
  if($rootScope.hasSearch){
    $scope.courselist = $rootScope._CourseList;
  }else{
    $http({
        method:'GET',
        url:'/getCourseList'
    }).then(function(res){
      // console.log(res);
        $scope.courselist = res.data;
    });
  }
  // 转到搜索页面
  $scope.Search = function(str){
    $rootScope._CourseList = [];
    $state.go('search',{key:str});
  }
  // 下拉刷新
  $scope.doRefresh = function(){
    // 获取最新资源
    // 获得课程列表
    $http({
        method:'GET',
        url:'/getCourseList'
    }).then(function(res){
        $rootScope.hasSearch = false;
        $scope.courselist = res.data;
        $scope.$broadcast('scroll.refreshComplete');
    });
  }
}])

//课程内容详情
.controller('courseInfoCtrl',['$scope','$state','$http','$stateParams','$rootScope',function($scope,$state,$http,$stateParams,$rootScope){
  $scope.active = 1;//默认tab切换栏显示
  $scope.isComment = 1;
  var courseId = $stateParams.id;
  $scope.isLike = false;//收藏图标
  $scope.courseInfo = {};
  // 获取课程详情
  $http.get('/courseInfo',{params: {"id":courseId }}).success(function(res){
    $scope.courseInfo = res;
  });
  // 获取课程评论
  $http.get('/courseComment',{params: {"id":courseId }}).success(function(res){
    $scope.remark = res;
  });
  var likeCourses = $rootScope.likeList.courselist;//课程收藏列表
  // console.log(likeCourses);
  // 判断课程是否被收藏
  for(var i=0;i<likeCourses.length;i++){
    if(likeCourses[i].id===Number(courseId)){
      $scope.isLike = true;//变为已收藏
    }else{
      $scope.isLike = false;
    }
  }
  // 收藏icon变化
  $scope.collectCourse = function(){
    if($scope.isLike){
      $scope.isLike = false;
    }else{
      $scope.isLike = true;
    }
  }
  // 发表评论
  $scope.submitComment = function(){
    // TO DO
    $scope.isComment = 1;
  }
  // 跳转到播放页面
  $scope.goPlay = function(url){
    $rootScope.videoUrl = url;
    $rootScope.videoName = $scope.courseInfo.name;
    $state.go('player');
  }
  $scope.back = function(){
    window.history.back();
  }
}])

//播放器
.controller('playerCtrl',['$scope','$state','$http','$stateParams','$rootScope',function($scope,$state,$http,$stateParams,$rootScope){
    $scope.isPlay = false;
    $scope.isPause = true;
    $scope.showCtrl = false;
    $scope.volume = 30;
    // 获取video元素
    var video = document.getElementById('Video');
    // 获取进度条容器
    var progressBar = document.getElementById('Progress');
    // 获取时间进度条
    var timeBar = document.getElementById('TimeBar');
    // 获取缓存进度条
    var loadBar = document.getElementById('LoadBar');
    // 自动横屏
    window.screen.orientation.lock('landscape');
    // 时间转换
    function getFormatTime(time) {
        var h = parseInt(time/3600);
        var m = parseInt(time%3600/60);
        var s = parseInt(time%60);
        h = h < 10 ? "0"+h : h;
        m = m < 10 ? "0"+m : m;
        s = s < 10 ? "0"+s : s;
        return h+":"+m+":"+s;
    }
    // 初始化音量
    video.volume = $scope.volume / 100;
    // 获取视频的总时间
    video.oncanplay = function(){
      //显示视频总时长
      $scope.totalTime = getFormatTime(this.duration);
    }
    // 随着视频播放进度条移动
    video.ontimeupdate = function(){
        var bufferlength = this.buffered.end(0);//视频缓存进度条
        // 缓存时间
        var buffer = bufferlength / this.duration * 100 + "%";
        //播放时间百分比
        var TimePercent = this.currentTime / this.duration * 100 + "%";
        //显示进度条
        loadBar.style.width = buffer;
        timeBar.style.width = TimePercent;
        $scope.$digest();//数据脏检查
     
         //显示当前播放进度时间
        $scope.currentTime = getFormatTime(this.currentTime);
    }
    // 点击播放视频
    $scope.Play = function(){
        video.play();
        $scope.isPause = false;//隐藏播放按钮
    }
    // 点击暂停视频
    $scope.Pause = function(){
        video.pause();
        $scope.isPlay = false;//隐藏暂停按钮
        $scope.isPause = true;//显示播放按钮
    }
    // 视频进度条的点击事件
    var flag = true;
    var totalLength = 0;
    $scope.changeVideoTime = function(e){
      if(flag){
        totalLength = e.target.offsetWidth;
        flag = false;
      }
      var currentLength = e.offsetX;//点击的偏移位置
      var percent = currentLength / totalLength * 100 + '%';//百分比
      video.currentTime = video.duration * (currentLength / totalLength);//视频播放时间随之改变
      $scope.currentTime = getFormatTime(video.currentTime);
      timeBar.style.width = percent;//进度条变化
    }
    console.log(111);
    
    //视频手势滑动快退/快进
    var control = false;
    var sPos = {};
    var mPos = {};
    var dire = '';
    video.addEventListener('touchstart', function(e){ 
        control = false;
        var point = e.touches ? e.touches[0] : e;
        sPos.x = point.screenX;
        sPos.y = point.screenY;
    }, false );
    video.addEventListener('touchmove', function(e){
        // e.stoppropagation();
        var point = e.touches ? e.touches[0] : e;
        control = true;
        mPos.x = point.screenX;
        mPos.y = point.screenY;
    }, false );
    video.addEventListener('touchend', function(e){
        if(!control){
            //显示工具条和播放器头部 
            if($scope.showCtrl){
                $scope.showCtrl = false;
            }else{
                $scope.showCtrl = true;
            }
            // 显示暂停按钮
            if($scope.isPause){
                $scope.isPlay = false;
            }else{
                $scope.isPlay = true;
            }
        }else{
            // 判断左右方向
            if(mPos.x - sPos.x >=100){
                dire = 'R';
            }else if(mPos.x - sPos.x <= -100){
                dire = 'L';
            }
            // 判断上下方向
            if(mPos.y - sPos.y >= 60){
                dire = 'D';
            }else if(sPos.y - mPos.y >= 60){
                dire = 'U';
            }
        }
        $scope.$digest();
        control = false;
        // 实现快进/快退
        backfn();
    }, false );
    // 回调函数
    var backfn = function(){    //回调事件
        // debugger
        // 快退/快进
        if(dire=="R"){
            video.currentTime += 5;
            if(video.currentTime >= video.duration){
              video.currentTime = video.duration;
            }
        }else if(dire=="L"){
            video.currentTime -= 5;
            if(video.currentTime <= 0){
              video.currentTime = 0;
            }
        }
        // 音量调节
        if(dire=='U'){
          if(video.volume >=0.95){
            video.volume = 1;
          }else{
            video.volume += 0.05;
          }
        }else if(dire=='D'){
          if(video.volume <= 0.05){
            video.volume = 0;
          }else{
            video.volume -= 0.05;
          }
        }
        $scope.volume = Math.floor(video.volume * 100);//音量变化
        $scope.currentTime = getFormatTime(video.currentTime);
        //播放时间百分比
        //进度条变化
        timeBar.style.width = video.currentTime / video.duration * 100 + "%";;
    }
    
    // 返回上一页
    $scope.back = function(){
      window.history.back();
    }
}])

//跳转后的新闻模块
.controller('newsCtrl',['$scope','$http','$state','$rootScope',function($scope,$http,$state,$rootScope){
  $scope.back_news_style = {
    "background-color" : "#2194CA"
  };
  $scope.news_title = '新闻';

  // 初始化获得新闻列表
  $scope.newslist = [];

  if($rootScope.hasSearch){
    $scope.newslist = $rootScope._NewsList;
  }else{
    $http({
        method:'GET',
        url:'/getNewsList'
    }).then(function(res){
        // 新闻列表
        $scope.newslist = res.data;
    });
  }
  
  // 搜索
  $scope.Search = function(str){
    $rootScope._NewsList = [];
    $state.go('search',{key:str});
  }
  // 下拉刷新
  $scope.doRefresh = function(){
    // 获取最新资源
    // 获得新闻列表
    $http({
        method:'GET',
        url:'/getNewsList'
    }).then(function(res){
        // 新闻列表
        $rootScope.hasSearch = false;
        $scope.newslist = res.data;
        $scope.$broadcast('scroll.refreshComplete');
    });
  }
}])

//论文详情页面
.controller('newsReadCtrl',['$scope','$http','$state','$stateParams','$rootScope',function($scope,$http,$state,$stateParams,$rootScope){
  var newsId = $stateParams.id;
  $scope.isComment = 1;
  $scope.comment = '';
  $scope.isLike = false;//收藏图标
  $scope.newsInfo = {};
  // 获取新闻详情
  $http.get('/newsInfo',{params: {"id":newsId }}).success(function(res){
    $scope.newsInfo = res.content;
  });
  // 获取新闻评论
  $http.get('/newsComment',{params: {"id":newsId }}).success(function(res){
    $scope.remark = res;
  });
  var likeNews = $rootScope.likeList.newslist;//课程收藏列表
  // 判断课程是否被收藏
  for(var i=0;i<likeNews.length;i++){
    if(likeNews[i].id===Number(newsId)){
      $scope.isLike = true;//变为已收藏
    }else{
      $scope.isLike = false;
    }
  }
  // 收藏icon变化
  $scope.collectNews = function(){
    if($scope.isLike){
      $scope.isLike = false;
    }else{
      $scope.isLike = true;
    }
  }
  // 发表评论
  $scope.submitComment = function(){
    // TO DO
    console.log($scope.comment);
    $scope.isComment = 1;
  }
  // 跳转到阅读页面
  $scope.goRead = function(){
    $state.go('paperRead',{id:$scope.paperId});
  }
  // 返回
  $scope.back = function(){
    window.history.back();
  }
}])
//跳转后的纪录片模块
.controller('videoCtrl',['$scope','$http','$state','$rootScope',function($scope,$http,$state,$rootScope){
  $scope.back_video_style = {
    "background-color" : "#17A668"
  };
  $scope.video_title = '纪录片';

  // 初始化获取纪录片列表
  $scope.videolist = [];

  if($rootScope.hasSearch){
    $scope.videolist = $rootScope._VideoList;
  }else{
     $http({
          method:'GET',
          url:'/getVideoList'
      }).then(function(res){
          // 纪录片列表
          $scope.videolist = res.data;
      });
  }
 

  // 搜索
  $scope.Search = function(str){
    $rootScope._VideoList = [];
    $state.go('search',{key:str});
  }
  // 下拉刷新
  $scope.doRefresh = function(){
    // 获取最新资源
    // 获得纪录片列表
    $http({
        method:'GET',
        url:'/getVideoList'
    }).then(function(res){
        // 纪录片列表
        $rootScope.hasSearch = false;
        $scope.videolist = res.data;
        $scope.$broadcast('scroll.refreshComplete');
    });
  }
}])
//纪录片内容详情
.controller('videoInfoCtrl',['$scope','$state','$http','$stateParams','$rootScope',function($scope,$state,$http,$stateParams,$rootScope){
  $scope.active = 1;//默认tab切换栏显示
  $scope.isComment = 1;
  var videoId = $stateParams.id;
  $scope.isLike = false;//收藏图标
  $scope.videoInfo = {};
  // 获取纪录片详情
  $http.get('/videoInfo',{params: {"id":videoId }}).success(function(res){
    $scope.videoInfo = res;
    console.log(res);
  });
  // 获取纪录片评论
  $http.get('/videoComment',{params: {"id":videoId }}).success(function(res){
    $scope.remark = res;
  });
  var likeVideos = $rootScope.likeList.videolist;//纪录片收藏列表

  // 判断课程是否被收藏
  for(var i=0;i<likeVideos.length;i++){
    if(likeVideos[i].id===Number(videoId)){
      $scope.isLike = true;//变为已收藏
    }else{
      $scope.isLike = false;
    }
  }
  // 收藏icon变化
  $scope.collectVideo = function(){
    if($scope.isLike){
      $scope.isLike = false;
    }else{
      $scope.isLike = true;
    }
  }
  // 发表评论
  $scope.submitComment = function(){
    // TO DO
    $scope.isComment = 1;
  }
  // 跳转到播放页面
  $scope.goPlay = function(url,name){
    $rootScope.videoUrl = url;
    $rootScope.videoName = name;
    $state.go('player');
  }
  $scope.back = function(){
    window.history.back();
  }
}])
//跳转后的论文模块
.controller('paperCtrl',['$scope','$http','$state','$rootScope',function($scope,$http,$state,$rootScope){
  $scope.back_paper_style = {
    "background-color" : "#DA9627"
  };
  $scope.paper_title = '论文';

  // 初始化获得论文列表
  $scope.paperlist = [];

  if($rootScope.hasSearch){
    $scope.paperlist = $rootScope._PaperList;
  }else{
     $http({
          method:'GET',
          url:'/getPaperList'
      }).then(function(res){
          // 纪录片列表
          $scope.paperlist = res.data;
      });
  }

  // 搜索
  $scope.Search = function(str){
    $rootScope._PaperList = [];
    $state.go('search',{key:str});
  }
  
  // 下拉刷新
  $scope.doRefresh = function(){
    // 获取最新资源
    // 获得论文列表
    $http({
        method:'GET',
        url:'/getPaperList'
    }).then(function(res){
        // 纪录片列表
        $rootScope.hasSearch = false;
        $scope.paperlist = res.data;
        $scope.$broadcast('scroll.refreshComplete');
    });
  }
}])

//论文详情页面
.controller('paperInfoCtrl',['$scope','$http','$state','$stateParams','$rootScope',function($scope,$http,$state,$stateParams,$rootScope){
  var paperId = $stateParams.id;
  $scope.active = 1;
  $scope.isComment = 1;
  $scope.comment = '';
  $scope.isLike = false;//收藏图标
  $scope.paperInfo = {};
  // 获取论文详情
  $http.get('/paperInfo',{params: {"id":paperId }}).success(function(res){
    $scope.paperInfo = res.content;
    $rootScope.paperUrl = $scope.paperInfo.url;
  });
  // 获取论文评论
  $http.get('/paperComment',{params: {"id":paperId }}).success(function(res){
    $scope.remark = res;
  });
  var likePaper = $rootScope.likeList.paperlist;//课程收藏列表
  // 判断课程是否被收藏
  for(var i=0;i<likePaper.length;i++){
    if(likePaper[i].id===Number(paperId)){
      $scope.isLike = true;//变为已收藏
    }else{
      $scope.isLike = false;
    }
  }
  // 收藏icon变化
  $scope.collectPaper = function(){
    if($scope.isLike){
      $scope.isLike = false;
    }else{
      $scope.isLike = true;
    }
  }
  // 发表评论
  $scope.submitComment = function(){
    // TO DO
    console.log($scope.comment);
    $scope.isComment = 1;
  }
  // 跳转到阅读页面
  $scope.goRead = function(){
    $state.go('paperRead');
  }
  // 返回
  $scope.back = function(){
    window.history.back();
  }
}])
// 论文阅读页面
.controller('paperReadCtrl',['$scope','$http','$state','$rootScope',function($scope,$http,$state,$rootScope){
  // pdf.js
  var url = $rootScope.paperUrl;  
  //加载核心文件  
  PDFJS.workerSrc = 'js/vendor/pdf.worker.js';  
    
  var loadingTask = PDFJS.getDocument(url);  
  loadingTask.promise.then(function(pdf) {   
    // PDF总页数
    var totalNumber = pdf.numPages; 
    // 从第一页开始渲染
    for(let pageNumber=1;pageNumber<=totalNumber;pageNumber++){
      pdf.getPage(pageNumber).then(function(page) {   
        
        let scale = 1.0;  
        let viewport = page.getViewport(scale);  

        let ReaderPanel = document.getElementById('pdfReader'); 

        let canvas = document.createElement("canvas");
        let context = canvas.getContext('2d');
        ReaderPanel.appendChild(canvas);

        canvas.height = viewport.height;  
        canvas.width = viewport.width;  
      
        let renderContext = {  
          canvasContext: context,  
          viewport: viewport  
        };  
        let renderTask = page.render(renderContext);  
        renderTask.then(function () {  
          console.log('Page rendered');  
        });  
    });
    }
     
  }, function (reason) {  
    console.error(reason);  
  });
  // 返回
  $scope.back = function(){
    window.history.back();
  }
}])
//测试列表界面
.controller('TestsCtrl', ['$scope','$state','$stateParams','$http','$rootScope','$ionicPopup',function($scope,$state,$stateParams,$http,$rootScope,$ionicPopup){
  // 获得测试列表
  $http({
    method:'GET',
    url:'/getTestList'
  }).then(function(res){
    $scope.tests = res.data;
    console.log(res);
  });
  // 进入试题
  $scope.goTest = function(obj){
    if(obj.status==='未完成'){
      // 获得所有题目
      $http({
          method:'GET',
          url:'/getTestInfo/uncomplete',
          params:{id:obj.id}
      }).then(function(res){
          $rootScope['testQuestions'] = res.data.body;
          // 是否进入测试弹窗
          $ionicPopup.confirm({
            title: '进入测试',
            template: "确定进入“"+obj.name+"”试题吗？（一旦进入测试不可中途退出）"
          }).then(function(res) {
            if(res) {
              // 进入测试
              $state.go('exercise',{exerName:obj.name,exerStatus:obj.status});
            } else {
              console.log('You are not sure');
            }
          });
      });
    }else if(obj.status==='已完成'){
      // 获得所有题目
      $http({
          method:'GET',
          url:'/getTestInfo/completed',
          params:{id:obj.id}
      }).then(function(res){
          $rootScope['testQuestions'] = res.data.body;
          $state.go('exercise',{exerName:obj.name,exerStatus:obj.status,exerId:obj.id});
      });
    }
  }
  $scope.back = function(){
    window.history.back();
  }
}])

// 试题
.controller('exerciseCtrl',['$scope','$state','$rootScope','$stateParams','$interval','$http','$ionicPopup',function($scope,$state,$rootScope,$stateParams,$interval,$http,$ionicPopup){
  var questions = $rootScope['testQuestions'];
  // 获得路由传递的参数
  $scope.question = questions.question;
  $scope.exerName = $stateParams.exerName;//测试名称
  var status = $stateParams.exerStatus;//测试状态
  var testId = $stateParams.exerId;//测试编号

  $scope.exerTotal = questions.question.length;//一共有多少题
  $scope.currentIndex = 1;//当前的题号
  $scope.exerType = questions.question[0].typeName;//第一题的类型
  $scope.exerTitle = questions.question[0].title;//第一题题目
  $scope.exerOptions = questions.question[0].options;//第一题选项
  
  $scope.isRadio = true;//单选题还是多选题
  $scope.isSheet = false;//是否显示答题卡
  $scope.isResult = false;//是否显示结果
  $scope.resultFlag = false;
  $scope.answer = {};//答案
  $scope.correctAnswer = {};//正确答案
  $scope.yourAnswer = {};//你的答案

  // 提交返回结果
  $scope.submitAnswer = function(time){
    // 整理答案格式
    checkAnswer = [];
    for(var key in $scope.answer){
      if(typeof($scope.answer[key])==='object'){
        var answers = [];
        for(var i in $scope.answer[key]){
          if($scope.answer[key][i]!==undefined){
            answers.push($scope.answer[key][i]);
          }
        }
        checkAnswer.push(answers);
      }else{
        checkAnswer.push($scope.answer[key]);
      }
    }
    // 拼接提交的数据
    var id = sessionStorage.getItem('userId');
    var exerData = {
      'studentid':id,
      'testid':testId,
      'option':checkAnswer
    }

    // 时间结束自动提交
    if(time){
      $http({
           method:'POST',
           url:'/question_submit',
           data:exerData
       }).then(function(res){
           var results = res.data.body;
           $scope.trueArr = results.answerIstrueArr;
           $scope.isResult = true;
           // 弹出消息框
           var alertPopup = $ionicPopup.alert({
             title: '测试时间到',
             template: '测试时间截止，答题卡自动提交'
           });
           alertPopup.then(function(res) {
            // 重新获取题目
             $http({
                  method:'GET',
                  url:'/getTestInfo/completed',
                  params:{id:testId}
              }).then(function(res){
                  questions = res.data.body;
                  status = '已完成';
                  $scope.isTest = true;//是否为考试状态
                  $scope.resultFlag = true;
              });
           });
       });
    }else{//点击提交按钮提交答题卡
      // 提交确认弹窗
      $interval.cancel($scope.interval);//停止倒计时
      var confirmPopup = $ionicPopup.confirm({
         title: '提交答题卡',
         template: '确定结束测试并提交答题卡吗?'
      });
      confirmPopup.then(function(res) {
        if(res) {
         // 提交答案
         $http({
             method:'POST',
             url:'/question_submit',
             data:exerData
         }).then(function(res){
             var results = res.data.body;
             $scope.trueArr = results.answerIstrueArr;
             // 重新获取题目
             $http({
                  method:'GET',
                  url:'/getTestInfo/completed',
                  params:{id:testId}
              }).then(function(res){
                  questions = res.data.body;
                  status = '已完成';
                  $scope.resultFlag = true;
                  $scope.isResult = true;//显示答题结果
                  $scope.isTest = true;//是否为考试状态
              });
         });
        } else {
          console.log('You are not sure');
        }
      });
    }
    
  }

  // 考试时间倒计时
  $scope.timeDown = function(){
    var times = $scope.exerTime * 60;
    $scope.interval = $interval(function(){
      if(times<=0){
        $interval.cancel($scope.interval);
        $scope.submitAnswer(true);
      }else{
        times--;
        var hour = parseInt(times/3600);
        var minute = parseInt(times%3600/60);
        var second = parseInt(times-3600*hour-60*minute); 
        $scope.time = Math.floor(hour/10)+hour%10+':'+Math.floor(minute/10)+minute%10+':'+Math.floor(second/10)+second%10;
      }
    },1000);
  }

  // 初始化第一题 获得试题的时间
  if(status==='未完成'){
      $scope.isTest = false;//选项是否可以选择
      $scope.exerTime = questions.time;//时间
      // 执行倒计时
      $scope.timeDown();

      $scope.isSelected = {};//是否选择完题目
      // 初始化判断题目类型
      if($scope.exerType==='单选'){
        $scope.isRadio = true;
        $scope.answer[$scope.currentIndex] = undefined;
      }else if($scope.exerType==='多选'){
        $scope.isRadio = false;
        $scope.answer[$scope.currentIndex] = [];
        for(var i=0;i<$scope.exerOptions.length;i++){
          $scope.answer[$scope.currentIndex][i] = undefined;
        }
      }
      // 初始化选择题目 的状态
      for(var i=0;i<$scope.exerTotal;i++){
        $scope.isSelected[i+1] = false;
      }
  }else if(status==='已完成'){
      $scope.isTest = true;
      // 将已选择的答案显示出来
      $scope.correctAnswer[$scope.currentIndex] = $scope.question[0].correctAnswer;//正确答案
      $scope.yourAnswer[$scope.currentIndex] = $scope.question[0].hasSelected;//正确答案
      if($scope.exerType==='单选'){
        $scope.isRadio = true;
        $scope.answer[$scope.currentIndex] = $scope.question[0].hasSelected;
      }else if($scope.exerType==='多选'){
        $scope.isRadio = false;
        var length = $scope.question[0].options.length;
        $scope.answer[$scope.currentIndex] = [];
        for(var j=0;j<length;j++){
          if($scope.question[i].hasSelected.indexOf(j+1)>-1){
            $scope.answer[$scope.currentIndex][j] = j+1;
          }else{
            $scope.answer[$scope.currentIndex][j] = undefined;
          }
        }
      }
  }
  
  // 单选选择选项触发事件
  $scope.changeChoice = function(index){
    if(!$scope.isTest){//未完成时可点击
      $scope.isSelected[$scope.currentIndex] = true;
      $scope.answer[$scope.currentIndex] = index;
    }
  }

  // 多选触发事件
  $scope.changeCheckChoice = function(index){
    if(!$scope.isTest){//未完成时可点击
      $scope.isSelected[$scope.currentIndex] = false;
      if($scope.answer[$scope.currentIndex][index-1]===index){
        $scope.answer[$scope.currentIndex][index-1] = undefined;
      }else{
        $scope.answer[$scope.currentIndex][index-1] = index;
      }
      // 判断是否有选项
      for(var i=0;i<$scope.answer[$scope.currentIndex].length;i++){
        if($scope.answer[$scope.currentIndex][i]!==undefined){
          $scope.isSelected[$scope.currentIndex] = true;
        }
      }
    }
  }
  
  // 上一题
  $scope.pre = function(){
    if($scope.currentIndex > 1){
      $scope.currentIndex --;
      $scope.exerType = questions.question[$scope.currentIndex-1].typeName;
      $scope.exerTitle = questions.question[$scope.currentIndex-1].title;
      $scope.exerOptions = questions.question[$scope.currentIndex-1].options;
      // 当为未完成时
      if(!$scope.isTest){
        // 判断题目类型
        if($scope.exerType==='单选'){
          $scope.isRadio = true;
          // 未选择的情况
          if(typeof($scope.answer[$scope.currentIndex])!=='number'){
            $scope.answer[$scope.currentIndex] = undefined;
          }
        }else if($scope.exerType==='多选'){
          $scope.isRadio = false;
          // 未选择的情况
          if(!$scope.answer[$scope.currentIndex]){
            $scope.answer[$scope.currentIndex] = [];
            for(var i=0;i<$scope.exerOptions.length;i++){
              $scope.answer[$scope.currentIndex][i] = undefined;
            }
          }
        }
      }
    }
  }
  // 下一题
  $scope.next = function(){
    if($scope.currentIndex === $scope.exerTotal){
      if(!$scope.isTest){
        $scope.isSheet = true;
      }else{
        $scope.isSheet = false;
      }
    }else{
      $scope.currentIndex ++;
      var ques = questions.question[$scope.currentIndex-1];
      $scope.exerType = questions.question[$scope.currentIndex-1].typeName;
      $scope.exerTitle = questions.question[$scope.currentIndex-1].title;
      $scope.exerOptions = questions.question[$scope.currentIndex-1].options;
      //已完成
      if(status==='已完成'){
        $scope.correctAnswer[$scope.currentIndex] = ques.correctAnswer;//正确答案
        $scope.yourAnswer[$scope.currentIndex] = ques.hasSelected;//你的答案
        // 将已选择的答案显示出来
        if($scope.exerType==='单选'){
          $scope.isRadio = true;
          $scope.answer[$scope.currentIndex] = ques.hasSelected;
        }else if($scope.exerType==='多选'){
          $scope.isRadio = false;
          var length = ques.options.length;
          $scope.answer[$scope.currentIndex] = [];
          for(var j=0;j<length;j++){
            console.log(ques.hasSelected);
            if(ques.hasSelected.indexOf(j+1)>-1){
              $scope.answer[$scope.currentIndex][j] = j+1;
            }else{
              $scope.answer[$scope.currentIndex][j] = undefined;
            }
          }
        }
      }else if(status==='未完成'){//未完成
        // 判断题目类型
        if($scope.exerType==='单选'){
          $scope.isRadio = true;
          if(!$scope.answer[$scope.currentIndex]){
            $scope.answer[$scope.currentIndex] = undefined;
          }
        }else if($scope.exerType==='多选'){
          $scope.isRadio = false;
          if(!$scope.answer[$scope.currentIndex]){
            $scope.answer[$scope.currentIndex] = [];
            for(var i=0;i<$scope.exerOptions.length;i++){
              $scope.answer[$scope.currentIndex][i] = undefined;
            }
          }
        }
      }
    }
  }
  // 取消答题卡
  $scope.cancelSheet = function(){
    $scope.isSheet = false;
    // 返回到课程列表页面
    if($scope.isResult){
      $scope.isResult = false;
      window.history.back();
    }
  }

  // 从答题卡上跳转到某一题目
  $scope.turnQues = function(n){
    $scope.isSheet = false;
    $scope.isResult = false;
    $scope.currentIndex = n;
    var ques = questions.question[$scope.currentIndex-1];
    $scope.exerType = questions.question[$scope.currentIndex-1].typeName;
    $scope.exerTitle = questions.question[$scope.currentIndex-1].title;
    $scope.exerOptions = questions.question[$scope.currentIndex-1].options;
    // 判断是否完成
    if(status==='已完成'){
      $scope.correctAnswer[$scope.currentIndex] = ques.correctAnswer;//正确答案
      $scope.yourAnswer[$scope.currentIndex] = ques.hasSelected;//你的答案
      // 将已选择的答案显示出来
      if($scope.exerType==='单选'){
        $scope.isRadio = true;
        $scope.answer[$scope.currentIndex] = ques.hasSelected;
      }else if($scope.exerType==='多选'){
        $scope.isRadio = false;
        var length = ques.options.length;
        $scope.answer[$scope.currentIndex] = [];
        for(var j=0;j<length;j++){
          console.log(ques.hasSelected);
          if(ques.hasSelected.indexOf(j+1)>-1){
            $scope.answer[$scope.currentIndex][j] = j+1;
          }else{
            $scope.answer[$scope.currentIndex][j] = undefined;
          }
        }
      }
    }else if(status==='未完成'){
      // 判断题目类型
      if($scope.exerType==='单选'){
        $scope.isRadio = true;
        if(!$scope.answer[$scope.currentIndex]){
          $scope.answer[$scope.currentIndex] = undefined;
        }
      }else if($scope.exerType==='多选'){
        $scope.isRadio = false;
        if(!$scope.answer[$scope.currentIndex]){
          $scope.answer[$scope.currentIndex] = [];
          for(var i=0;i<$scope.exerOptions.length;i++){
            $scope.answer[$scope.currentIndex][i] = undefined;
          }
        }
      }
    }
  }

  // 返回
  $scope.back = function(){
    if($scope.resultFlag){
      $scope.isResult = true;
    }else{
      window.history.back();
    }
  }
}])
//个人中心
.controller('AccountCtrl', ['$rootScope','$scope','$state','$ionicViewSwitcher',function($rootScope,$scope,$state,$ionicViewSwitcher) {
  if(sessionStorage.userName){
    $scope.selfName = sessionStorage.userName;
    // $scope.selfImage = $cookies.get('headPic');
  }else{
    $scope.selfName = '';
    $scope.selfImage = '';
  }
  // console.log($cookies.getObject('userInfo'));
  $scope.defaultImg = 'img/defaultPic.png';
  $scope.logout = function(){
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName'); 
    $state.go('login');
  }
  $scope.login = function(){
    $state.go('login');
  }
  // 跳转到我的收藏页面
  $scope.goCollect = function(){
    $state.go('myCollect',{'id':sessionStorage.userId});
    $ionicViewSwitcher.nextDirection("forward");
  }
}])

// 我的收藏
.controller('myCollectCtrl',['$scope','$http','$state','$stateParams','$rootScope','$ionicViewSwitcher',
  function($scope,$http,$state,$stateParams,$rootScope,$ionicViewSwitcher){
    var userId = $stateParams.id;
    $scope.listCourse = $rootScope.likeList.courselist?$rootScope.likeList.courselist:[];
    $scope.listVideo = $rootScope.likeList.videolist?$rootScope.likeList.videolist:[];
    $scope.listNews = $rootScope.likeList.newslist?$rootScope.likeList.newslist:[];
    $scope.listPaper = $rootScope.likeList.paperlist?$rootScope.likeList.paperlist:[];
    
    // 返回个人中心页面
    $scope.back = function(){
      $state.go('tab.account');
      $ionicViewSwitcher.nextDirection("back");
    }
  }]);
