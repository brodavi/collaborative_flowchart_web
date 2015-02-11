
var $ = require('browserify-zepto');
var io = require('socket.io-client');
var config = require('./config').config;
var socket = io(config.apiServer);

var g = document.getElementById('graph');
var graphtext = document.getElementById('graphtext');
var gContainer = document.getElementById('graph-container');
var savebutton = document.getElementById('savebutton');
var renderbutton = document.getElementById("renderbutton");

var tempId = 0;

function emitChange() {
  socket.emit('graph', graphtext.value);
}

savebutton.addEventListener('click', emitChange);

socket.on('new id', function (data) { $('#tempId' + data.tempId).attr('id', 'id' + data.id); });  

socket.on('graph', function (data) { 
  graphtext.value = data;
  renderGraph(data);
});

socket.on('usercount', function(userCount) { $('#users').html(userCount + ' user' + ((userCount > 1) ? 's ':' ') + 'right now'); });

window.addEventListener('unload', function (e) {
    socket.emit('disconnect');
});

var graph;
function renderGraph (code) {
    if (graph) {
	graph.clean();
    }

    graph = flowchart.parse(code);
    graph.drawSVG('canvas', {
	// 'x': 30,
	// 'y': 50,
	'line-width': 3,
	'line-length': 50,
	'text-margin': 10,
	'font-size': 14,
	'font': 'normal',
	'font-family': 'Helvetica',
	'font-weight': 'normal',
	'font-color': 'black',
	'line-color': 'black',
	'element-color': 'black',
	'fill': 'white',
	'yes-text': 'yes',
	'no-text': 'no',
	'arrow-end': 'block',
	'symbols': {
            'start': {
		'font-color': 'red',
		'element-color': 'green',
		'fill': 'yellow'
            },
            'end':{
		'class': 'end-element'
            }
	},
	'flowstate' : {
            'past' : { 'fill' : '#CCCCCC', 'font-size' : 12},
            'current' : {'fill' : 'yellow', 'font-color' : 'red', 'font-weight' : 'bold'},
            'future' : { 'fill' : '#FFFF99'},
            'request' : { 'fill' : 'blue'},
            'invalid': {'fill' : '#444444'},
            'approved' : { 'fill' : '#58C4A3', 'font-size' : 12, 'yes-text' : 'APPROVED', 'no-text' : 'n/a' },
            'rejected' : { 'fill' : '#C45879', 'font-size' : 12, 'yes-text' : 'n/a', 'no-text' : 'REJECTED' }
	}
    });

    // possible use as extended info or something
    $('[id^=sub1]').click(function(){
	alert('info here');
    });
};
