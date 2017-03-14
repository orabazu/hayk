// including plugins
var gulp = require('gulp');
var uglify = require("gulp-uglify");
var cleanCSS = require('gulp-clean-css');
// var bower_files = require('bower-files')();
var concat = require("gulp-concat");
var ngAnnotate = require('gulp-ng-annotate');
var watch = require('gulp-watch');

// gulp.task('bower-minify', function () {
//     console.log(bower_files.ext('js').files);
//     gulp.src(bower_files.ext('js').files)
//       .pipe(concat('lib.min.js')) 
//       .pipe(uglify())
//       .pipe(gulp.dest('dist/lib'));
// });

// gulp.task('bower-minify-css', function () {
//     console.log(bower_files.ext('css').files);
//     return gulp.src(bower_files.ext('css').files)
//      .pipe(concat('lib.min.css'))
//      .pipe(cleanCSS({compatibility: 'ie8'}))
//      .pipe(gulp.dest('dist/lib'));
// });

// gulp.task('bower-fonts', function () {
//     var dic = bower_files.ext('eot').files
//         .concat(bower_files.ext('svg').files)
//         .concat(bower_files.ext('otf').files)
//         .concat(bower_files.ext('ttf').files)      
//         .concat(bower_files.ext('woff').files)
//         .concat(bower_files.ext('woff2').files);
//     console.log(dic)
//     return gulp.src(dic)
//      .pipe(gulp.dest('dist/fonts'));
// });

var componentsPath = 'client/components/*/*.js';
var contentJS = 'client/components/content/*/*.js';
var commonJS = 'client/components/common/*/*.js';
var userJS = 'client/components/user/*/*.js';
var rotaJS = 'client/components/rota/*/*.js';
var servicePath = 'client/services/*.js';
var servicePath2 = 'client/services/*/*.js';
var componentsPathcss = 'client/components/*/*.css';

var vendorPath = [
'client/bower_components/jquery/dist/jquery.min.js',
'client/bower_components/bootstrap/dist/js/bootstrap.min.js',
'client/bower_components/angular/angular.min.js',
'client/bower_components/angular-ui-router/release/angular-ui-router.min.js',
'client/bower_components/leaflet/dist/leaflet.js',
'client/bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.min.js',
'client/bower_components/oclazyload/dist/ocLazyLoad.min.js',
'client/bower_components/ng-file-upload/ng-file-upload-all.js',
'client/bower_components/ladda/dist/ladda.min.js',
'client/bower_components/ladda/dist/spin.min.js',
'client/bower_components/ladda/dist/ladda.min.js',
'client/bower_components/angular-ladda/dist/angular-ladda.min.js',
'client/bower_components/leaflet.gpx/leaflet.gpx.js',
'client/bower_components/typeahead/typeahead.bundle.js',
'client/bower_components/typeahead/angular-typeahead.js',
'client/bower_components/sticky/jquery.jsticky.min.js',
];

var vendorCSSPath = [
'client/bower_components/bootstrap/dist/css/bootstrap.min.css',
'client/bower_components/bootstrap/dist/css/bootstrap.min.css',
'client/bower_components/font-awesome/css/font-awesome.min.css',
'client/bower_components/leaflet/dist/leaflet.css',
'client/bower_components/ladda/dist/ladda.min.css',
];




var jsPath = [
  'client/components/utils.js',
  'client/components/app.js',    
  componentsPath,
  servicePath,
  servicePath2,
  userJS,
  'client/components/app.content.js',
  contentJS,
  commonJS, 
  rotaJS,
  '!client/components/*-spec.js',
  '!client/services/*-spec.js'
  ];
// task
gulp.task('minify-js', function () {
  return  gulp.src(jsPath) // path to your files
  .pipe(ngAnnotate())
  .pipe(concat('components.js'))
  // .pipe(uglify())
  .pipe(gulp.dest('client/dist/js'));
});

gulp.task('vendor-js', function () {
  return  gulp.src(vendorPath) // path to your files
  .pipe(concat('vendor.js'))
  //  .pipe(uglify())
  .pipe(gulp.dest('client/dist/js'));
});

gulp.task('minify-css', function() {
	return gulp.src([componentsPathcss, 'client/components/*/*/*.css'])
  .pipe(concat('components.css'))  
	// .pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(gulp.dest('client/dist/css'))
});

gulp.task('vendor-css', function() {
	return gulp.src(vendorCSSPath)
  .pipe(concat('vendor.css'))  
	// .pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(gulp.dest('client/dist/css'))
});

gulp.task('watch', function () {
      gulp.watch([jsPath], ['minify-js']);
      gulp.watch([componentsPathcss,'client/components/*/*/*.css'], ['minify-css']);
});


gulp.task('default', ['minify-js', 'minify-css','watch']);

