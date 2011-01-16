HOST = null; // localhost
PORT = 80;

// when the daemon started
var starttime = (new Date()).getTime();

var mem = process.memoryUsage();
// every 10 seconds poll for the memory.
setInterval(function () {
  mem = process.memoryUsage();
}, 10*1000);


var fu = require("./fu"),
    ch = require("./Channel"),
    sys = require("sys"),
    url = require("url"),
    qs = require("querystring");

var SESSION_TIMEOUT = 60 * 1000;


// [room_name] => array(sessions)
var rooms = {};

function joinRoom (room_name, nick) {
  if (room_name.length > 50) return null;
  if (/[^\w_\- ^!]/.exec(room_name)) return null;
  if (nick.length > 50) return null;
  if (/[^\w_\-, ^!]/.exec(nick)) return null;

  // Does the room exist?
  if (typeof rooms[room_name] == 'undefined') {
    // No. Create it.
    
    sys.puts('Creating a room: '+room_name);

    var channel = new ch.Channel(room_name);

    var room = { 
      room_name: room_name,
      channel: channel,
      sessions: []
    };

    rooms[room_name] = room;

    // interval to kill off old sessions
    setInterval(function () {
      var now = new Date();
      for (var id in this.sessions) {
        if (!this.sessions.hasOwnProperty(id)) continue;
        var session = this.sessions[id];

        if (now - session.timestamp > SESSION_TIMEOUT) {
          session.destroy();
        }
      }
    }.bind(room), 1000);
  }

  // Is the user already in the room?
  if (!rooms[room_name].sessions[nick]) {
    // No, join the room.
    rooms[room_name].sessions[nick] = createSession(nick, rooms[room_name]);

  } else {
    return null;
  }

  return rooms[room_name];
}

function createSession (nick, room) {
  if (nick.length > 50) return null;
  if (/[^\w_\-, ^!]/.exec(nick)) return null;

  for (var i in room.sessions) {
    var session = room.sessions[i];
    if (session && session.nick === nick) return null;
  }

  var session = { 
    nick: nick, 
    timestamp: new Date(),

    poke: function () {
      session.timestamp = new Date();
    },

    destroy: function () {
      room.channel.appendMessage(session.nick, "part");
      delete room.sessions[session.nick];
    }
  };

  return session;
}

// function to generate random user names
function generate_name() {
  var letters = new Array("a","b","c","d","e","f","g","h","i","j","k","m","n","l","o","p","q","r","s","t","u","v","w","x","y","z");
  var funny_names = new Array(
    "Neurolomancer",
    "Masked Bandit",
    "Asp Lady",
    "Beef Lady",
    "Beermaster",
    "Beermistress",
    "Beerologer",
    "Colamaster",
    "Crawdad Director",
    "Crawdad Driver",
    "Dirtmentalist",
    "Frog Lord",
    "Geckomistress",
    "Lemming Tamer",
    "Linguini Tosser",
    "Lizard Lady",
    "Manicotti Sorceror",
    "Mariachimentalist",
    "Pieologer",
    "Puffin Threatener",
    "Puppy Handler",
    "Skink Master",
    "Snark Harasser",
    "Trout Wrestler",
    "Vermicelli Buster",
    "Vibe Wizard",
    "Walrus Intimindator",
    "The Mastikator",
    "Accordionologer",
    "Bullfrog Bludgeoner",
    "Bullfrog Wrestler",
    "Buzzardsmith",
    "Coriander Bandit",
    "Crocodile Trampler",
    "Dove Grappler",
    "Funk Witch",
    "Lemming Mover",
    "Lizard Grappler",
    "Malamute Lord",
    "Moose Master",
    "Move Mentalist",
    "Mustard Boss",
    "Plasticmaster",
    "Potatoologer",
    "Protein Weilder",
    "Rattlesnake Marker",
    "Rhyme Paladin",
    "Rummiser",
    "Starchmentalist",
    "Tarragonmistress",
    "Trout Chief",
    "Walrus Threatener",
    "Armadillo Mentalist",
    "Asp Gatherer",
    "Asp Teacher",
    "Baymistress",
    "Caribouologer",
    "Corn Hooligan",
    "Crawdad Master",
    "Crawdad Slapper",
    "Glue Scholar",
    "Groove Samurai",
    "Jam Conjurer",
    "Jam Paladin",
    "Lizard Lady",
    "Kittenmancer",
    "Rattlesnake Supervisor",
    "Ravioli Marker",
    "Seal Basher",
    "Tarragon Gatherer",
    "Toad Mentalist",
    "Vibe Criminal",
    "Walrusmentalist",
    "Whalemaster",
    "Aligatormistress",
    "Allspice Collector",
    "Basilmistress",
    "Beermongerer",
    "Boogie Thrower",
    "Chili Juggler",
    "Cobramancer",
    "Crocodile Handler",
    "Dough Spellbinder",
    "Doughmistress",
    "Eelmaster",
    "Erminemistress",
    "Jiggymistress",
    "Koalamancer",
    "Malamute Handler",
    "Mariachi Priest",
    "Mariachi Stealer",
    "Marinara Weilder",
    "Moose Handler",
    "Narwhalmistress",
    "Ox Subjugator",
    "Protein Witch",
    "Sage Brujo",
    "Ternmistress",
    "Wax Spellbinder",
    "Aligator Smacker",
    "Aligatormiser",
    "Allspice Mover",
    "Bullfrog Master",
    "Butter Bard",
    "Corn Handler",
    "Doughmancer",
    "Dradel Robber",
    "Ermine Attacher",
    "Hamster Mover",
    "Hat Magus",
    "Iguanamistress",
    "Lemmingmentalist",
    "Linguini Larcenist",
    "Mariachimancer",
    "Moose Smacker",
    "Moosementalist",
    "Narwhal Attacher",
    "Narwhal Smacker",
    "Potato Warrior",
    "Potatomongerer",
    "Reindeer Smacker",
    "Vulture Frightener",
    "Yam Magus",
    "Armadillomistress",
    "Aspmaster",
    "Banjo Weilder",
    "Bonsai Handler",
    "Bullfrog Attacher",
    "Cobramaster",
    "Crocodile Bludgeoner",
    "Disco Witch",
    "Eel Subduer",
    "Erminemistress",
    "Gecko Boxer",
    "Gluemiser",
    "Lint Mage",
    "Pepper Horker",
    "Ravioli Ninja",
    "Rhyme Spellbinder",
    "Rum Prophet",
    "Sage Wizard",
    "Salamander Teacher",
    "Sample Mentalist",
    "Scotchmancer",
    "Toad Frightener",
    "Toadmentalist",
    "Vulture Tamer",
    "Wumpus Smacker",
    "Gargelator"
  ); 

  var rand_letter = Math.ceil(Math.random()*100)%letters.length;
  var rand_number = Math.ceil(Math.random()*100)%100;
  var rand_title = Math.ceil(Math.random()*1000)%funny_names.length;

  return letters[rand_letter] + rand_number + ", the " + funny_names[rand_title];
}


