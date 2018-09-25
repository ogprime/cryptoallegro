// Base Gulp File
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    cleanCSS = require('gulp-clean-css'),
    clean = require('gulp-clean'),
    path = require('path'),
    notify = require('gulp-notify'),
    csscomb = require('gulp-csscomb'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence');

// SCSS TO CSS
gulp.task('sass', function () {
    return gulp.src('./css-dev/**/*.scss')
        .pipe(sass({precision: 10, outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest('./css-dev/temp/'));
});

// CSS STYLE
gulp.task('styles', function() {
  return gulp.src('./css-dev/temp/*.css')
    .pipe(csscomb())
  	.pipe(gulp.dest('./styles/'))  	
});

// CSS MINIFICATION
gulp.task('cssmin', function () {
    return gulp.src('./css-dev/temp/*.css')	
	.pipe(csscomb())
	.pipe(cleanCSS({compatibility: 'ie9'}))  	
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./styles/'))
});

// REMOVE TEMP Directory- after use
gulp.task('cleanup', function () {
    return gulp.src('./css-dev/temp/*.*', {
            read: false
        })
        .pipe(clean());
});

// RUN TASKS SEQUENTIALLY
gulp.task('runcss', function () {
	return runSequence('sass', 'styles', 'cssmin', 'cleanup');
});

// MINIFY JS
gulp.task('jsmin', function () {
    //gulp.start('concate');
    return gulp.src('./js-dev/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./scripts/'));
});

// MINIFY - OPTIMIZE Images
gulp.task('imagemin', function () {
    return gulp.src('./img-dev/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('./images/'));
});

// Task to combine the listed External Vendor files altogether.
// Remember to de-link the individual files, if linked from HTML. In this case, only vendor.js should be linked.
gulp.task('libconcate', function () {
    return gulp.src(['./js-dev/lib/vendor.js', './js-dev/lib/jquery.autocomplete.min.js', './js-dev/lib/bootstrap-datepicker.min.js', './js-dev/lib/bootstrap-datepicker.en-US.min.js', './js-dev/lib/jquery.placeholder.min.js'])
        .pipe(concat('vendor.js', {
            newLine: '\r\n\n'
        }))
        .pipe(gulp.dest('./lib/'));
});

// The default/ watch command
gulp.task('watch', function () {
    console.log('Hi! I am watching all the files under CSS-DEV, IMG-DEV and JS-DEV.....');
	// RUN MAIN CSS TASKS
    gulp.watch('./css-dev/**/*.scss', ['runcss']);
    gulp.watch('./js-dev/*.js', ['jsmin']);
    gulp.watch('./img-dev/*.+(png|PNG|jpg|JPG|jpeg|gif|GIF|svg|SVG)', ['imagemin']);
});

// Gulp Default Task
gulp.task('default', ['watch']);

// Gulp Build Task - no WATCH
gulp.task('build', function () {
    runSequence('imagemin', 'sass', 'styles', 'cssmin', 'concate', 'jsmin', 'cleanup');
});