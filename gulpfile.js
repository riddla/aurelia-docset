var gulp = require('gulp');
var markdown = require('gulp-markdown');
var debug = require('gulp-debug');
var tap = require('gulp-tap');
var wrapper = require('gulp-wrapper');
var fs = require('fs');

gulp.task('convert', function () {

    var header = fs.readFileSync('./aurelia-article-header.html', "utf8");
    var footer = fs.readFileSync('./aurelia-article-footer.html', "utf8");

    var sqlite3 = require('sqlite3').verbose();
    //var db = new sqlite3.Database('./aurelia.docset/Contents/Resources/docSet.dsidx');
    
    gulp.src('./doc/article/en-US/a-production-setup.md')
    //gulp.src('./doc/article/en-US/*.md')
    // extract frontmatter
        .pipe(tap(function (file) {
            console.dir(file.contents.toString());
        }))
        .pipe(markdown({
            // optional : marked options
            highlight: function (code) {
                return require('highlight.js').highlightAuto(code).value;
            }
        }))
        .pipe(gulp.dest('./aurelia.docset/Contents/Resources/Documents/'))
        .pipe(wrapper({
            header: header,
            footer: footer
        }))
        .pipe(gulp.dest('./aurelia.docset/Contents/Resources/Documents/'));
});
