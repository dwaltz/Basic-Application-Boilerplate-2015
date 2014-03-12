##Basic Application Boilerplate

This project contains the foundations for a web application using some of my favorite technologies. I use it is a
reference when I start creating a new application.

This is a Node/Backbone application.
[Node.js][1] is used for my server and [Backbone.js][2] is used as my client side JS framework.

###Technologies Used

Server Side
1. [Express.js][3] as my http server framework. Its Great!
2. [Express3 Handlebars][10] for my view engine integration
3. optional [redis] [13] (for session data) and [mongodb] [14] (for general data storage) inclusions

Client Side
1. [jquery.js][7] why do you ask?
2. [require.js][8] AMD script loader because your mom told you so
3. [Backbone.js][6] for my client side framework
3. [Underscore.js][9] because we have been together so long and we are comfortable

Building and Packaging
1. [Grunt.js] [5] for task automation
2. [Less] [11] CSS pre-processor for more maintainable css
3. [Volo] [12] for my client side dependency package manager

Testing
1. [QUnite][4]

###Getting Started

1. Clone project
    * `https://github.com/dwaltz/Basic-Application-Boilerplate.git`
2. Switch into the folder you just cloned and run `npm install`
3. Start the app with 'node app'

###Build Process via GruntJS

1. `default`
    * Runs qunite task
    * Runs _optimizeJS_ task
    * Runs _optimizeCSS_ task
    * Optimizes Images

2. `watch-css`
    * Runs LESS watcher

3. `optimizeJS` (start of the optimized version)
    * Runs clean on `optimized` folder
    * Runs requirejs, minifying and comibining JS

4. `optimizeCSS`
    * Runs recess on `public/css/styles.less`
        * compresses to `public/css/styles.css`
        * additional files can be added in Gruntfile. Pretty straighforward

###Items to work on

1) Implement server side code testing
2) Create more complete client application example

[1]: http://nodejs.org/
[2]: http://backbonejs.org/
[3]: http://expressjs.com/
[4]: https://qunitjs.com/
[5]: http://gruntjs.com/
[6]: http://backbonejs.org/
[7]: http://jquery.com/
[8]: http://requirejs.org/
[9]: http://underscorejs.org/
[10]: https://github.com/ericf/express3-handlebars
[11]: http://lesscss.org/
[12]: https://github.com/volojs/volo
[13]: http://redis.io/
[14]: https://www.mongodb.org/
