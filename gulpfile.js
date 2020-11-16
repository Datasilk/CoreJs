'use strict';

//includes ////////////////////////////////////////////////////////////////////////////////
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    changed = require('gulp-changed');

//paths
var paths = {
    scripts: 'scripts/',
    wwwroot: '/'
};
paths.platform = paths.scripts + 'datasilk/';

//working paths
paths.working = {
    js: {
        platform: [
            paths.scripts + 'selector/selector.js',
            paths.scripts + 'utility/velocity.min.js', //optional 3rd-party library for animation
            paths.platform + '_super.js', // <---- Datasilk Core Js: S object
            paths.platform + 'ajax.js', //   <---- Optional platform features
            //paths.platform + 'accordion.js',
            //paths.platform + 'clipboard.js',
            paths.platform + 'loader.js',
            paths.platform + 'message.js',
            //paths.platform + 'polyfill.js',
            paths.platform + 'popup.js',
            paths.platform + 'svg.js',
            //paths.platform + 'upload.js',
            paths.platform + 'util.js',
            //paths.platform + 'util.color.js',
            //paths.platform + 'util.file.js',
            //paths.platform + 'validate.js',
            paths.platform + 'window.js',
            paths.platform + 'view.js' //  <---- End of Optional features
        ],
        app: paths.app + '**/*.js',
        utility: [
            paths.scripts + 'utility/*.*',
            paths.scripts + 'utility/**/*.*'
        ]
    }
};

//compiled paths
paths.compiled = {
    platform: paths.webroot + 'editor/js/platform.js',
    js: paths.webroot + 'editor/js/',
    css: paths.webroot + 'editor/css/',
    app: paths.webroot + 'editor/css/',
    themes: paths.webroot + 'editor/css/themes/'
};

//tasks for compiling javascript //////////////////////////////////////////////////////////////
gulp.task('js:platform', function () {
    var p = gulp.src(paths.working.js.platform, { base: '.' })
        .pipe(concat(paths.compiled.platform));
    if (prod == true) { p = p.pipe(uglify()); }
    return p.pipe(gulp.dest('.', { overwrite: true }));
});

gulp.task('js:utility', function () {
    //check file changes & replace changed files in destination
    return gulp.src(paths.working.js.utility)
        .pipe(changed(paths.compiled.js + 'utility'))
        .pipe(gulp.dest(paths.compiled.js + 'utility'));
});

gulp.task('js', gulp.series('js:platform', 'js:utility'));


//default task ////////////////////////////////////////////////////////////////////////////////
gulp.task('default', gulp.series('js'));

//watch task //////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', function () {
    //watch platform JS
    gulp.watch(paths.working.js.platform, gulp.series('js:platform'));
});