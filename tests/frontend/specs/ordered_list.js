describe("assign ordered list", function(){
  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb);
    this.timeout(60000);
  });

  it("inserts ordered list text", function(done){
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    var $insertorderedlistButton = chrome$(".buttonicon-insertorderedlist");
    $insertorderedlistButton.click();

    helper.waitFor(function(){
      return inner$("div").first().find("ol li").length === 1;
    }).done(done);
  });

  context('when user presses Ctrl+Shift+N', function() {
    context('and pad shortcut is enabled', function() {
      beforeEach(function() {
        makeSureShortcutIsEnabled('cmdShiftN');
        triggerCtrlShiftShortcut('N');
      });

      it('inserts unordered list', function(done) {
        helper.waitFor(function() {
          return helper.padInner$('div').first().find('ol li').length === 1;
        }).done(done);
      });
    });

    context('and pad shortcut is disabled', function() {
      beforeEach(function() {
        makeSureShortcutIsDisabled('cmdShiftN');
        triggerCtrlShiftShortcut('N');
      });

      it('does not insert unordered list', function(done) {
        helper.waitFor(function() {
          return helper.padInner$('div').first().find('ol li').length === 1;
        }).done(function() {
          expect().fail(function() { return 'Unordered list inserted, should ignore shortcut' });
        }).fail(function() {
          done();
        });
      });
    });
  });

  context('when user presses Ctrl+Shift+1', function() {
    context('and pad shortcut is enabled', function() {
      beforeEach(function() {
        makeSureShortcutIsEnabled('cmdShift1');
        triggerCtrlShiftShortcut('1');
      });

      it('inserts unordered list', function(done) {
        helper.waitFor(function() {
          return helper.padInner$('div').first().find('ol li').length === 1;
        }).done(done);
      });
    });

    context('and pad shortcut is disabled', function() {
      beforeEach(function() {
        makeSureShortcutIsDisabled('cmdShift1');
        triggerCtrlShiftShortcut('1');
      });

      it('does not insert unordered list', function(done) {
        helper.waitFor(function() {
          return helper.padInner$('div').first().find('ol li').length === 1;
        }).done(function() {
          expect().fail(function() { return 'Unordered list inserted, should ignore shortcut' });
        }).fail(function() {
          done();
        });
      });
    });
  });

  xit("issue #1125 keeps the numbered list on enter for the new line - EMULATES PASTING INTO A PAD", function(done){
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    var $insertorderedlistButton = chrome$(".buttonicon-insertorderedlist");
    $insertorderedlistButton.click();

    //type a bit, make a line break and type again
    var $firstTextElement = inner$("div span").first();
    $firstTextElement.sendkeys('line 1');
    $firstTextElement.sendkeys('{enter}');
    $firstTextElement.sendkeys('line 2');
    $firstTextElement.sendkeys('{enter}');

    helper.waitFor(function(){
      return inner$("div span").first().text().indexOf("line 2") === -1;
    }).done(function(){
      var $newSecondLine = inner$("div").first().next();
      var hasOLElement = $newSecondLine.find("ol li").length === 1;
      expect(hasOLElement).to.be(true);
      expect($newSecondLine.text()).to.be("line 2");
      var hasLineNumber = $newSecondLine.find("ol").attr("start") === 2;
      expect(hasLineNumber).to.be(true); // This doesn't work because pasting in content doesn't work
      done();
    });
  });

  var triggerCtrlShiftShortcut = function(shortcutChar) {
    var inner$ = helper.padInner$;
    var e = inner$.Event(helper.evtType);
    e.ctrlKey = true;
    e.shiftKey = true;
    e.which = shortcutChar.toString().charCodeAt(0);
    inner$("#innerdocbody").trigger(e);
  }

  var makeSureShortcutIsDisabled = function(shortcut) {
    helper.padChrome$.window.clientVars.padShortcutEnabled[shortcut] = false;
  }
  var makeSureShortcutIsEnabled = function(shortcut) {
    helper.padChrome$.window.clientVars.padShortcutEnabled[shortcut] = true;
  }

});

describe("Pressing Tab in an OL increases and decreases indentation", function(){
  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb);
    this.timeout(60000);
  });

  it("indent and de-indent list item with keypress", function(done){
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    //get the first text element out of the inner iframe
    var $firstTextElement = inner$("div").first();

    //select this text element
    $firstTextElement.sendkeys('{selectall}');

    var $insertorderedlistButton = chrome$(".buttonicon-insertorderedlist");
    $insertorderedlistButton.click();

    var e = inner$.Event(helper.evtType);
    e.keyCode = 9; // tab
    inner$("#innerdocbody").trigger(e);

    expect(inner$("div").first().find(".list-number2").length === 1).to.be(true);
    e.shiftKey = true; // shift
    e.keyCode = 9; // tab
    inner$("#innerdocbody").trigger(e);

    helper.waitFor(function(){
      return inner$("div").first().find(".list-number1").length === 1;
    }).done(done);

  });


});


describe("Pressing indent/outdent button in an OL increases and decreases indentation and bullet / ol formatting", function(){
  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb);
    this.timeout(60000);
  });

  it("indent and de-indent list item with indent button", function(done){
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    //get the first text element out of the inner iframe
    var $firstTextElement = inner$("div").first();

    //select this text element
    $firstTextElement.sendkeys('{selectall}');

    var $insertorderedlistButton = chrome$(".buttonicon-insertorderedlist");
    $insertorderedlistButton.click();

    var $indentButton = chrome$(".buttonicon-indent");
    $indentButton.click(); // make it indented twice

    expect(inner$("div").first().find(".list-number2").length === 1).to.be(true);

    var $outdentButton = chrome$(".buttonicon-outdent");
    $outdentButton.click(); // make it deindented to 1

    helper.waitFor(function(){
      return inner$("div").first().find(".list-number1").length === 1;
    }).done(done);

  });


});
