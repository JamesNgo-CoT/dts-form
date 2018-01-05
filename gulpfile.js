const babel = require('gulp-babel')
const connect = require('gulp-connect')
const cssnano = require('gulp-cssnano')
const del = require('del')
const eslint = require('gulp-eslint')
const gulp = require('gulp')
const mustache = require('gulp-mustache')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')

//////////////////////////////////////////////////

gulp.task('cleanup', () => del(['./dist/']))

//////////////////////////////////////////////////

scriptsGlob = ['./src/**/*.js']

function gulpScripts() {
  return gulp.src(scriptsGlob)
    .pipe(mustache())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(gulp.dest('./dist/'))
    .pipe(rename((path) => path.basename += '.min'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/'))
}

gulp.task('scripts', ['cleanup'], () => gulpScripts())
gulp.task('scripts-serve', () => gulpScripts().pipe(connect.reload()))

//////////////////////////////////////////////////

stylesGlob = ['./src/**/*.scss']

function gulpStyles() {
  return gulp.src(stylesGlob)
    .pipe(mustache())
    .pipe(sass())
    .pipe(gulp.dest('./dist/'))
    .pipe(rename((path) => path.basename += '.min'))
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/'))
}

gulp.task('styles', ['cleanup'], () => gulpStyles())
gulp.task('styles-serve', () => gulpStyles().pipe(connect.reload()))

//////////////////////////////////////////////////

docsGlob = ['./src/index.html']

function gulpDocs() {
  return gulp.src(docsGlob)
    .pipe(mustache())
    .pipe(gulp.dest('./dist/'))
}

gulp.task('docs', ['cleanup'], () => gulpDocs())
gulp.task('docs-serve', () => gulpDocs().pipe(connect.reload()))

//////////////////////////////////////////////////

gulp.task('default', ['cleanup', 'scripts', 'styles', 'docs'])

//////////////////////////////////////////////////

gulp.task('serve', ['default'], () => {
  connect.server({
    livereload: true,
    root: 'dist'
  });

  gulp.watch(scriptsGlob, ['scripts-serve'])
  gulp.watch(stylesGlob, ['styles-serve'])
  gulp.watch(docsGlob, ['docs-serve'])
})
