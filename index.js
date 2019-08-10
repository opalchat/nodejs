const credentials = require('./.credentials.json');


var Opal = require('./api.js');

var client = new Opal({ host:"opalchat.com" });
var api = API =client.api;


// Login using email to retrieve an API Token.
api('auth/email').post({
    
    email:      "molly@iohq.org",
    password:    credentials.password
    
}, (err, o) => {
    
    // Error authenticating...
    if (o.error) {
        console.error(o.error);
    } else {
        client.set('token', o.key);
        start();
    }
    
});



function start(){

var bot = {stats:{}};
var sendcount = 0;
var started = Date.now();

function random(args){
      return args[Math.floor(Math.random()*args.length)]; 
} 
 
var fs = require('fs'); 
function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
} 
 
// We save these so that we don't repeat ourselves.
var Messages = {};
// Local storage?
try {
    Messages = require('./messages.json');
} catch (e) {}


// We save these so that we don't repeat ourselves.
var Users = {};
// Local storage?
try {
    Users = require('./users.json');
} catch (e) {}


var Active = {};

var currentTopic = 0; 

var TOPICS = [
   
    "What would you consider your best feature?",
    
    "If you had to ban one user in the room right now, who would it be?",
   
    "Would you consider yourself tough or sensitive?",
     
    "How can we really ever know that George is not a humanoid hybernating in the userlist until his race is prepared for battle against humankind?",
    
    "What childish thing do you still enjoy?",
    
    "What movie do you wish life was more like?",
    "Have you ever smoked pot?",
    
    "Do you think that aliens exist?",
    
    "What social stigma does society need to get over?",
    
    "Who are you most grateful for in this world?",
    
    "What is the largest age difference you've been involved with?",
    
    "Have you ever had an STD?",
    
    "If you had to go on a date with one person on the userlist, who would it be?",
    
    "If you had to kill one person in the channel right now, who would it be?",
    
    "Do you really love me, or am I just another toy to you?",
     
    "What is your favorite thing to put in your mouth?",
      
    "If I got pregnant, would you stay with me?",
    
    "Who's the most attractive user of OpalChat?",
    
    "What is the stupidest thing you have ever done?",
    
    "What belief or interest would make you automatically lose interest in someone?",
  
    "Who are you really? Who is behind the mask that you show to the rest of the world?",
    
    "What is holding you back from being the person you want to be?",
    "No, i can't! Anyway - how's your sex life?",
     
    "What do you hope to achieve in your professional life?",
    
    "What do you really hope your parents never find out about?",  
 
    "What illegal activity have you done in the past 30 days?",
    
    "What is the most uncomfortable thing you've recorded?",
    
    "So uh... What are you wearing?",
    
    "Who's the most terrifying user of OpalChat?",
     
    "How do you think you will die?",
     
    
    "What's the funniest video you've ever seen?",
    
    "What did you want to be when you grew up?",
    
    "How could you best describe yourself in 3 words?", 
    
    "What would you do with a million dollars?",
    
    "You're on a cliff, holding up a kitten in one hand and a puppy in the other, but you have to let go of one to pull yourself back up. Which do you let fall?",
    
    "What is your idea of a perfect relationship?",
    
    "If you had the ability to change just one thing about yourself permanently, what would it be and why?",
    
    "If you could relive one memory, what would it be?",
    
    "If you had the power to change your race, gender, body, mind & location instantly, what would you choose?",
    
    "If you were given the power of an omnipotent god, what would you do with said power?",
    
    "What are you shamed to like, but like anyway?",
    
    "If you could permanently shut down one website, which would you choose and why?",
    
    "What was the most exciting day or night of your life?",
    
    "How many small children would you sacrifice to our dark lord Satan in order to have the one thing you want most in life?",
    
    "Will technology save the human race or destroy it?",
    
    "What technology from a science fiction movie would you most like to have?",
    
    "Harvey Dent - Can we trust him?",
     
    "What would a world populated by clones of you be like?",
    
    "What are some red flags to watch out for in daily life?",
    
    "What’s wrong but sounds right?",
    
    "If you couldn’t be convicted of any one type of crime, what criminal charge would you like to be immune to?",
    
    "What are you interested in that most people aren’t?",
    
    "What smartphone feature would you actually be excited for a company to implement?",
    
    "What signs indicate that Obama is in fact a lizard-person?",
    
    "What’s something people don’t worry about but really should?",
    
    "What's the cruelest thing you've done to someone?",
    
    "What song can you sing all the words to?",
    
    "What app or website could you simply not live without?",
    
    "Am I just a fucking joke to you?",
    
    "Have you ever beat someone up? Why?"
    
];

 
 
 
// Poll the messages.
function PullMessages(){ 
     
    
    ['General',  'Roleplay', 'Off-Topic', 'NSFW'].forEach(function(t){
        API('messages', {channel_id:'chat', topic:t, limit:5}).get((FetchError, data) => {
           
           if (FetchError) return console.error(FetchError);
           else if (!data.user) return false;
            
            if (data.messages) data.messages.forEach(function(m){
               if (!Messages[m.message_id]) {
                   console.log(m);
                   m.received = Date.now();
                   Messages[m.message_id] = m;
                   if (!Users[m.author_id]) { 
            
                        Users[m.author_id] = {};
                        
                        console.log('getting userdata...');
                        API('user', {user_id:m.author_id}).get(function(GetError, data){
                         
                            Users[m.author_id] = data.user;
                            
                            ProcessInput(Users[m.author_id], m);
                        
                        });
                        
                    } else {
                    
                        ProcessInput(Users[m.author_id], m);
                        
                    }
                    
               }
           });
           
           fs.writeFileSync( './messages.json', JSON.stringify(Messages, false, 2) );
           
           
        });
        
        fs.writeFileSync( './users.json', JSON.stringify(Users, false, 2) );
    });
};
PullMessages();




