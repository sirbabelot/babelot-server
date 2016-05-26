"use strict";
var ts = require('gulp-typescript');
var tsconfig = require('./tsconfig.json');
var tslint = require("gulp-tslint");
var gulp = require('gulp');


const TS_PATH = './**/*.ts';

gulp.task('lint', () => {
  gulp.src('./*.ts')
    .pipe(tslint())
    .pipe(tslint.report("prose", {
      summarizeFailureOutput: true,
      emitError: false
    }));
});


gulp.task('build', () => {
  let outDir = '.tmp/';
  gulp.src([TS_PATH, '!node_modules/**/*'])
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(gulp.dest(outDir));
});

gulp.task('build:w', ['build'], () => {
  gulp.watch(TS_PATH, ['build']);
});
