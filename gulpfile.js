var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    copy = require('gulp-contrib-copy'),
    less = require('gulp-less'),
    path = require('path'),
    LessAutoprefix = require('less-plugin-autoprefix'),
    autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

gulp.task('js', function () {
    return gulp.src([
        "./src/FileCryptUtil.js",
        "./src/FileCryptWorkerCollection.js",
        "./src/FileCryptHashCollection.js",
        "./src/FileCryptBlobCollection.js",
        "./src/FileCrypt.js",
        "./src/FileDecryptWorkerCollection.js",
        "./src/FileDecryptBlobCollection.js",
        "./src/FileDecrypt.js"
    ])
        .pipe(concat('filecrypt.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy', function () {
    return gulp.src([
        './src/formatters.js',
        './src/worker.*.js'
    ])
        .pipe(copy())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('less', function () {
    return gulp.src('./less/**/*.less')
        .pipe(less({
            paths: [
                path.join(__dirname, 'less', 'includes')
            ],
            plugins: [autoprefix]
        }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('uglify-js', function () {
    return gulp.src('./dist/js/filecrypt.js')
        .pipe(uglify('filecrypt.min.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('default',
    ['js', 'uglify-js', 'copy', 'less']
);