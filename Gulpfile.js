// Require
// ----------------------------------------------------------------------------
var autoprefixer  = require('gulp-autoprefixer'),
    browserSync   = require('browser-sync'),
    concat        = require('gulp-concat'),
    critical      = require('critical'),
    data          = require('gulp-data'),
    fs            = require('fs'),
    gulp          = require('gulp'),
    imagemin      = require('gulp-imagemin'),
    jade          = require('gulp-jade'),
    minifyCss     = require('gulp-minify-css'),
    minifyHtml    = require('gulp-minify-html')
    notify        = require('gulp-notify'),
    path          = require('path'),
    reload        = browserSync.reload,
    rename        = require('gulp-rename'),
    rimraf        = require('gulp-rimraf'),
    sass          = require('gulp-sass'),
    uglify        = require('gulp-uglify'),
    uncss         = require('gulp-uncss');

// Paths
// ----------------------------------------------------------------------------

// Paths for source
var bower_source  = './source/bower_components',
    css_source    = './source/assets/stylesheets/',
    img_source    = './source/assets/images/',
    js_source     = './source/assets/javascripts',
    source        = './source';

// Paths for build
var bower_build   = './build/bower_components',
    css_build     = './build/assets/stylesheets/',
    img_build     = './build/assets/images/',
    js_build      = './build/assets/javascripts',
    build         = './build';

// Json file acts as database
// ----------------------------------------------------------------------------
var database = JSON.parse(fs.readFileSync('./data/database.json', { encoding: 'utf8' }))


// Tasks
// ----------------------------------------------------------------------------

// Clean build folder
// ------------------------------------
gulp.task('clean', function () {
  return gulp.src(build, { read: false})
    .pipe(rimraf())
    .pipe(notify('/build deleted, run gulp'));
});


// Compile jade files to minified html
// ------------------------------------
gulp.task('templates', function () {
  return gulp.src(source + '/**/*.jade')
    .pipe(jade({
      pretty: true,
      data: database
    }))
    .pipe(minifyHtml())
    .pipe(gulp.dest(build))
    .pipe(reload({stream:true}))
    .pipe(notify('Templates task complete!'));
});


// Compile SCSS + autoprefixer
// ------------------------------------
gulp.task('css', function () {
  return gulp.src(css_source + '/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(css_build))
    .pipe(reload({stream:true}))
    .pipe(notify('Css task complete!'));
});


// Remove unused css
// ------------------------------------
gulp.task('uncss', function () {
  return gulp.src(css_build + '/app.css')
   .pipe(uncss({
      html: [build + '/**/*.html']
   }))
   .pipe(minifyCss())
   .pipe(gulp.dest(css_build))
   .pipe(notify('Unused CSS removed!'));
});


// Concatenate and minify JS
// ------------------------------------
gulp.task('js', function() {
  return gulp.src(source + '/**/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest(js_build))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(js_build))
    .pipe(reload({stream:true}))
    .pipe(notify('Js task complete!'));
});


// Optimize images
// ------------------------------------
gulp.task('img', function () {
  return gulp.src(img_source + '/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest(img_build))
    .pipe(notify('Images are optimized!'));
});

// Build for dev and prod
// ----------------------------------------------------------------------------
gulp.task('dev', ['templates', 'css', 'js']);

gulp.task('prod', ['templates', 'css', 'uncss', 'js', 'img']);


// Watch
// ----------------------------------------------------------------------------
gulp.task('watch', ['dev'], function () {
  browserSync.init({
    server: build
  })
  gulp.watch(source + '/**/*.jade', ['templates']);
  gulp.watch(source + '/**/*.scss', ['css']);
  gulp.watch(source + '/**/*.js', ['js']);
  gulp.watch(build  + '/**/*.html').on('change', reload);
});

// Default
// ----------------------------------------------------------------------------
gulp.task('default', ['watch'])