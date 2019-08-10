var request = require('request'),
    querystring = require('querystring');
 

module.exports = function(config){
    
    if (typeof config !== 'object') throw new Error("You need to pass a config when you create your client.");
    
    // Client information.
    var $O = {
        api_version:    "1.0",
        instance:       config.instance,
        host:           (typeof config.host=='string'?config.host:'opalchat.com')
    };
    
    // Set a variable in the client.
    $O.set = function(key, value){
      $O[key] = value;
    };
    
    // API Calling.
    $O.api = function(url, q){
            
        var query = {};
        if (q) query = q;
              
            
             var REQ = function(type, url, c, d){
                
                var cb = function(){};
                var data = {};
                
                
                if (!d) cb = c;
                else {
                    cb = d;
                    data = c;
                }
                
                //console.log('[' + type + '] ' + url + '\n Q:', query,'\n B:', data);
                
                var opts = {
                    method: type,
                    url:    'https://' 
                            + $O.host 
                            + (url.startsWith('/')?'':'/')  
                            + 'api/' + url 
                            + '?instance_id=' + ($O.instance)
                            + '&api_key=' + ($O.token) 
                            + (q?'&':'') 
                            + querystring.stringify(query),
                    body:   data,
                    json:   (typeof type !== 'get')
                };
                 
                request(opts, (RequestError, data) => {
                    
                    if (cb) {
                        if (RequestError)    cb(RequestError);
                        else if (!data.body) cb({message:"No body was returned with the response.", response:data});
                        else                 cb(RequestError, data.body);
                    }
                    
                });
            };
            
            return {
                get:     (data, cb) => { 
                    REQ('get', url, data, cb);
                },
                put:     (data, cb) => {
                    REQ('put', url, data, cb);
                },
                post:    (data, cb) => {
                    REQ('post', url, data, cb);
                },
                delete:  (data, cb) => {
                    REQ('delete', url, data, cb);
                }
            };
            
        };
        
    return $O;
    
};