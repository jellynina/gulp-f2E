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
  swig    = require('gulp-swig'),
  request = require('request'),
  jsonfile = require('jsonfile');

var opt = {
  'src': './src',
  'sass': './src/scss',
  'js': './src/js',
  'json': './src/json',
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
  'lib/jquery/dist/jquery.min.js',
  'lib/magnific-popup/dist/jquery.magnific-popup.min.js',
  opt.src +'/js/nav.js',
  opt.src +'/js/behance.js'
];


// get data
var apiKey = 'MoepDSejShHpWYHdQHAZsEsMAi9yCWnY';
var userID = 'NinaIkea';
var perPage = 12;
var behanceUserAPI = 'http://www.behance.net/v2/users/' + userID + '?callback=?&api_key=' + apiKey;
var behanceProjectAPI = 'http://www.behance.net/v2/users/' + userID + '/projects?&api_key=' + apiKey + '&per_page=' + perPage;

// 問題 callback=? , &per_page= 的存在必要
var dataAPI;


var getData = function (url, callback){

  console.log('getData start.');
  request({
    url: url,
    json: true,
    headers: {
       'Content-Type': 'application/json'
    }
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      callback(body);
    }
  });
}

gulp.task('json', function () {
  return getData(behanceProjectAPI, function (body) {
    dataAPI = JSON.parse(JSON.stringify(body));
    //var dataString = dataAPI.slice(6, dataAPI.length - 2); //TODO: 這很白癡
    //dataAPI = JSON.parse(dataString);
    // console.log(dataAPI.projects);
    jsonfile.writeFile( 'projects.json', dataAPI.projects,{spaces: 2}, function (err) {
      console.error(err)
    })
    return dataAPI.projects
  });
});



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



gulp.task('view', ['sass', 'json'], function () {
  return gulp.src(opt.view + '/*.html')
  .pipe(plumber())
  .pipe(swig({
    setup: function (swig){
      swig.setDefaults({
        locals: {
          projects: require('./projects.json')
        }
      });
    }
  }))
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

watch([opt.sass + '/**/*.scss', opt.view + '/**/*.html'], function() {
  gulp.start('view');
});

watch(opt.js + '/*.js', function () {
  gulp.start('concatScripts');
});


gulp.task("build", ['concatScripts', 'view'], function (){
  return gulp.src(distAccess, { base: opt.src})
            .pipe(gulp.dest(opt.dist));
});

gulp.task('default', ['build'], function (){
  gulp.start('run');
});