setInterval(function(){
    
    PullMessages();
     
     
    
}, 1000);

function ProcessInput(user, message){
    
    user.lastSeen = Date.now();
    
    if (!user.topics) {
        user.topics = {};
    };
    user.topics[message.meta.topic] = {lastSeen: Date.now()};
    
    Active[user.user_id] = user;
    var topic = message.meta.topic;
    if (!user.data) return false;
    if ( user.data && user.data.name) user.name = user.data.name; 
    if ( user.user_id == 'ba0afba2c0833e42e269e6678af31773' ) return false;
    function w(word){ return new RegExp(word, 'i').test(message.text) }
    var cmd = message.text.trim().toLowerCase().split(' ')[0].replace(/ /gi, '');
    var arg = message.text.trim().substring(cmd.length).trim();
    
    //  if (topic=='NSFW') Send(topic, {text:`[debug] (cmd:${cmd},arg:${arg})`});
    
    // Roleplay Commands.
    if (topic=="Roleplay" || topic=="Gaming"){
    
        if (cmd.startsWith('flip')) {
            Send(topic, {
                text: random([
                    "~ " + user.name + "'s coin lands on heads. ~",
                    "~ " + user.name + "'s coin lands on tails. ~"
                ])
            });
        }
        
        
       
        if (cmd.startsWith('roll')) {
            
            var count = 1, sides = 6; 
            
            if (arg.split(' ')[1]) {
                count = parseInt(arg.split(' ')[0]);
                sides = parseInt(arg.split(' ')[1]);
            } else if (arg.split(' ')[0]) {
                sides = parseInt(arg.split(' ')[0]);
            }
            
            if (count>15) return Send(topic, {text:"Who in the hell just has " + commas(count) + " die laying around?"}); 
            
            var results = [];
            
            for(var z=0; z<count; z++) results.push(Math.floor(Math.random() * sides) + 1);
            
             sum = (results.reduce((a,b) => a + b, 0));
            
            var d20 = 's:dice-d20';
            
            
            var n = sum, die = "(s:dice:b5c5f7)";
        
            if (n==1) die = '(s:dice-one:b5c5f7)';
            if (n==2) die = '(s:dice-two:b5c5f7)'; 
            if (n==3) die = '(s:dice-three:b5c5f7)'; 
            if (n==4) die = '(s:dice-four:b5c5f7)'; 
            if (n==5) die = '(s:dice-five:b5c5f7)'; 
            if (n==6) die = '(s:dice-six:b5c5f7)';  
            
            if (sides>6) {
                die = "(s:dice-d20:b5c5f7)";
                n = '-d20';
            } else if (count>1) {
                die = '(s:dice:b5c5f7)';
            }
            
         
            if (count>1) {
                Send(topic, {text:`${die} ${user.name}'s ${count} ${sides}-sided dice resulted in the sum of ${commas(sum)} (${results.join('+')})`});
            } else 
                Send(topic, {text:`${die} ${user.name}'s single ${sides}-sided die lands on ${results[0]}`});
            
             
        }
        
    
    }
    
    if (cmd=='lull?') {
        
        Send(topic, {
           text: `Yeah dude, been here for like, ${commas(parseInt((Date.now()-started)/60000))} minutes now. Sent like ${commas(sendcount)} replies yo its been crazy.` 
        });
        
    }
    
    if (topic=="Gaming") { 
        
        if (cmd.startsWith('spin')) { 
             
            Send(topic, {
               text: `(s:wine-bottle:b5c5f7) ${user.name} spins the bottle...` 
            });      
            
            
            
            setTimeout(function(){
                
                var users = [];
                 
                for (var each in Users) 
                if (
                    Users[each].topics[topic] && 
                    Users[each].user_id !== 'ba0afba2c0833e42e269e6678af31773' && 
                    (Date.now() - Users[each].topics[topic].lastSeen) < 120000
                ) 
                    users.push(Users[each].name); 
                 
                 if (users.length<2) return Send(topic, {
                   text: "~ As the bottle returns to you, as it has no one else to spin to, you begin to feel just how alone you really are. ~" 
                });
                
                 
                 
                Send(topic, {
                    text: `(s:wine-bottle:b5c5f7) The bottle points to ${random(users)}.`
                });
            },1500);
        }
        
    }
    
    
    
    
    
    
    // Topic Command
    if (!bot.newscene) bot.newscene = 0;
    if (topic=='NSFW' &&  message.text.trim().toLowerCase().replace(/ /gi, '')=='newscene'){
    
        if ( (Date.now()-bot.newscene) < 5000) return false; 
        else {
            bot.newscene = Date.now();
            
             Send(topic, {text: random([
                `Hiring Michael Bay...`,
                `Running through the script one last time...`,
                `Checking with the producers...`,
                `Validating the director's parking real quick...`,
                `Generating script...`,
                `Creating a masterpiece...`,
                `Hiring M. Night Shyamalan...`
            ])}); 
            
            setTimeout(function(){
                 
                
                GenerateScene();
                 
                
            },3000);
            
        }
        
    }
       
    
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
}

