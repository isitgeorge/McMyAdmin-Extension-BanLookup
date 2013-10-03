function banlookup_init() {
	$('#banlookup_tabarea').append('<style>#banlookup_table td,th{padding:5px 2px}#banlookup_table{max-width:1000px;width:100%}#banlookup_table td,th{border-bottom:solid 1px rgba(0,0,0,0.5);}</style>' +
	'<span style="display:block">' + banlookup_config.message + '</span>' +
	'<form onsubmit="banlookup_fetch(); return false;"><input type="text" id="banlookup_player" placeholder="Player" /><input type="submit" value="Retrieve bans" /></form>' +
	'<span id="banlookup_errors" style="display:block; padding-top:10px"></span>' +
	'<div id="banlookup_loadspin" style="border-radius:3px; margin-top:5px; padding:2px; display:none; background:#fff;"><img style="display:block;" src="/Images/loadspin.gif"/></div>');
}


function banlookup_fetch() {

// Preset Errors

error_tooQuick = 'You may not retrieve bans that quickly. Retry in a few moments.';
error_blankUsername = 'Please enter a Minecraft username first.';
error_ServiceUnavailable = 'Service seems to be unavailable, try again in a few minutes.';
error_existPremium = 'That account doesn\'t exist or isn\'t premium.';

$('#banlookup_errors').html('');

	if (typeof elapsedTime == 'undefined') {
		elapsedTime = 'true';
		if(typeof elapsedTimeCheck != 'undefined'){
			clearTimeout(elapsedTimeCheck);
		}
	
	elapsedTimeCheck = setTimeout(function() { elapsedTime = undefined; }, 3000);
	banlookup_continue();
} else {
	$('#banlookup_errors').hide().html(error_tooQuick).fadeIn();
	return;
	}
}

function banlookup_continue() {
	retrieveTimeS = new Date().getTime();

	if ($('#banlookup_table').length > 0){
		table.innerHTML = '';
	} else {
		table = document.createElement('table');
		table.setAttribute('id', 'banlookup_table');
		table.setAttribute('cellSpacing', '0');
		table.setAttribute('cellPadding', '0');
		$('#banlookup_tabarea').append(table);
	}

	playerName = $('#banlookup_player').val();

	if (playerName === '') {
		$('#banlookup_errors').hide().html(error_blankUsername).fadeIn();
		return;
	}

	playerName = playerName.replace(/[^a-zA-Z0-9-_]+/g, '');
	retrieveState = '';
	$('#banlookup_loadspin').fadeIn().css('display', 'inline-block');

function banlookup_servicecheck() {
	if (retrieveState === '') {	
		$('#banlookup_errors').hide().html(error_ServiceUnavailable).fadeIn();
		$('#banlookup_loadspin').hide(); 
	} else { 
		return;
	}
}
	
if(typeof servicecheck != 'undefined'){
	clearTimeout(servicecheck);
}
	
servicecheck = setTimeout(banlookup_servicecheck, 5000);

$.getJSON('http://api.fishbans.com/bans/' + playerName + '?jsonp&callback=?', function(data) {
	retrieveState = 'success';
	$('#banlookup_loadspin').hide();
	if (data.success === false) {
		$('#banlookup_errors').hide().html(error_existPremium).fadeIn();
	} else {

		if (banlookup_config.showavatar === 'true') {
			avatarsrc = 'http://i.fishbans.com/helm/' + playerName + '/50/';
		} else {
			avatarsrc = '';
		}
	
//Ban Services
mcbouncer = data.bans.service.mcbouncer.ban_info;
mcbouncer_total = data.bans.service.mcbouncer.bans;

mcbans = data.bans.service.mcbans.ban_info;
mcbans_total = data.bans.service.mcbans.bans;

mcblockit = data.bans.service.mcblockit.ban_info;
mcblockit_total = data.bans.service.mcblockit.bans;

minebans = data.bans.service.minebans.ban_info;
minebans_total = data.bans.service.minebans.bans;

glizer = data.bans.service.glizer.ban_info;
glizer_total = data.bans.service.glizer.bans;

trtd = '<tr><td>';
tdtd = '</td><td>';
tdtr = '</td></tr>';
trth = '<tr><th>';
thth = '</th><th>';
thtr = '</th></tr>';

banString = '';

banString += trth + 'Total bans: ' + parseInt(mcbouncer_total+mcbans_total+mcblockit_total+minebans_total+glizer_total) + thth + '<span style="vertical-align:middle; display:inline-block; width:50%">' + playerName + '</span>' + '<span style="width:50%; display:inline-block; text-align:right;"><img style="vertical-align:middle; width:50px; height:50px" title="Avatars are case sensitive" src="' + avatarsrc + '" /></span>' + thtr;

//mcbouncer
	$(function() {
		if (jQuery.isEmptyObject(mcbouncer)) {
			return;
		} else {
			banString += trth + 'Server via MCBouncer' + thth + 'Reason' + thtr;
			$.each(mcbouncer, function (k,v) {
				banString += trtd + k + tdtd + v + tdtr;
			});
		banString += trth + '&nbsp;' + thth + '&nbsp;' + thtr;
		}
	});

//mcbans
	$(function() {   
		if (jQuery.isEmptyObject(mcbans)) {
			return;
		} else {
			banString += trth + 'Server via McBans' + thth + 'Reason' + thtr;
			$.each(mcbans, function (k,v) {
				banString += trtd + k + tdtd + v + tdtr;
			});
		banString += trth + '&nbsp;' + thth + '&nbsp;' + thtr;
		}
	});
	
//mcblockit
	$(function() {   
		if (jQuery.isEmptyObject(mcblockit)) {
			return;
		} else {
			banString += trth + 'Server via McBlockIt' + thth + 'Reason' + thtr;
			$.each(mcblockit, function (k,v) {
				banString += trtd + k + tdtd + v + tdtr;
			});
		banString += trth + '&nbsp;' + thth + '&nbsp;' + thtr;
		}
	});
	
//minebans
	$(function() {   
		if (jQuery.isEmptyObject(minebans)) {
			return;
		} else {
			banString += trth + 'Server via MineBans' + thth + 'Reason' + thtr;
			$.each(minebans, function (k,v) {
				banString += trtd + k + tdtd + v + tdtr;
			});
			banString += trth + '&nbsp;' + thth + '&nbsp;' + thtr;
		}
	});
	
//glizer
	$(function() {  
		if (jQuery.isEmptyObject(glizer)) {
			return;
		} else {
			banString += trth + 'Server via Glizer' + thth + 'Reason' + thtr;
			$.each(glizer, function (k,v) {
				banString += trtd + k + tdtd + v + tdtr;
			});
			banString += trth + '&nbsp;' + thth + '&nbsp;' + thtr;
		}
	});
	
	retrieveTimeT = new Date().getTime() - retrieveTimeS;
	retrieveTimeT = retrieveTimeT / 1000;	
	banString += '<tr><td style="font-size:11px; text-align:right;">' + 'Retrieved in ' + retrieveTimeT + ' seconds' + '</td><td style="font-size:11px; text-align:right;">' + 'Data provided by Fishbans' + tdtr;
	$('#banlookup_table').hide().append(banString).fadeIn();
	}
});
};