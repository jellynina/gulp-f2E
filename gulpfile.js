'use strict';

var gulp  = require('gulp'),
  concat  = require('gulp-concat'),
  uglify  = require('gulp-uglify'),
  watch =  require('gulp-watch'),
  rename  = require('gulp-rename'),
  sass    = require('gulp-sass'),
  maps    = require('gulp-sourcemaps'),
  webserver = require('gulp-webserver'),
  merge = require('merge-stream'),
  plumber = require('gulp-plumber'),
  del     = require('del'),
  swig    = require('gulp-swig');

var opt = {
  'src': './src',
  'sass': './src/scss',
  'js': './src/js',
  'view': './src/html',
  'dist': './dist'
}

var distAccess = [
  opt.src + '/img/**',
  opt.src + '/fonts/**',
  opt.src + 'favicon.ico',
  opt.src + '**/**.html'
];

var scriptArray = [
  opt.src +'/js/nav.js'
];


gulp.task('sass', function (){
  return gulp.src(opt.sass + '/style.scss')
  .pipe(plumber())
  .pipe(maps.init({loadMaps: true}))
  .pipe(sass({
    outputStyle: 'nested',
    //import_path: ['lib'],
    debug : true
  }).on('error', sass.logError))
  .pipe(maps.write('./')) //this path is going to be relative to our output directory ??
  .pipe(gulp.dest(opt.dist + '/css'));
});



gulp.task('view', function () {
  return gulp.src(opt.view + '/*.html')
  .pipe(plumber())
  .pipe(swig())
  .pipe(gulp.dest(opt.dist));
})

gulp.task("concatScripts", function () {
  return gulp.src(scriptArray)
  .pipe(plumber())
  .pipe(maps.init({loadMaps: true}))
  .pipe(concat("app.js")) // 把上面的js file 串近 app.js
  .pipe(maps.write())
  .pipe(gulp.dest(opt.dist + '/js')); //app.js 放到某個位置(js資料夾裡面)
});

gulp.task('clean', function(){
  del([opt.dist]);
});

gulp.task('run', function() {
  gulp.src(opt.dist)
    .pipe(webserver({
      livereload: true,
      open: false,
      port: 8080
    }));
});

watch([opt.sass + '/**/*.scss'], function() {
  gulp.start('sass');
});

watch(opt.js + '/*.js', function () {
  gulp.start('concatScripts');
});

watch(opt.view + '/**/*.html', function (){
  gulp.start('view');
});


gulp.task("build", ['sass', 'concatScripts', 'view'], function (){
  return gulp.src(distAccess, { base: opt.src})
            .pipe(gulp.dest(opt.dist));
});

gulp.task('default', ['build'], function (){
  gulp.start('run');
});