// define paths and corresponding handlers
fu.listen(Number(process.env.PORT || PORT), HOST);

/*
(define l '("af" "sq" "am" "ar" "hy" "az" "eu" "be" "bn" "bh" "bg" "my" "br" "ca" "chr" "zh" "zh-CN" "zh-TW" "co" "hr" "cs" "da" "dv" "nl" "en" "eo" "et" "fo" "tl" "fi" "fr" "fy" "gl" "ka" "de" "el" "gu" "ht" "iw" "hi" "hu" "is" "id" "iu" "ga" "it" "ja" "jw" "kn" "kk" "km" "ko" "ku" "ky" "lo" "lo" "la" "lv" "lt" "lb" "mk" "ms" "ml" "mt" "mi" "mr" "mn" "ne" "no" "oc" "or" "ps" "fa" "pl" "pt" "pt-PT" "pa" "qu" "ro" "ru" "sa" "gd" "sr" "sd" "si" "sk" "sl" "es" "su" "sw" "sv" "syr" "tg" "ta" "tl" "tt" "te" "th" "bo" "to" "tr" "uk" "ur" "uz" "ug" "vi" "cy" "yi" "yo"))
(for-each (lambda (x) (printf "fu.get(\"/~a\", fu.templateHandler(\"frontend/index.html\", function(input) { return input.replace('{{language}}', '~a') }));\n" x x)) l)
*/

