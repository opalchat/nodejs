module.exports = (client, user) => {
    
    client.api('user', {
        
        user_id:    user.user_id
    
    }).put({
        
        "public":   JSON.stringify({"interests": ['hello', 'hi']})
        
    }, (UpdateError, data)=>{
            
       if (UpdateError) return console.log(UpdateError.message);
       else if (data.error) console.log(data.error);
       else console.log(data.response);
           
       whoami(()=>console.log(`Updated User`, client.identity.user));
       
    });

}