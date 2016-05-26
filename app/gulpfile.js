"use strict";
var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsconfig = require('./tsconfig.json');
let tsPath = './**/*.ts';


gulp.task('build', ()=> {
  let outDir = '.tmp/';
  gulp.src(['**/*.ts', '!node_modules/**/*'])
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(gulp.dest(outDir));
});

gulp.task('build:w', ['build'], ()=> {
  gulp.watch(tsPath, ['build']);
});
