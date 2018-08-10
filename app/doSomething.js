const {
	ipcRenderer
} = require('electron');
const $ = require('jquery');
const _ = require('lodash');

// onRendered
$(function () {
	$.getJSON('setting.json', function (data) {
		if (!_.isEmpty(data)) {
			_.each(data, function (key) {
				$('#loadsetting').append(key)
			})
		}
	})
});

$('#setting').on('click', function () {
	var data = {
		action: 'setting',
		setting: {
			platformPath: document.getElementById('platformPath').files[0].path || '',
			projectPath: document.getElementById('projectPath').files[0].path || ''
		}
	}
	ipcRenderer.send('request-mainprocess-action', data);
});


$('#getEntities').on('click', function () {
	$("#entities").find('li').remove();
	var data = {
		action: 'getEntities',
	}

	ipcRenderer.on('mainprocess-response', (event, arg) => {
		$('#entities').append('<li><input type="checkbox" value="' + arg + '"/>' + arg + '</li>')
	});

	ipcRenderer.send('request-mainprocess-action', data);
})