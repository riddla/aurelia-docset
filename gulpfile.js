var gulp = require('gulp');
var markdown = require('gulp-markdown');
var debug = require('gulp-debug');
 
gulp.task('convert', function() {
  gulp.src('./doc/article/en-US/*.md')
    .pipe(markdown({
    	// optional : marked options
        highlight: function (code) {
            return require('highlight.js').highlightAuto(code).value;
        }
    }))
    //.pipe(debug);
    .pipe(gulp.dest('./aurelia.docset/Contents/Resources/Documents/'))
});