fu.get("/", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'en') }));
fu.get("/af", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'af') }));
fu.get("/sq", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'sq') }));
fu.get("/am", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'am') }));
fu.get("/ar", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ar') }));
fu.get("/hy", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'hy') }));
fu.get("/az", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'az') }));
fu.get("/eu", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'eu') }));
fu.get("/be", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'be') }));
fu.get("/bn", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'bn') }));
fu.get("/bh", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'bh') }));
fu.get("/bg", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'bg') }));
fu.get("/my", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'my') }));
fu.get("/br", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'br') }));
fu.get("/ca", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ca') }));
fu.get("/chr", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'chr') }));
fu.get("/zh", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'zh') }));
fu.get("/zh-CN", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'zh-CN') }));
fu.get("/zh-TW", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'zh-TW') }));
fu.get("/co", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'co') }));
fu.get("/hr", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'hr') }));
fu.get("/cs", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'cs') }));
fu.get("/da", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'da') }));
fu.get("/dv", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'dv') }));
fu.get("/nl", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'nl') }));
fu.get("/en", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'en') }));
fu.get("/eo", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'eo') }));
fu.get("/et", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'et') }));
fu.get("/fo", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'fo') }));
fu.get("/tl", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'tl') }));
fu.get("/fi", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'fi') }));
fu.get("/fr", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'fr') }));
fu.get("/fy", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'fy') }));
fu.get("/gl", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'gl') }));
fu.get("/ka", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ka') }));
fu.get("/de", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'de') }));
fu.get("/el", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'el') }));
fu.get("/gu", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'gu') }));
fu.get("/ht", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ht') }));
fu.get("/iw", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'iw') }));
fu.get("/hi", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'hi') }));
fu.get("/hu", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'hu') }));
fu.get("/is", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'is') }));
fu.get("/id", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'id') }));
fu.get("/iu", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'iu') }));
fu.get("/ga", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ga') }));
fu.get("/it", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'it') }));
fu.get("/ja", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ja') }));
fu.get("/jw", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'jw') }));
fu.get("/kn", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'kn') }));
fu.get("/kk", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'kk') }));
fu.get("/km", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'km') }));
fu.get("/ko", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ko') }));
fu.get("/ku", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ku') }));
fu.get("/ky", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ky') }));
fu.get("/lo", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'lo') }));
fu.get("/lo", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'lo') }));
fu.get("/la", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'la') }));
fu.get("/lv", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'lv') }));
fu.get("/lt", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'lt') }));
fu.get("/lb", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'lb') }));
fu.get("/mk", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'mk') }));
fu.get("/ms", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ms') }));
fu.get("/ml", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ml') }));
fu.get("/mt", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'mt') }));
fu.get("/mi", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'mi') }));
fu.get("/mr", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'mr') }));
fu.get("/mn", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'mn') }));
fu.get("/ne", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ne') }));
fu.get("/no", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'no') }));
fu.get("/oc", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'oc') }));
fu.get("/or", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'or') }));
fu.get("/ps", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ps') }));
fu.get("/fa", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'fa') }));
fu.get("/pl", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'pl') }));
fu.get("/pt", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'pt') }));
fu.get("/pt-PT", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'pt-PT') }));
fu.get("/pa", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'pa') }));
fu.get("/qu", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'qu') }));
fu.get("/ro", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ro') }));
fu.get("/ru", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ru') }));
fu.get("/sa", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'sa') }));
fu.get("/gd", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'gd') }));
fu.get("/sr", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'sr') }));
fu.get("/sd", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'sd') }));
fu.get("/si", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'si') }));
fu.get("/sk", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'sk') }));
fu.get("/sl", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'sl') }));
fu.get("/es", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'es') }));
fu.get("/su", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'su') }));
fu.get("/sw", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'sw') }));
fu.get("/sv", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'sv') }));
fu.get("/syr", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'syr') }));
fu.get("/tg", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'tg') }));
fu.get("/ta", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ta') }));
fu.get("/tl", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'tl') }));
fu.get("/tt", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'tt') }));
fu.get("/te", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'te') }));
fu.get("/th", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'th') }));
fu.get("/bo", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'bo') }));
fu.get("/to", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'to') }));
fu.get("/tr", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'tr') }));
fu.get("/uk", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'uk') }));
fu.get("/ur", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ur') }));
fu.get("/uz", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'uz') }));
fu.get("/ug", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'ug') }));
fu.get("/vi", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'vi') }));
fu.get("/cy", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'cy') }));
fu.get("/yi", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'yi') }));
fu.get("/yo", fu.templateHandler("frontend/index.html", function(input) { return input.replace('{{language}}', 'yo') }));

fu.get("/reset.css", fu.staticHandler("frontend/css/reset.css"));
fu.get("/chat_style.css", fu.staticHandler("frontend/css/chat_style.css"));

fu.get("/chat_client.js", fu.staticHandler("frontend/js/chat_client.js"));
fu.get("/jquery.js", fu.staticHandler("frontend/js/jquery.js"));
fu.get("/animation.js", fu.staticHandler("frontend/js/animation.js"));

fu.get("/favicon.ico", fu.staticHandler("frontend/images/favicon.ico"));
fu.get("/images/shadow.png", fu.staticHandler("frontend/images/shadow.png"));
fu.get("/images/logo.png", fu.staticHandler("frontend/images/logo.png"));
fu.get("/images/stripes.png", fu.staticHandler("frontend/images/stripes.png"));

