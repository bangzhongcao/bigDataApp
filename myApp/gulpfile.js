var gulp = require('gulp');
var less = require('gulp-less');
var server = require('./server');

var paths = {
  less: ['./less/**/*.less']
};

gulp.task('less', function() {
  gulp.src('./less/index.less')
    .pipe(less())
    .pipe(gulp.dest('./www/css'));
});

gulp.task('server', function() {
  server('index.html');   //这里假设静态文件根目录为public
  gulp.watch(paths.less, ['less']);
});


gulp.task('default', ['server','less']);