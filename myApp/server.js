//模块依赖
var express =  require('express');
var bodyParser = require('body-parser');  

var sendMail = require('./mail.js');
//连接mysql
// var db = mysql.createConnection(config);
//console.log('数据库连接success');
//创建应用
var app = express();
// var router = express.Router();

var appData = require('./mock/data.json');
var students = appData.students;

var courseListData = require('./mock/courseList.json');
var newsListData = require('./mock/newsList.json');
var videoListData = require('./mock/videoList.json');
var paperListData = require('./mock/paperList.json');
var TestListData = require('./mock/courseTestList.json');
var completedData = require('./mock/completed.json');
var uncompleteData = require('./mock/uncomplete.json');
var likeListData = require('./mock/like.json');
var courseData = require('./mock/courseInfo.json');
var newsData = require('./mock/newsInfo.json');
var paperData = require('./mock/paperInfo.json');
var videoData = require('./mock/videoInfo.json');
var videoCommentData = require('./mock/videoComment.json');
var courseCommentData = require('./mock/courseComment.json');
var paperCommentData = require('./mock/paperComment.json');
var newsCommentData = require('./mock/newsComment.json');


app.use(bodyParser.urlencoded({ extended: false }));//extended为false表示使用querystring来解析数据，这是URL-encoded解析器  
app.use(bodyParser.json());
app.use(express.static('www'));