fu.get("/who", function (req, res) {
  sys.puts('serv: who');
  sys.puts(' - req: '+req);
  sys.puts(' - res: '+res);
  var room_name = qs.parse(url.parse(req.url).query).room;
  var nicks = [];
  for (var id in rooms[room_name].sessions) {
    if (!rooms[room_name].sessions.hasOwnProperty(id)) continue;
    var session = rooms[room_name].sessions[id];
    nicks.push(session.nick);
  }
  res.simpleJSON(200, { nicks: nicks
                      , rss: mem.rss
                      });
});



fu.get("/join", function (req, res) {
  sys.puts('serv: join');
  sys.puts(' - query: '+url.parse(req.url).query);
  
  // Gets the room name from the URL (a GET request).
  var room_name = qs.parse(url.parse(req.url).query).room;
  room_name = room_name.toUpperCase();
  if (room_name == null || room_name.length == 0) {
    res.simpleJSON(400, {error: "Bad room name."});
    return;
  }

  var user_name = generate_name();
  var room = joinRoom(room_name, user_name);
  if (room == null) {
    res.simpleJSON(400, {error: "There's already a user with your name in the room."});
    return;
  }

  sys.puts("connection: " + room_name + "@" + res.connection.remoteAddress);

  room.channel.appendMessage(user_name, "join");
  res.simpleJSON(200, { nick: user_name
                      , room: room_name
                      , rss: mem.rss
                      , starttime: starttime
                      });
});

fu.get("/part", function (req, res) {
  sys.puts('serv: part');
  var id = qs.parse(url.parse(req.url).query).nick;
  var room_name = qs.parse(url.parse(req.url).query).room;
  var room = rooms[room_name];

  if (!room) {
    res.simpleJSON(400, { error: "The server has been rebooted. Please refresh your browser." });
    return;
  }

  var session;
  if (id && room.sessions[id]) {
    session = room.sessions[id];
    session.destroy();
  }
  res.simpleJSON(200, { rss: mem.rss });
});

fu.get("/recv", function (req, res) {
  sys.puts('serv: recv');
  if (!qs.parse(url.parse(req.url).query).since) {
    res.simpleJSON(400, { error: "Must supply since parameter" });
    return;
  }
  var id = qs.parse(url.parse(req.url).query).nick;
  var room_name = qs.parse(url.parse(req.url).query).room;
  var room = rooms[room_name];
  var session;

  if (!room) {
    res.simpleJSON(400, { error: "The server has been rebooted. Please refresh your browser." });
    return;
  }

  if (id && room.sessions[id]) {
    session = room.sessions[id];
    session.poke();
  }

  var since = parseInt(qs.parse(url.parse(req.url).query).since, 10);

  sys.puts(room_name);

  room.channel.query(since, function (messages) {
    if (session) session.poke();
    res.simpleJSON(200, { messages: messages, rss: mem.rss });
  });
});

fu.get("/nick", function (req, res) {
  sys.puts('serv: nick');
  var old_nick = qs.parse(url.parse(req.url).query).nick;
  var new_nick = qs.parse(url.parse(req.url).query).new_nick;
  var room_name = qs.parse(url.parse(req.url).query).room;
  var room = rooms[room_name];

  if (!room) {
    res.simpleJSON(400, { error: "The server has been rebooted. Please refresh your browser." });
    return;
  }

  sys.puts('old name: '+old_nick);
  sys.puts('new name: '+new_nick);
  
  if (new_nick.length > 50 || /[^\w_\-, ^!]/.exec(new_nick)) {
    res.simpleJSON(400, { error: "Invalid nickname" });
    return;
  }

  var session = room.sessions[old_nick];
  if (!session || !new_nick) {
    res.simpleJSON(400, { error: "No such session id" });
    return;
  }

  if ( room.sessions[new_nick] ) {
    res.simpleJSON(400, { error: "Nickname already exists" });
    return;
  }

  session.nick = new_nick;

  delete room.sessions[old_nick];
  room.sessions[new_nick] = session;

  session.poke();

  room.channel.appendMessage(old_nick, "nick", new_nick);
  res.simpleJSON(200, { rss: mem.rss });
});

fu.get("/send", function (req, res) {
  sys.puts('serv: send');
  var id = qs.parse(url.parse(req.url).query).nick;
  var room_name = qs.parse(url.parse(req.url).query).room;
  var text = qs.parse(url.parse(req.url).query).text;
  var room = rooms[room_name];

  if (!room) {
    res.simpleJSON(400, { error: "The server has been rebooted. Please refresh your browser." });
    return;
  }

  sys.puts(id);

  var session = room.sessions[id];
  if (!session || !text) {
    res.simpleJSON(400, { error: "No such session id" });
    return;
  }

  session.poke();

  room.channel.appendMessage(session.nick, "msg", text);
  res.simpleJSON(200, { rss: mem.rss });
});

