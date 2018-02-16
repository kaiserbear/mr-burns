'use strict';

const browserSync = require('browser-sync').create();
const del = require('del');
const env = require('gulp-util').env;
const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const sass = require('gulp-sass');


const config = {
  src: './src',
  dest: './',
  watchers: [
    {
      match: ['./src/**/**/*.hbs'],
      tasks: ['html']
    }
  ]
};

// gulp.task('clean', () => del(config.dest));

gulp.task('html', () => {
  return gulp.src(`${config.src}/pages/**/*.hbs`)
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: [`${config.src}/partials`]
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(config.dest));
});

gulp.task('serve', () => {
  browserSync.init({
    open: false,
    notify: false,
    files: [`${config.dest}/**/*`],
    server: config.dest
  });
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});


gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('watch', () => {
  config.watchers.forEach(item => {
    gulp.watch(item.match, item.tasks);
  });
});

gulp.task('default', ['html'], done => {
  if (env.dev) {
    gulp.start('serve');
    gulp.start('watch');
    gulp.start('sass');
    gulp.start('sass:watch');
  }
  done();
});
