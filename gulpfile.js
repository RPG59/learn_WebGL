const gulp = require('gulp');
const connect = require('gulp-connect');

gulp.task('connect', () => {
	connect.server({
		port: 5959,
		livereload: true,
		root: './'
	});
})

gulp.task('reload', () => {
	gulp.src('src/*.js')
	.pipe(connect.reload())

})

gulp.task('watch', () => {
	gulp.watch(['src/*.js', 'index.html'], ['reload']);
})

gulp.task('default', ['connect', 'watch'])

