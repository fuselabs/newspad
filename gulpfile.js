var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),  
	watch = require('gulp-watch'),
	clean = require('gulp-clean'),
	nodemon = require('gulp-nodemon'),
	bower = require('gulp-bower'),
	npm = require('gulp-npm');

gulp.task('clean',function() {
	return gulp.src(['build'], {read: false})
		.pipe(clean());
});

gulp.task('dev', function () {
	nodemon({ script: './server.js', ext: 'js', ignore: 'public/'})
		//.on('restart', ['default']);
	gulp.start('default')
});

gulp.task('npm', function () {
	return npm();
});

gulp.task('bower', function() {
	return bower().pipe(gulp.dest('public/components/'))
});

gulp.task('install', ['npm', 'bower']);

gulp.task('default', ['clean'],function(){
	
});

