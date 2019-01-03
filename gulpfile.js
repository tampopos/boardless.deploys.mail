'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const juice = require('gulp-juice');
const sass = require('gulp-sass');
const webserver = require('gulp-webserver');

gulp.task('build-sass', function() {
  return gulp
    .src('./src/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('./src/'));
});
gulp.task('build-pug', () => {
  return gulp
    .src(['./src/**/*.pug', '!./src/**/_*.pug'])
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(
      juice({
        preserveMediaQueries: true,
        webResources: {
          relativeTo: './src/mails',
          images: false
        }
      })
    )
    .pipe(gulp.dest('./dist/'));
});
gulp.task('build', gulp.series(['build-sass', 'build-pug']));

gulp.task('watch-sass', function() {
  return gulp.watch(['./src/**/*.scss'], gulp.task(['build']));
});
gulp.task('watch-pug', function() {
  return gulp.watch(['./src/**/*.pug'], gulp.task(['build-pug']));
});
gulp.task(
  'watch',
  gulp.series('build', gulp.parallel(['watch-sass', 'watch-pug']))
);
gulp.task('web', function() {
  gulp.src('dist').pipe(
    webserver({
      host: '0.0.0.0',
      livereload: true,
      directoryListing: {
        enable: true,
        path: 'dist'
      },
      open: true
    })
  );
});
gulp.task(
  'run',
  gulp.series(['build', gulp.parallel(['watch-sass', 'watch-pug', 'web'])])
);
