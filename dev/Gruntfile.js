module.exports = function(grunt) {

	// Load all grunt tasks automatically
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var config = {
		output: '..',
		working_folder: "dev",
		working: ['scripts/models.js',
					'scripts/views.js',
					'scripts/main.js'],
		libraries: ['scripts/vendor/jquery/jquery.min.js',
					'scripts/vendor/underscore/underscore-min.js',
					'scripts/vendor/backbone/backbone-min.js',
					'scripts/plugins.js']
	}

	grunt.initConfig({

		config: config,

		compass: {
			dist: {
				options: {
					config: 'config.rb'
				}
			}
		},

		copy: {
			main: {
				files: [
					{ expand: true, flatten: true, src: ['scripts/vendor/modernizr/modernizr.js'], dest: '<%= config.output %>/scripts/vendor/'}
				]
			}
		},

		concat: {
			dist: {
				src: '<%= config.working %>',
				dest: '<%= config.output %>/scripts/main.js'
			},
			lib: {
				src: '<%= config.libraries %>',
				dest: '<%= config.output %>/scripts/lib.min.js'
			}
		},

		uglify: {
			lib: {
				files: {
					'<%= config.output %>/scripts/lib.min.js': '<%= config.libraries %>'
				}
			},
			main: {
				files: {
					'<%= config.output %>/scripts/main.min.js': '<%= config.working %>'
				},

				options:{
					sourceMap: "<%= config.output %>/scripts/sourcemaps/main.map",
					sourceMapRoot: "../../<%= config.working_folder %>/"
				}
			}
		},

		watch: {
			src: {
				files: ['scripts/*.js', 'sass/**/*.*', '!scripts/vendor/'],
				tasks: ['compass', 'uglify:main']
			},
			css: {
				files: ['/sass/{,*/}*.{scss,sass}'],
				tasks: ['compass']
			}
		}
	});

	// Default task(s).
	grunt.registerTask('default',
		[
			'compass',
			'copy',
			'uglify:main', // concatinate and minify working JS
			//'uglify:lib' // concatinate and minify vendor JS libraries, use this if libraries are not minified
			'concat:lib' // concatinate vendor JS libraries, use this if libraries are already minified
		]
	);

	// Watch task, listens for changes on all workin JS and SCSS
	grunt.registerTask('watch-all',
		[
			'watch:src'
		]
	);

	// Watch task, listens for stlye changes only
	grunt.registerTask('watch-styles',
		[
			'watch:css'
		]
	);
};