/*

=========================================================
* AppSeed - Simple SCSS compiler via Gulp
=========================================================

*/

const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const cleanCss = require('gulp-clean-css');
const gulp = require('gulp');
const npmDist = require('gulp-npm-dist');
const sass = require('gulp-sass')(require('node-sass'));
const wait = require('gulp-wait');
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");

// Define COMMON paths
const paths = {
    src: {
        base: './',
        css: './css',
        scss: './scss',
        node_modules: './node_modules/',
        vendor: './vendor'
    }
};

// Compile SCSS
gulp.task('scss', function () {
    return gulp.src([paths.src.scss + '/custom/**/*.scss', paths.src.scss + '/volt/**/*.scss', paths.src.scss + '/volt.scss'])
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 1%']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.src.css))
        .pipe(browserSync.stream());
});

// Minify CSS
gulp.task('minify:css', function () {
    return gulp.src([
        paths.src.css + '/volt.css'
    ])
        .pipe(cleanCss())
        .pipe(rename(function (path) {
            // Updates the object in-place
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest(paths.src.css))
});

// Default Task: Compile SCSS and minify the result
gulp.task('default', gulp.series('scss', 'minify:css'));
