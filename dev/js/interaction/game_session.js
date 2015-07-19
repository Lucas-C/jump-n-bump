var env = {
    JNB_MAX_PLAYERS: 4,
    MAX_OBJECTS: 200,
    animation_data: new Animation_Data(),
    level: {}
};

var player = [];

function Game_Session(level) {
    "use strict";

    function gup(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null)
            return "";
        else
            return results[1];
    }

    var canvas = document.getElementById('screen');
    var img = {};
    img.rabbits = document.getElementById('rabbits');
    img.objects = document.getElementById('objects');
    img.numbers = document.getElementById('numbers');
    
    var settings = {
        pogostick: gup('pogostick') == '1',
        jetpack: gup('jetpack') == '1',
        bunnies_in_space: gup('space') == '1',
        flies_enabled: false,
        blood_is_thicker_than_water: false,
        no_gore: false
    };
    var muted = gup('nosound') == '1';

    this.sound_player = new Sound_Player(muted);
    var sfx = new Sfx(this.sound_player);
    var renderer = new Renderer(canvas, img, level);
    var objects = new Objects();
    var movement = new Movement(renderer, img, sfx, objects, settings);
    var keyboard = new Keyboard(this.sound_player);
    var ai = new AI(keyboard);
    var animation = new Animation(renderer, img, objects);
    var game = new Game(movement, ai, animation, renderer, objects, keyboard.key_pressed, level, true);
    document.onkeydown = keyboard.onKeyDown;
    document.onkeyup = keyboard.onKeyUp;

    this.pause = function () {
        this.sound_player.set_muted(true);
        game.pause();
    }
    this.unpause= function () {
        this.sound_player.set_muted(muted);
        game.start();
    }
    this.start = function () {
        sfx.music();
        this.unpause();
    }


    this.scores = function () {
        return player.map(function (p) { return p.bumped; });
    }
    
}

function rnd(max_value) {
    return Math.floor(Math.random() * max_value);
}