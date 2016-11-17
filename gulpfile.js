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
   //          // baseDir: "./",

   //      }
	});
	gulp.watch(['*.html', 'css/*.css', 'js/*.js']).on('change',function(event) {
		//body tag has to be present for reload to work
		bs.reload();
	});
});

gulp.task('jade', function(){
  return gulp.src('jade/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./'))
  ;
  
});

//listen for changes to  files
gulp.task('watch', function(){
	gulp.watch('jade/*.jade', ['jade']);
});



gulp.task('default', ['serve', 'watch']);
