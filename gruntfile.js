module.exports = function(grunt) {
	
    grunt.initConfig({
    	pkg: grunt.file.readJSON('package.json'),
    	concat: {
	    	dev: {
		    	src: ['src/js/*.js', 'src/js/classes/*.js'],
		    	dest: 'app/js/sudoku.js'
	    	}
    	},
    	uglify: {
	    	prod: {
		    	files: {
			    	'app/js/sudoku.min.js': 'app/js/sudoku.js'
		    	}
	    	}
    	},
    	less: {
	    	dev: {
				files: {
					'app/css/style.css' : 'src/less/style.less'
				}
			}
		},
    	watch: {
			css: {
				files: 'src/less/*.less',
				tasks: ['less:dev']
			},
			dev: {
				files: ['src/js/*.js', 'src/js/classes/*.js'],
				tasks: ['concat:dev', 'uglify:prod']
			}
		},
		jshint: {
			all: ['src/js/*.js']
		}
    });
    
    //load tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    //register tasks
    grunt.registerTask('default', ['watch']);
    
};