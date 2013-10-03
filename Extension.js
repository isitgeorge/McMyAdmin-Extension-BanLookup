Extensions.BanLookup = {};
Extensions.BanLookup.CreateTab = true;
Extensions.BanLookup.Name = "BanLookup Extension";
Extensions.BanLookup.Author = "isitgeorge.com";
Extensions.BanLookup.TabTitle = "Ban Lookup";

Extensions.BanLookup.Init = function () {
	$('head').append('<script type="text/javascript" src="Extensions/BanLookup/Config.js"></script>');
	$('head').append('<script type="text/javascript" src="Extensions/BanLookup/Magic.js"></script>');
	
	$(document).ready(function() {
		setTimeout(banlookup_init, 1500); //IE fix
	});
};