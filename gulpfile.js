var 	gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		browserSync  = require('browser-sync'),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglifyjs'),
		autoprefixer = require('gulp-autoprefixer'),
		rename       = require('gulp-rename'),
		bourbon 	 = require('node-bourbon'),
		cleanCSS     = require('gulp-clean-css'),
		concatCSS	 = require('gulp-concat-css'),
		gcmq 	 	 = require('gulp-group-css-media-queries'),
		smartgrid 	 = require('smart-grid');


/*================  GULP BROWSER SYNC  ================================================================*/
	gulp.task('browser-sync', function(){
		browserSync({
			server: {
				baseDir: 'app/'
			},	
			notify: false,
			open: false,
		});
	});
/*================  GULP SMART-GRID  ================================================================*/

var smartgridSettings = {
outputStyle: 'sass', /* less || scss || sass || styl /*/
columns: 24, /*/ number of grid columns /*/
offset: "12px", /* / gutter width px || % /*/
container: {
maxWidth: '1092px',  /*/ max-width оn very large screen /*/
fields: '12px' /*/ side fields / */
},
breakPoints: {
lg: {
'width': '1000px', /* / -> @media (max-width: 1000px) /*/
'fields': '12px'  /*/ side fields */
},
md: {
'width': '960px',
'fields': '15px'
},
sm: {
'width': '780px',
'fields': '15px'
},
xs: {
'width': '660px',
'fields': '15px'
}
}
};

gulp.task('smartgrid', function() {
smartgrid('app/css/sass', smartgridSettings);
});

/*==============  GULP SASS   ==================================================================*/

gulp.task('sass', function () { // Создаем таск Sass
	return gulp.src('app/css/sass/*.sass')  // Берем источник
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
	.pipe(rename({suffix: '.min', prefix : ''})) // Минифицируем CSS файлы
	.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: true}))// Создаем префиксы
	.pipe(gcmq())
	.pipe(cleanCSS())


	.pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
	.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

// /*==============  GULP CONCAT CSS  ==================================================================*/

gulp.task('css', function(){
	return(gulp.src([	
		'app/libs/font-awesome/fontawesome-all.css',	
		'app/libs/magnific-popup/dist/magnific-popup.css',	
		'app/libs/animate/animate.min.css',
		]))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(minifycss())
	.pipe(concatCSS('libs.min.css'))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});


/*==============  GULP CONCAT SCRIPTS  ==================================================================*/
gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/animate/animate-css.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		'app/libs/jquery/dist/jquery.min.js',

		
		])
		.pipe(concat('libs.js'))
		.pipe(uglify()) //Minify libs.js
		.pipe(gulp.dest('./app/js/'));
});

/*================  GULP CLEAN DIST ================================================================*/

gulp.task('clean', function(){
	return del.sync('dist/')

});
// *================  GULP TRANSFER FILES  ================================================================*/


gulp.task('transfer', ['clean', 'sass', 'scripts'], function(){
	 var transferCSS = gulp.src(['app/css/*.css'])
	 	.pipe(gulp.dest('dist/css'));

	 var transferHTML = gulp.src(['app/*.html'])
	 	.pipe(gulp.dest('dist/'));

	 var transferJS = gulp.src(['app/js/*.js'])
	 	.pipe(gulp.dest('dist/js'));

	 var transferFONTS = gulp.src(['app/fonts/**/*'])
	 	.pipe(gulp.dest('dist/fonts'))

});
/*==============  GULP WATCH   ==================================================================*/

gulp.task('watch', ['sass', 'browser-sync' ], function () {
	gulp.watch('app/css/sass/*.sass', ['sass'], browserSync.reload),
	gulp.watch('app/libs/**/*.js', ['scripts']),
	gulp.watch('app/js/*.js').on("change", browserSync.reload),
	gulp.watch('app/*.html').on('change', browserSync.reload);
});

