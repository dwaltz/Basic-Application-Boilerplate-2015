/*global module:false*/
module.exports = function( grunt ) {

	'use strict';

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.initConfig({

		pkg: grunt.file.readJSON( './package.json' ),

		paths: {
			node: './',
			client: './public/',
			dist: './optimized/'
		},

		jshint: {
			options: {
				"devel": true,
				"browser": true,
				"node": true,
				"boss": true,
				"bitwise": true,
				"curly": true,
				"debug": false,
				"eqeqeq": true,
				"latedef": false,
				"laxcomma": true,
				"newcap": true,
				"undef": true,
				"shadow": false,
				"strict": true,
				"unused": true,
				"globals": {
					"require": true,
					"requirejs": true,
					"define": true,
					"describe": true,
					"it": true,
					"expect": true,
					"Backbone": true,
					"$": true,
					"_": true
				}
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			files: [
				'<%= paths.node %>app.js',
				'<%= paths.client %>js/**/*.js'
			]
		},

		requirejs: {
			compile: {
				options: {
					appDir: 'public',
					baseUrl: '.',
					mainConfigFile: "public/js/main.js",
					optimize: 'uglify2',
					optimizeCss: 'none',
					dir: 'optimized',
					preserveLicenseComments: false,
					generateSourceMaps: false,
					modules: [
						{
							name: 'js/main',
							exclude: [
								'backbone',
								'underscore',
								'jquery',
								'json2'
							]
						}
					]
				}
			}
		},

		qunit: {
			full: {
				options: {
					urls: ['http://localhost:8000/test/main.html']
				}
			}
		},

		connect: {
			server: {
				options: {
					port: 8000,
					base: '.'
				}
			}
		},

		watch: {
			css: {
				files: [
					'public/less/*.less'
				],
				tasks: [
					'less:dev'
				]
			}
		},

		less: {
			dist: {
				files: {
					'optimized/css/styles.css': 'public/less/styles.less'
				},
				options: {
					paths: ["public/less"],
					compress: true
				}
			},

			dev: {
				files: {
					'public/css/styles.css': 'public/less/styles.less'
				},
				options: {
					paths: ["public/less"],
					yuicompress: true
				}
			}
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= paths.dist %>img',
					src: ['**/*.{png,jpg,gif}'],
					dest: '<%= paths.dist %>img'
				}]
			}
		},

		clean: {
			dist: {
				src: [ "<%= paths.dist %>" ]
			},
			distLess: {
				src: [ "<%= paths.dist %>css/**/*.css" ]
			}
		}

	});
	// Optimizing
	grunt.registerTask( 'optimizeJS', [ 'clean:dist', 'requirejs'] );
	grunt.registerTask( 'optimizeCSS' , [  'clean:distLess', 'less:dist' ] );

	// Jshint and testing
	grunt.registerTask( 'test', [ 'jshint', 'connect', 'qunit:full' ] );

	// Default task.
	grunt.registerTask( 'default', [ 'test', 'optimizeJS', 'optimizeCSS', 'imagemin:dist'] );

	// CSS Watcher
	grunt.registerTask('css-watch', 'watch');
};
