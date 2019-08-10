const credentials = require('./.credentials.json');

var Opal = require('./api2.js');
var client = new Opal({ instance:"opalchat", host: "dev.opalchat.com:8080" });
var api = client.api;

var creds = credentials[process.argv[2]];
if (!creds) return console.error("User not defined in credentials.json");

// Login using email to retrieve an API Token.
api('auth/email').post(creds, (err, o) => {
    
    // Error authenticating...
    if (err) {
        console.error(err);
    } else if (o.error) {
        console.error(o.error);
    } else if (o.response) {
        
        client.set('token', o.response.key);
        whoami(start);
        
    } else console.error(o);
    
});

// Retrieve my user data.
function whoami(cb){
       
    api('echo').get((err, data)=>{
        if (err) return console.error('request error:', err);
        if (data.error) return console.error('api error:', data.error);
        client.identity = data.identity;
        if(cb) cb();
            
    });
    
}

// This will be executed once we've authenticated.
function start(){ 
    
    console.log("Authenticated!");
    var user = client.identity.user;
    
 // <my bot logic>
  
    console.log(`Hi, I'm ${user.name}!`, user.private);
    
    // Update bio.
    /**api('user', {user_id: user.user_id}).put({
        "public":   JSON.stringify({"interests": ['hello', 'hi']})
    }, (UpdateError, data)=>{
        
       if (UpdateError) return console.log(UpdateError.message);
       else if (data.error) console.log(data.error);
       else console.log(data.response);
       
       whoami(()=>console.log(`Updated User`, client.identity.user));
    });
    **/
    
    // List activity.
    /**
    api('activity', {resource:'auth/email', method:'post'}).get((err, data)=>{
       
       var calls = []; 
       
       data.response.calls.forEach(c=>{
           
          if (c==null) return false;
           
          var call =            {activity_id: c.activity_id};
          call.resource =       c.request.resource;
          call.method =         c.request.method;
          call.t =              new Date(c.metrics.started).toISOString();
          call.body =           c.request.body;
          call.query =          c.request.query;
          call.response =       c.response;
          
          calls.push(call);
          
       }); 
       
       
       console.log(calls);
       
        
    });
    **/
    
    // Add Contact
    /**
     api('contact').post( { user_id:"04c2105c45d5b5640af829383ea85d2a" }, (ContactAddError, data)=>{
        if (data.error) console.error(data.error); 
        else console.log(data.response);
        api('contacts').get((ContactError, data)=>{
        
           console.log(data.response); 
           
        }); 
    });
     **/
    
    // Delete Contact
    /**
    api('contact', { user_id:"04c2105c45d5b5640af829383ea85d2a" }).delete((ContactAddError, data)=>{
        if (data.error) console.error(data.error); 
        else console.log(data.response);
        api('contacts').get((ContactError, data)=>{
        
           console.log(data.response); 
           
        });
    
    });
    **/
    
    // Post message.
    /**
    api('message', {channel_id:"test"}).post({  
        
        text: "hello!"
        
    }, (PostError, data)=>{
        
        if (PostError)  
            console.error(PostError.message);
        
        else if (data.error) 
            console.error(data.error);
        
        console.log('response:', data.response); 
        
    });
    **/
    
    // Update message. 
    api('message', {message_id:'645efa24cf2e3adbfc729f0ab11fa82a'}).put({
        
        'public': JSON.stringify({test:Date.now()})
        
    }, (PutError, data)=>{
        
        if (PutError) return console.error('puterror', PutError.message);
    
        console.log('put:', data.error || data.response);
        
        // Update message. 
        api('message', {message_id:'645efa24cf2e3adbfc729f0ab11fa82a'}).get((GetError, data2)=>{
            
            if (GetError) return console.error(GetError.message);
            
            console.log(data2.error || data2.response);
                
        }); 
        
    }); 
     
}