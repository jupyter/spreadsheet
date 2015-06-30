var gulp  = require('gulp'),
    gutil = require('gulp-util');
    typescript = require('gulp-typescript');

// create a default task and just log a message
gulp.task('default', function() {
	var project = typescript.createProject({
    	declarationFiles: false,
    	noImplicitAny: true,
    	target: 'ES5',
  	});

  	var sources = [
    	'spreadsheet.ts'
  	];

  return gulp.src(sources)
  	.pipe(typescript(project))
  	.pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
	gulp.watch('*.ts', ['default']);
});