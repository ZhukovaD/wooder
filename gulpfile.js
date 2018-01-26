"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var server = require("browser-sync").create();
var run = require("run-sequence");
var del = require("del");
var pump = require('pump');
var rename = require("gulp-rename");

var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require('gulp-htmlmin');

var postcss = require("gulp-postcss");
var atImport = require("postcss-import");
var autoprefixer = require("autoprefixer");

var svgstore = require("gulp-svgstore");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");

var uglify = require('gulp-uglify');


// СБОРКА DEV
// gulp.task("style", function() {
//     gulp.src("style.css")
//         .pipe(plumber())
//         .pipe(postcss([
//             autoprefixer()
//         ]))
//         .pipe(server.stream());
// });
//
//
// gulp.task("sprite", function () {
//     return gulp.src("img/icon-*.svg")
//         .pipe(svgstore({
//             inlineSvg: true
//         }))
//         .pipe(rename("sprite.svg"))
//         .pipe(gulp.dest("img"));
// });
//
// gulp.task("images", function () {
//     return gulp.src("img/**/*.{png,jpg,svg}")
//         .pipe(imagemin([
//             imagemin.optipng({optimizationLevel: 3}),
//             imagemin.jpegtran({progressive: true}),
//             imagemin.svgo()
//         ]))
//         .pipe(gulp.dest("img"));
//
// });
//
// gulp.task("webp", function () {
//     return gulp.src("img/**/*.{png,jpg}")
//         .pipe(webp({quality: 90}))
//         .pipe(gulp.dest("img"));
// });
//
// gulp.task("serve", ["style"], function() {
//     server.init({
//         server: ".",
//         notify: false,
//         open: true,
//         cors: true,
//         ui: false
//     });
//
//     gulp.watch("css/**/*.css", ["style"]);
//     gulp.watch("*.html").on("change", server.reload);
// });


// СБОРКА BUILD

gulp.task("clean", function () {
    return del("build");
});

gulp.task("copy", function () {
    return gulp.src([
        "fonts/**/*.{woff,woff2}",
        "img/**"
    ], {
        base: "."
    })
        .pipe(gulp.dest("build"));

});

gulp.task("style", function() {
    gulp.src("style.css")
        .pipe(plumber())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(postcss([
            atImport()
        ]))
        .pipe(gulp.dest("build"))
        .pipe(server.stream());
});

gulp.task("html", function () {
    return gulp.src("*.html")
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest("build"))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('build'));
});

gulp.task("sprite", function () {
    return gulp.src("img/icon-*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("build/img"));
});

gulp.task("images", function () {
    return gulp.src("img/**/*.{png,jpg,svg}")
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("img"));

});

gulp.task("serve", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("css/**/*.css", ["style"]);
    gulp.watch("*.html", ["html"]);
});

gulp.task('compress', function (cb) {
    pump([
            gulp.src('js/*.js'),
            uglify(),
            gulp.dest('build/js')
        ],
        cb
    );
});

gulp.task("build", function (done) {
    run(
        "clean",
        "copy",
        "style",
        "sprite",
        "html",
        "compress",
        done
    );
});