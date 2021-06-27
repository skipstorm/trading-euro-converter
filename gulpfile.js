var gulp        = require('gulp');
var del         = require('del');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var inject      = require('gulp-inject');
var iconfont    = require('gulp-iconfont');
var sourcemaps  = require('gulp-sourcemaps');
var through     = require('through2');
var concat      = require('gulp-concat');
var injectPartials = require('gulp-inject-partials');
var sftp = require('gulp-sftp');
var argv = require('yargs').argv;
var fs = require('fs');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
const { on } = require('events');
var runTimestamp = Math.round(Date.now()/1000);

var indexing = false;
var isRelease = false; // Se true rimuove i commenti da sass

function noop() {
    return through.obj();
}

// Static Server + watching scss/html files
gulp.task('serve', gulp.series('build', function(done) {

    browserSync.init({
        server: "./"
    });

    gulp.watch('./scripts.js').on('change', browserSync.reload);

    done();
}));



gulp.task('default', gulp.series('serve'));
