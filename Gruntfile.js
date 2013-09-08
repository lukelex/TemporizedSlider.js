module.exports = function(grunt) {
  grunt.initConfig({
    jasmine: {
      // Your project's source files
      src: 'temporized_slider.js',
      // Your Jasmine spec files
      options: {
        specs: 'tests/spec/temporized_slider_spec.js'
        // Your spec helper files
        // helpers : 'specs/helpers/*.js'
      }
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task.
  grunt.registerTask('test', 'jasmine');
};
