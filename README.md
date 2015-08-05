# Gulp-jade

Gulpfile charged with Jade, Sass, and BrowserSync

## Getting Started

Clone this repository
```
git clone https://github.com/SamuelBourdon/gulp-jade.git your_project
```

Make sure Node.js is installed on your system and install the node modules listed in package.json
```
npm install
```

## Gulp commands

```
gulp
```
During development, gulp runs a browserSync session, compiles *.jade to *.html, *.scss to *.css and concatenates/minifies *.js

```
gulp prod
```
Same tasks + uncss and image image optimization

```
gulp clean
```
Delete build folder


## License

This project is free software, and may be redistributed under [MIT license].