exports = module.exports = function(path){
	//登录验证
	app.post('/students_info', function (req, res) {
		var user_info = req.body;
		var flag = false;
		for(var index in students){
			console.log(user_info);
			console.log(students[index]);
			flag = (user_info.Id === students[index].id && user_info.Pass === students[index].pass);
			if(flag){
				res.json({
					data:{"result":flag,"user":students[index]}
				});
				break;
			}
		}
		if(!flag){
			res.json({
				data:{result:flag}
			});
		}
	});

	//发送邮件验证码
	app.post('/get_verification',function(req,res){
		var mailAddr = req.body.mail;
		console.log(mailAddr);
		var title = "【大数据资源网】邮箱验证码";
		//随机生成验证码
		var Num=""; 
		for(var i=0;i<6;i++) 
		{ 
			Num+=Math.floor(Math.random()*10); 
		} 
		var content = '亲爱的大数据资源网用户，您的验证码是('+Num+'),千万不要告诉别人哦~';

		// 拼接 2373498353@qq.com
		var mailOptions = {
		    from: '462156634@qq.com', // 发件地址
		    to: mailAddr, // 收件列表
		    subject: title, // 标题
		    //text和html两者只支持一种
		    text: content, // 标题
		    html: '<b>'+content+'</b>' // html 内容
		};
		// 发送邮件
		sendMail(mailOptions);
		res.json({
			data:{identify:Num,mail:mailAddr}
		});
	});

	//修改密码
	app.post('/alter_pass',function(req,res){
		var new_pass = req.body.newPass;
		res.json({
			data:{status:true}
		});
	});
	// 全局搜索
	app.get('/globalSearch',function(req,res){
		var key = req.query.key;
		var data = {
			"courselist":[],
			"newslist":[],
			"videolist":[],
			"paperlist":[]
		};
		if(key){
			// 循环遍历课程寻找符合条件的对象
			for(var i in courseListData){
				if(courseListData[i]['name'].indexOf(key)>=0){
					data.courselist.push(courseListData[i]);
				}
			}
			// 循环遍历纪录片寻找符合条件的对象
			for(var i in videoListData){
				if(videoListData[i]['name'].indexOf(key)>=0){
					data.videolist.push(videoListData[i]);
				}
			}// 循环遍历新闻寻找符合条件的对象
			for(var i in newsListData){
				if(newsListData[i]['name'].indexOf(key)>=0){
					data.newslist.push(newsListData[i]);
				}
			}// 循环遍历论文寻找符合条件的对象
			for(var i in paperListData){
				if(paperListData[i]['name'].indexOf(key)>=0){
					data.paperlist.push(paperListData[i]);
				}
			}
		}else{
			data = {
				"courselist":[],
				"newslist":[],
				"videolist":[],
				"paperlist":[]
			};
		}
		
		res.json(data);
	});
	// 课程搜索
	app.get('/courseSearch',function(req,res){
		var key = req.query.key;
		var data = [];
		if(key){
			// 循环遍历课程寻找符合条件的对象
			for(var i in courseListData){
				if(courseListData[i]['name'].indexOf(key)>=0){
					data.push(courseListData[i]);
				}
			}
		}else{
			data = [];
		}
		
		res.json(data);
	});
	// 纪录片搜索
	app.get('/videoSearch',function(req,res){
		var key = req.query.key;
		var data = [];
		if(key){
			// 循环遍历课程寻找符合条件的对象
			for(var i in videoListData){
				if(videoListData[i]['name'].indexOf(key)>=0){
					data.push(videoListData[i]);
				}
			}
		}else{
			data = [];
		}
		
		res.json(data);
	});
	// 新闻搜索
	app.get('/newsSearch',function(req,res){
		var key = req.query.key;
		var data = [];
		if(key){
			// 循环遍历课程寻找符合条件的对象
			for(var i in newsListData){
				if(newsListData[i]['name'].indexOf(key)>=0){
					data.push(newsListData[i]);
				}
			}
		}else{
			data = [];
		}
		
		res.json(data);
	});
	// 论文搜索
	app.get('/paperSearch',function(req,res){
		var key = req.query.key;
		var data = [];
		// 循环遍历课程寻找符合条件的对象
		for(var i in paperListData){
			if(paperListData[i]['name'].indexOf(key)>=0){
				data.push(paperListData[i]);
			}
		}
		res.json(data);
	});
	//收藏列表
	app.get('/likeList',function(req,res){
		res.json(likeListData);
	});
	//课程列表
	app.get('/getCourseList',function(req,res){
		res.json(courseListData);
	});
	//课程详情
	app.get('/courseInfo',function(req,res){
		var id = Number(req.query.id);
		for(var i=0;i<courseData.length;i++){
			if(courseData[i].id===id){
				res.json(courseData[i]);
				break;
			}
		}
	});
	// 课程评论
	app.get('/courseComment',function(req,res){
		var id = Number(req.query.id);
		res.json(courseCommentData);
	});
	//新闻列表
	app.get('/getNewsList',function(req,res){
		res.json(newsListData);
	});
	//新闻详情
	app.get('/newsInfo',function(req,res){
		var id = Number(req.query.id);
		for(var i=0;i<newsData.length;i++){
			if(newsData[i].id===id){
				res.json(newsData[i]);
				break;
			}
		}
	});
	// 新闻评论
	app.get('/newsComment',function(req,res){
		var id = Number(req.query.id);
		res.json(newsCommentData);
	});
	//纪录片列表
	app.get('/getVideoList',function(req,res){
		res.json(videoListData);
	});
	//纪录片详情
	app.get('/videoInfo',function(req,res){
		var id = Number(req.query.id);
		for(var i=0;i<videoData.length;i++){
			if(videoData[i].id===id){
				res.json(videoData[i]);
				break;
			}
		}
	});
	// 纪录片评论
	app.get('/videoComment',function(req,res){
		var id = Number(req.query.id);
		res.json(videoCommentData);
	});
	//论文列表
	app.get('/getPaperList',function(req,res){
		res.json(paperListData);
	});
	//论文详情
	app.get('/paperInfo',function(req,res){
		var id = Number(req.query.id);
		for(var i=0;i<paperData.length;i++){
			if(paperData[i].id===id){
				res.json(paperData[i]);
				break;
			}
		}
	});
	// 论文评论
	app.get('/paperComment',function(req,res){
		var id = Number(req.query.id);
		res.json(paperCommentData);
	});
	//测试列表
	app.get('/getTestList',function(req,res){
		res.json(TestListData);
	});
	//未完成的试题
	app.get('/getTestInfo/uncomplete',function(req,res){
		res.json({body:uncompleteData});
	});
	//已完成的试题
	app.get('/getTestInfo/completed',function(req,res){
		res.json({body:completedData});
	});
	//提交试题
	app.post('/question_submit',function(req,res){
		var returnData = { studentid: 1,testid: 1,answerIstrueArr: [ 0, 0, 1, 1 ],trueOptionArr: [ 4, 4, 4, 1 ]};
		res.json({body:returnData});
	});

	app.listen(8000);
	console.log('server start!');    
}