function GenerateScene(){
    
    var users = [];
    for (var each in Users) 
        if (
            Users[each].topics[topic] && 
            Users[each].user_id !== 'ba0afba2c0833e42e269e6678af31773' &&
            Date.now() - Users[each].topics[topic].lastSeen < 120000
        ) 
        users.push(Users[each].name); 
    
    shuffle(users);
     
    if (users.length<4) return Send(topic, {
       text: "There aren't enough users active in here :( Get this place jumpin' and try again!" 
    });
    
    var scenes = [];

    // Event
    var ITEMS1 = [
    "a bottle of vodka", 
    "a cup of fresh urine", 
    "a box of condoms",
    "an apology letter",
    "the abortion results",
    "a human sacrifice",
    "a tied up child",
    `a deviant smile`, 
    "a boquet of flowers", 
    "a bushel of weed", 
    "a subtle erection",
    "a list of sexual demands",
    `a list of ${users[2]}'s fetishes`,
    `a stolen bicycle`,
    `a dangerous republican mindset`,
    `crippling depression`,
    "a keg of beer", 
    "two shots of tequila",
    "a glass of scotch", 
    `no will to live`,
    `what could be a bag of eggwhites`,
    `a new found lust for ${users[2]}`,
    "a gimp suit",
    "closeted homophobia",
    "car full of clowns",
    "a bottle of chloroform",
    "industry standard filmography equipment",
    "the blood of christ",
    "Kelsi's trashcan",
    "6 pack of beer",
    "a bag of deceased cats", 
    "a pack of wolves",
    "thomas the dank engine",
    `blackface`,
    `dangerous curiosity`,
    "Limp Bizkit",
    "a backstreet chicago hooker",
    "Donald Trump's fake hair",
    "a briefcase of $50,000 untraceable bills",
    "the corpse of Biggie Smalls",
    "some rope",
    "romantic candles",
    `${users[2]}'s dignity`,
    `${users[2]}'s severed head`,
    `${users[2]}'s lover locked in arms`,
    `a face mask made of ${users[2]}'s ass`,
    `undeniable proof that ${users[2]} is the father`
    ];
    var ITEMS2 = [
    "a freshly ripped bong", 
    `a nude photo of ${users[3]}`, 
    `a nude photo of ${users[3]}'s ex-lover`, 
    `a sextape of ${users[3]}'s grandparents`, 
    `a sextape of ${users[3]}'s parents`, 
    "a can of half-eaten dogfood", 
    "a late 80's porno mag", 
    "a loaded, fully-automatic rifle", 
    "a do-it-yourself rape kit",
    `${users[3]}'s forged consent forms`,
    "a video camera",
    "a getaway car",
    "a Berry White record",
    `a plaster casting of ${users[0]}'s genitals`,
    `${users[0]}'s breast cancer results`,
    `Zombie Iron Man`,
    `${users[3]}'s well-done implants`,
    `a bound-and gagged ${users[3]}`,
    `the stink of shame and regret`,
    "the well-preserved semen of Jesus Christ himself",
    "uncontrollable sexual desires",
    `${users[0]}'s used tampon`,
    `${users[0]}'s favorite toy`,
    "a complete mental breakdown", 
    `hits on ${users[0]}'s best friend`,
    `flirts with ${users[0]}'s mom`,
    `exposes himself`,
    `dabs like a middle aged soccer mom`,
    `${users[0]}'s favorite thong`,
    `attempts to feel-up ${users[3]}`,
    `declares his love for satan`,
    `offers ${users[3]} a good time.`
    ];
    
    var EVENTS = [
    "at:funeral", 
    "during:first kiss", 
    "during:morning shower",
    "during:strip tease",
    "during:late evening alone time",
    "during:first time", 
    "just after:erotic awakening",
    "during:bar mitzvah", 
    "during:first date", 
    "during:mother's day dinner", 
    "during:family reuinion", 
    "at:wedding", 
    "during:in-school suspension",
    "at:11th birthday party",
    "at:graduation ceremony",
    "during:proctology examination",
    "at:court hearing", 
    "during:church sermon",
    "just after:clan meeting",
    "at:orientation day",
    "right after:alcoholic's anonymous meeting",
    "during:first job interview",
    "during:bubble bath",
    "during:full-body massage",
    "during:casting call",
    "during:dorm-room experimentation",
    "during:proposal for marriage",
    "during:questioning of their sexuality",
    "during:mid-life crisis",
    "after:pregnancy scare"
    ]
    
    var evt = random(EVENTS);
    scenes.push(`(s:video:ee4030) ${evt.split(":")[0]} ${users[0]}'s  ${evt.split(":")[1]}, ${users[1]} stumbles in with ${random(ITEMS1)} and ${random(ITEMS2)}.` )
         
    Send(topic, {text:random(scenes)});
    
    
}


    // Topic Command
    if (!bot.newtopic) bot.newtopic = 0;
    if (
        message.text.trim().replace(/ /gi,'').toLowerCase()=='newtopic'
    ) {
    
        if ( (Date.now()-bot.newtopic) < 5000) return false; 
        else {
            bot.newtopic = Date.now();
            
            Send(topic, {text: random([
                `Reaching into the goody bag for a new topic...`  ,
                `Sacrificing several small children for the gods to bless us with a new topic...`,
                `Searching database for new topic...`,
                `Scanning collections for new topic...`,
                `Searching for a new topic...`,
                `Doing a quick google search for a new topic...`,
                `Asking Null for a topic...`,
                `Looking through the dumpster for something to talk about...`,
                `Analysing user interests for relevent topics...`
            ])});
            
            setTimeout(function(){
                 
                
                if (!TOPICS[currentTopic]) currentTopic = 0;
                
                Send(topic, {text: TOPICS[currentTopic]});
                
                currentTopic++;
                
            },3000);
            
        }
        
    }
       
       
    if (w('what is this') || w('whats this') || w("what's this") || w("where am i")) {
        Send(topic, {text:"OpalChat.com is a site for creating communities & friendships. Make a profile, join a chatroom, make some friends and talk about whatever you want!"});
    }
       
        
    // Facebook Helpero.json
    if (!bot.patreonpost) bot.patreonpost = 0;
    if ( 
            w('patreon')
        ||  w('donate') 
    ) {
    
        if ( (Date.now()-bot.patreonpost) < 300000) return false; 
        else {
        if (/opalchat/i.test(message.text)) return false;
            bot.patreonpost = Date.now();
            Send(topic, {text: random([
                `OpalChat survives by donations: https://www.patreon.com/opalchat`    
            ])});
        }
        
    }
    
    // Facebook Helper
    if (!bot.twitterpost) bot.twitterpost = 0;
    if ( 
            w('twitter')
    ) {
    
        if ( (Date.now()-bot.twitterpost) < 300000) return false; 
        else {
        if (/opalchat/i.test(message.text)) return false;
            bot.twitterpost = Date.now();
            Send(topic, {text: random([
                `Follow OpalChat on twitter! https://www.twitter.com/opalchat` ,  
            ])});
        }
        
    }
    
     // Facebook Helper
    if (!bot.redditpost) bot.redditpost = 0;
    if ( 
            w('reddit')
    ) {
    
        if ( (Date.now()-bot.redditpost) < 300000) return false; 
        else {
        if (/opalchat/i.test(message.text)) return false;
            bot.redditpost = Date.now();
            Send(topic, {text: random([
                `We're on Reddit! https://www.reddit.com/r/OpalChat` ,  
            ])});
        }
        
    }
         
    // Twitch Helper
    if (!bot.twitchpost) bot.twitchpost = 0;
    if ( 
            w('twitch')
        ||  w('stream') 
    ) {
        if (/opalchat/i.test(message.text)) return false;
        if ( (Date.now()-bot.twitchpost) < 300000) return false; 
        else {
            bot.twitchpost = Date.now();
            Send(topic, {text: random([
                `Live OpalChat development: https://www.twitch.tv/opalchat` 
            ])});
        }
        
    }
    
    
    
    
    // Patreon Helper
    if (!bot.facebookpost) bot.facebookpost = 0;
    if ( 
            w('facebook') 
    ) {
    
        if (/opalchat/i.test(message.text)) return false;
        if ( (Date.now()-bot.facebookpost) < 300000) return false; 
        else {
            bot.facebookpost = Date.now();
            Send(topic, {text: random([
                `Like us on Facebook! https://www.facebook.com/opalchat`
            ])});
        }
        
    }
    
     
    
    
    // Discord Helper
    if (!bot.discordpost) bot.discordpost = 0;
    if ( 
            ( w('discord') && w('server') )
        ||  ( w('official') && w('discord') ) 
        ||  ( w('opal') && w('discord') )
    ) {
    
        if ( (Date.now()-bot.discordpost) < 300000) return false; 
        else {
            bot.discordpost = Date.now();
            Send(topic, {text: random([
                `Join our community Discord server! https://discordapp.com/invite/DewFwbe`  ,
                `OpalChat has a discord server: https://discordapp.com/invite/DewFwbe`    
            ])});
        }
        
    }
    
    
    
    // User Engagement 
    if (!user.engaged) { 
        
        var interests = ["sports", "bored", "undertale", "lonely", "hydra", "depressed", "roleplay", "movies", "games", "music", "married", "books", "school", "anime", "horny"];
        var flags = {};
        
        if (user.data.bio || user.bio){
            interests.forEach(function(i){
                if (new RegExp(i, 'i').test(user.data.bio)) flags[i] = true;
                else if (new RegExp(i, 'i').test(user.bio)) flags[i] = true;
            });
        }
        
        if ( 
        
            (
                (
                    (w('i am') || w("i'm") || w("im") || w("am"))
                
                &&  ( w("hrny") || w("horny") || w("horney") || w("hornie") || w("hrny")  ) 
                ) 
                ||
                w('nudes', 'sex')
            ) 
        
        ) flags.horny = true;
        
        
        console.log('user->', user.name);
         if (/(cat|dog|racoon|skunk|neko|fox)/i.test(user.name)) {
            flags.ispet = true;
        }
       
        console.log('flags:', flags);
        var map = {
            
            "ispet":      [
            
                `~ Puts out some food for ${user.name} ~ OMNOMNOM`,
                
                `~ Pets ${user.name}'s soft fur... ~`
                 
            ],
            
            "hydra":   [
            
                `${user.name} - HAIL HYDRA!`
            
            ],
            
            "bored":    [
            
                `If you're bored you're definitely in the right place ${user.name}!`,
                
                `Nothing cures boredom like Opal, ${user.name}!`
            
            ],
            
            "sports":   [
              
              `What's your favorite sport ${user.name}?`,
              
              `Hey ${user.name} what sports you into??`
                
            ],
            
            "horny":        [
              
                `Hey this isn't really the place for horny people ${user.name} that's kinda gross :/`,
                
                `This site isn't for sex ${user.name}!!!`
                
            ],
            
            "married":      [
                
                `Hey ${user.name}, how's the marriage going?`, 
                
                `How's the married life, ${user.name}?`
                
            ],
            
            "movies":       [
                
                `You a film lover huh ${user.name}? Any favorites?`, 
                
                `Hey ${user.name} what kinda movies are your faves?`
                
            ],
            
            "books":        [
                
                `What kind of books do you like ${user.name}?`, 
                
                `Ooooh ${user.name} I see you like books! Any favorites?`
                
            ],
            
            "school":       [
                
                `Heya ${user.name}! How's school?`
                
            ],
            
            "music":        [
                
                `Hey  ${user.name} what's your favorite music genre? :o`, `Ayy ${user.name} what kinda music you listen to?`
                
            ],
            
            "games":        [
            
                `What kind of games do you play, ${user.name}?`, `${user.name} what kinda games are you into?`
            
            ],
            
            "anime":        [
                
                `What's your fave anime, ${user.name}?`, `${user.name} what kinda anime you like??`
                
            ],
            
            "lonely":       [
                
                `Awww sorry you're lonely ${user.name}!!! Chat with us!`,
                
                
                `Sorry if you're feeling lonely ${user.name}, this chat helps with that though (s:heart:ff0000)`
                
            ]
    
        }
        
        
    
        
        var engagement = false;
        
        for(var f in flags) {
            for (var r in map) {
              if (f == r)  engagement = map[r]; 
            }
        }
        
        if (engagement) {
            console.log(('send ' + topic + ': ', engagement))
            Send(topic, {text:random(engagement)});
            user.engaged = Date.now();
            
        }
    
        
    }  
    
     
    
    // Name was mentioned.
    if ( /fuck|shit|pussy|cunt|dick|cock|vagina|penis|slut|cuck|porn|bitch|horny|skank|whore|dyke|fag|nigger|niger|chode|douche/gi.test(message.text) ) {
        
    
            
        if (!user.curses) {user.curses = 0; user.lastcurse = Date.now()}
        else if (user.warned && Date.now()-user.warned > 60000) {user.curses = 0; user.warned = false;}
        
        
        user.curses++;
        
        if (user.curses > 5 && !user.warned) {
              
            user.warned = Date.now();
            
            Send(message.meta.topic, {
            
                text: random([
                    `You have a naughty filthy mouth ${user.name}!`, 
                    `${user.name} says so many badwords, naughty naughty!`, 
                    `I wish you'd speak kinder, ${user.name} :/`, 
                    `You've got quite a filthy vocabulary, ${user.name}!`
                ])
            
            });
        }
            
        
            
    };
    
    
    if (user.HateSpeechWarning && Date.now()-user.HateSpeechWarning>60000) user.HateSpeechWarning = false;
    if ( /nigger|niggr|nigr|niger|faggot|faggt|fggot|fggt|fagets/gi.test(message.text) ) {
        
        if (!user.HateSpeechWarning )  {
            user.HateSpeechWarning = Date.now();
            Send(message.meta.topic, {
            
                text: random([
                    `You know you could get banned for that kind of talk, ${user.name}!`, 
                    `${user.name} that's really really mean and I hope you'd apologize, we don't like that!`, 
                    `That's a really bad word to use, ${user.name} :/`,
                ])
            
            });
            if (topic!=='General') Send('General', {
            
                text: random([
                    `Mods!!! ${user.name} is being a big meanie pants in ${topic} :-(`,
                    `AHH!!! ${user.name} is being nasty in ${topic} D-:`
                ])
            
            });
        }
        
    } 
    
};



function Send(topic, data){
    sendcount++;
    if (!data.meta) data.meta = {};
    data.meta.topic = topic;
    console.log(topic, data);
    API('message', { channel_id: 'chat' }).post(data, console.log);  
}

}