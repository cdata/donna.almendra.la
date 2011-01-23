var express = require('express'),
    app = express.createServer(),
    util = require('util'),
    fs = require('fs');

app.use(express.staticProvider(__dirname + '/static'));
app.set('view options', { layout: 'layout.jade' });
app.set('view engine', 'jade');

app.configure(
    'development',
    function() {
        
        fs.readFile(
            '../source/targets/site.json',
            function(error, data) {
                
                if(error) {
                    
                    util.log('Error reading site file list..');
                } else {
                    
                    var siteData = JSON.parse(data);
                    
                    app.set(
                        'environment',
                        {
                            devJS: siteData.tasks.JS.input.map(
                                function(value, index, list) {
                                    
                                    return "/javascripts/development/" + value.split('/').pop();
                                }
                            ),
                            devCSS: siteData.tasks.CSS.input.map(
                                function(value, index, list) {
                                    
                                    return "/stylesheets/development/" + value.split('/').pop();
                                }
                            ),
                            jsMode: 'debug',
                            cssMode: 'debug'
                        }
                    );
                }
            }
        );
    }
);

app.configure(
    'debug',
    function() {
        
        app.set(
            'environment',
            {
                jsMode: 'debug',
                cssMode: 'debug'
            }
        );
    }
);

app.configure(
    'production',
    function() {
        
        app.set(
            'environment',
            {
                jsMode: 'production',
                cssMode: 'production'
            }
        );
    }
);

app.get(
    '/',
    function(req, res) {
        
        res.render(
            'index', 
            {
                locals: {
                    environment: app.set('environment')
                }
            }
        );
    }
);

app.get(
    '/*',
    function(req, res) {
        
        res.render(
            '404',
            {
                locals: {
                    environment: app.set('environment')
                }
            }
        );
    }
);

app.listen(80);

util.log('Server started!');