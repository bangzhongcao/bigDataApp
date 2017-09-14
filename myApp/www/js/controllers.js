angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$ionicScrollDelegate) {
  $scope.isHidden = false;
  // 搜索框颜色渐变
  $scope.scroll = function(){
    var banner = document.getElementsByClassName('head_search')[0];
    var imgList = document.getElementsByClassName('imgList')[0];
    var height = imgList.offsetHeight - banner.offsetHeight;
    var top = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
    if(top>=0){
      $scope.$apply(function(){
        $scope.isHidden = false;
      });
      if(top>height){
        banner.style.backgroundColor = 'rgba(217,83,79,1)';
      }else{
        var op = top/height* 1;
        banner.style.backgroundColor = 'rgba(217,83,79, '+op+')';
      }
    }else{
      $scope.$apply(function(){
        $scope.isHidden = true;
      });
    }
    
  }
  $scope.modulelist=[{
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
  }];

  $scope.courselist = [{
    id:1,
    img:'img/course1.png',
    name:'Spark从零开始',
    intro:'本课程旨在让同学们了解Spark基础知识，掌握Spark基础开发。'
  },{
    id:2,
    img:'img/course2.png',
    name:'R语言入门与进阶',
    intro:'这门课将会带领您领略R语言的精髓,打开R语言的大门。'
  }];

  $scope.newslist = [{
    id:1,
    img:'img/news1.png',
    name:'指南 ▏如何快速全面建立自己的大数据知识体系？',
    time:'2017-07-24 09:37'
  },{
    id:2,
    img:'img/news2.png',
    name:'关于大数据中的用户画像那些事，看这篇一文章就够了',
    time:'2017-07-21 15:25'
  }];

  $scope.videolist = [{
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
  }];

  $scope.paperlist = [{
    pclass:'[硕士学位论文]',
    name:'面向大数据查询的索引技术研究',
    author:'朱春莹  计算机科学与技术 山东大学',
    time:'2016(学位年度)',
    keyword:'数据查询 数据分类'
  },{
    pclass:'[会议论文]',
    name:' 大数据及其应用',
    author:'冯斐   2015航空试验测试技术学术交流会',
    time:'2015',
    keyword:'大数据 特征 处理技术 大数据应用'
  },{
    pclass:'[期刊论文]',
    name:' 大数据与推荐系统',
    author:'李翠平 蓝梦微 邹本友 王绍卿 赵衎衎 《大数据》',
    time:'2015年1期',
    keyword:'大数据 OLAP SQL分析 SQL on Hadoop'
  }];

  $scope.imglist = [{
    url:'main',
    img:'img/carousel1.png'
  },{
    url:'main',
    img:'img/carousel2.jpg'
  },{
    url:'main',
    img:'img/carousel3.jpg'
  }];
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
