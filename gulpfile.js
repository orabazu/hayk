// including plugins
var gulp = require('gulp');
var uglify = require("gulp-uglify");
var cleanCSS = require('gulp-clean-css');
// var bower_files = require('bower-files')();
var concat = require("gulp-concat");
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('bower-minify', function () {
    console.log(bower_files.ext('js').files);
    gulp.src(bower_files.ext('js').files)
      .pipe(concat('lib.min.js')) 
      .pipe(uglify())
      .pipe(gulp.dest('dist/lib'));
});

gulp.task('bower-minify-css', function () {
    console.log(bower_files.ext('css').files);
    return gulp.src(bower_files.ext('css').files)
     .pipe(concat('lib.min.css'))
     .pipe(cleanCSS({compatibility: 'ie8'}))
     .pipe(gulp.dest('dist/lib'));
});

gulp.task('bower-fonts', function () {
    var dic = bower_files.ext('eot').files
        .concat(bower_files.ext('svg').files)
        .concat(bower_files.ext('otf').files)
        .concat(bower_files.ext('ttf').files)      
        .concat(bower_files.ext('woff').files)
        .concat(bower_files.ext('woff2').files);
    console.log(dic)
    return gulp.src(dic)
     .pipe(gulp.dest('dist/fonts'));
});

// task
gulp.task('minify-js', function () {
  return  gulp.src('client/components/*/*.js') // path to your files
  .pipe(ngAnnotate())
  .pipe(concat('components.js'))

  // .pipe(uglify())
  .pipe(gulp.dest('client/dist/js'));
});


gulp.task('minify-css', function() {
	return gulp.src('./css/*.css')
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(gulp.dest('dist/css'))
});

gulp.task('default', ['minify-js', 'minify-css', 'bower-minify','bower-minify-css', 'bower-fonts']);