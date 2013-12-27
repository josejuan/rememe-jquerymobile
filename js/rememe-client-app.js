var rmmUrlSrv = "http://shared.computer-mind.com:8181/";
var rmmCnx = null;

var tptTaskList = null;

function MsgClose() {
  $('#pmsg').dialog('close');
}

function Msg(title, text, onclose) {

  var p = $('#pmsg');
  
  p.find('h2').text(title);
  p.find('p').text(text);
  $.mobile.changePage(p);
  
  var a = p.find('a');
  var c = onclose;
  a.unbind('click').click(function () {
    if(!!c) c();
    else    MsgClose();
  });

  p.find('input').closest('div').css({visibility: 'hidden'});
  
}

function toLogin() { $.mobile.changePage('#plogin') }

function onPList() {
  if(rmmCnx === null)
    toLogin();
  else
    rmmCnx.listNotes({},
      function (r) {
        $('#plistnotes').html(Template(tptTaskList, r));
      },
      function (xhr, msg) {
        Msg('Error!', 'A error has occurred requesting note list. ' + msg, function () { toLogin() });
      });
}

$(function () {

  $.get('templates/task-list.html', function (r) { tptTaskList = r });

  $.mobile.pageContainer.on("pagechange", function(event, data) {
    switch(data.toPage.attr('id')) {
    case 'plist': onPList(); break;
    }
  });

  $('#ploginenter').click(function () {
    rmmCnx = new RememeClient(rmmUrlSrv, $('#ploginusr').val(), $('#ploginpwd').val(), true);
    rmmCnx.getUserInfo({},
      function (r) {
        Msg('Wellcome to Rememe!', 'Wellcome to Rememe ' + r.name + '!', function () { $.mobile.changePage('#plist') });
      },
      function (xhr, msg) {
        rmmCnx = null;
        Msg('Error authenticating!', msg);
      });
  });
  
  $('#ploginnew').click(function () {
    var cnx = new RememeClient(rmmUrlSrv, $('#ploginusr').val(), $('#ploginpwd').val(), true);
    cnx.requestNewUserAccount({},
      function (r) {
        Msg('Account created!', 'Your new account has been created. Please check your e-mail address, copy the validation code (like 00000000-0000-0000-0000-000000000000), paste into `validation code` field and press `Validate account` button.');
      },
      function (xhr, msg) {
        Msg('Error!', 'A error has occurred requesting your new account. ' + msg);
      });
  });
  
  $('#ploginvalidate').click(function () {
    rmmCnx = new RememeClient(rmmUrlSrv, $('#ploginusr').val(), $('#ploginpwd').val(), true);
    rmmCnx.validateUserAccount($('#ploginvcode').val(),
      function (r) {
        Msg(
          'Account validates!',
          'Your new account has been validated and now it´s active. You can set your user preferences. Enjoy!',
          function () { $.mobile.changePage('#puserprefs') } );
      },
      function (xhr, msg) {
        Msg('Error!', 'A error has occurred requesting your new account. ' + msg);
      });
  });
  
});
