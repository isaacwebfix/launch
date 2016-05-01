'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require("gulp-sourcemaps");
const rename = require('gulp-rename');
const jshint = require('gulp-jshint');
const sassLint = require('gulp-sass-lint');
const browserSync = require('browser-sync').create();

const srcDir = './src';
const distDir = './dist';

var paths = {
  dist: './dist',
  scripts: [
    './js/**/*.js'
  ],
  sass: ['./sass/**/*.scss'],
  // files that simply get copied to dist folder
  copy: [
    './fonts',
    './img',
    './svg',
    './.htaccess',
    './apple-touch-icon.png',
    './browserconfig.xml',
    './crossdomain.xml',
    './favicon.ico',
    './*.html',
    './robots.txt',
    './tile.png',
    './tile-wide.png'
  ],
  // vendor scripts to get combined
  vendorScripts: [
    './js/vendor/*.js'
  ],
  // vendor scripts that shouldn't be combined
  copyVendorScripts: [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/jquery/dist/jquery.min.map',
    './node_modules/systemjs/dist/system.js',
    './node_modules/systemjs/dist/system.js.map'
  ]
};

gulp.task('sass', function () {
  return gulp.src(paths.sass)
  .pipe(sassLint())
  .pipe(sassLint.format())
  .pipe(sassLint.failOnError())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(rename('app.min.css'))
  .pipe(gulp.dest(`${distDir}/css`));
});

// Compile application scripts with Babel to SystemJS modules
gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(distDir + '/js'));
});

// Copy files
gulp.task('copy', function () {
  return gulp.src(paths.copy)
  .pipe(gulp.dest(distDir));
});

// Concat and ugilfy vendor scripts
gulp.task('vendor-scripts', function () {
  return gulp.src(paths.vendorScripts)
  .pipe(concat('vendor.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(`${distDir}/js`));
});

// Copy over vendor scripts that shouldn't be combined
gulp.task('copy-vendor-scripts', function () {
  gulp.src(paths.copyVendorScripts)
  .pipe(gulp.dest(`${distDir}/js/vendor`));
});

// Re-run the task when a file changes
gulp.task('watch', function () {
  gulp.watch([paths.scripts, paths.vendorScripts], ['scripts']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.copy, ['copy']);
});

// Use default task to launch Browsersync
gulp.task('serve', ['default'], function () {

  // Serve files from the dist directory
  browserSync.init({
    server: {
      baseDir: distDir
    }
    // Add additional options https://www.browsersync.io/docs/options/
  });

  // Call reload after watch task triggered
  gulp.watch([paths.scripts, paths.vendorScripts], ['scripts', browserSync.reload]);
  gulp.watch(paths.sass, ['sass', browserSync.reload]);
  gulp.watch(paths.copy, ['copy', browserSync.reload]);
});

gulp.task('default', ['sass', 'scripts', 'copy', 'copy-vendor-scripts', 'vendor-scripts']);
