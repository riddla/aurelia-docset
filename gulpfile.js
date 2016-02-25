var gulp = require('gulp');
var markdown = require('gulp-markdown');
var debug = require('gulp-debug');
var tap = require('gulp-tap');
var wrapper = require('gulp-wrapper');
var fs = require('fs');
var bump = require('gulp-bump');

var frontmatterPattern = /---([\s\S]+)---[\s\S]/;

function getFrontmatter(content) {

    var matches = content.match(frontmatterPattern);

    if (matches) {
        return JSON.parse(matches[1]);
    }

    return {};
}

function removeFrontmatter(content) {

    return content.replace(frontmatterPattern, '');
}

gulp.task('convert', function () {

    var header = fs.readFileSync('./aurelia-article-header.html', "utf8");
    var footer = fs.readFileSync('./aurelia-article-footer.html', "utf8");

    var sqlite3 = require('sqlite3').verbose();
    var table = 'searchIndex';
    var db = new sqlite3.Database('./aurelia.docset/Contents/Resources/docSet.dsidx');
    db.run('DELETE FROM ' + table);

    // gulp.src('./doc/article/en-US/a-production-setup.md')
    gulp.src('./doc/article/en-US/*.md')
    // extract frontmatter
        .pipe(tap(function (file) {
            var content = file.contents.toString();
            var frontmatter = getFrontmatter(content);

            file.contents = new Buffer(removeFrontmatter(content));

            var sql = "INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('" + frontmatter.name + "', 'Guide', '" + file.relative.replace(/\.md/, '.html') + "');";
            console.log(sql);
            db.run(sql);

            return file;
        }))
        .pipe(markdown({
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

var yargs = require('yargs');

var argv = yargs.argv,
    validBumpTypes = "major|minor|patch|prerelease".split("|"),
    bumpVersion = (argv.bump || 'patch').toLowerCase();

if (validBumpTypes.indexOf(bumpVersion) === -1) {
    throw new Error('Unrecognized bump "' + bump + '".');
}

gulp.task('bump-version', function () {
    return gulp.src(['./package.json', './bower.json'])
        .pipe(bump({ type: bumpVersion })) //major|minor|patch|prerelease
        .pipe(gulp.dest('./'));
});