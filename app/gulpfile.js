"use strict";
var ts = require('gulp-typescript');
var tsconfig = require('./tsconfig.json');
var tslint = require("gulp-tslint");
var gulp = require('gulp');


const TS_PATH = './**/*.ts';
const EJS_PATH = './**/*.ejs';
const NODE_MODULES_PATH = 'node_modules/**/*';

gulp.task('lint', () => {
  gulp.src('./*.ts')
    .pipe(tslint())
    .pipe(tslint.report("prose", {
      summarizeFailureOutput: true,
      emitError: false
    }));
});

gulp.task('protos', () => {
  gulp.src(['**/*.proto', `!${NODE_MODULES_PATH}`])
    .pipe(gulp.dest('.tmp/'))
});

gulp.task('views', () => {
  gulp.src([EJS_PATH, `!${NODE_MODULES_PATH}`])
    .pipe(gulp.dest('.tmp/'))
});


gulp.task('build', ['protos', 'views'], () => {
  let outDir = '.tmp/';
  gulp.src([TS_PATH, `!${NODE_MODULES_PATH}`])
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(gulp.dest(outDir));
});

gulp.task('build:w', ['build'], () => {
  gulp.watch(TS_PATH, ['build']);
  gulp.watch(EJS_PATH, ['build']);
});
