//requirements - gulp, jade, browsersync
var gulp        = require('gulp'),
	jade        = require('gulp-jade'),
	bs = require('browser-sync').create();

//tasks
gulp.task('serve', function(){
	bs.init({
		browser: ["google chrome"],
        proxy: "l.jade",
        port: 8081
		 // server: {
		 //     // baseDir: "./",

		 // }
	});
});

gulp.task('jade', ['reload'], function(){
  return gulp.src('jade/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./'));  
});

gulp.task('reload', function(){

		bs.reload();

});

//listen for changes to  files
gulp.task('watch', function(){
	gulp.watch(['jade/*.jade'],	['jade']);
	gulp.watch(['*.html', 'css/*.css', 'js/*.js'], ['reload']);
});

gulp.task('default', ['serve', 'watch']);