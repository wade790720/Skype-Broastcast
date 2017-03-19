var SkypeAPI = (function(s,$,w){
  "use strict";
  
  if(location.href.match(/busy/)){ location.href=location.href.replace('/busy',''); }
  
  var developMode = false;
  var timeGap = (developMode) ? 500 : 3000;
  var timePreload = (developMode) ? 3000 : 9000;
  var limitTimeGap = (developMode) ? 25000 : 45000;
  var sendedTimeGap = (developMode) ? 1 : 500;
  var self = s;
  var $self = self.$ = $(self);
  var LOG = (developMode) ? console.log : function(){};
  var selector =(()=>{
  function selector($){
    var s = {
      //skype主體
      main : "#shellMainStage .main",
      //左邊主內容 (通訊錄)
      leftContent : "#timelineComponent",
      //右邊主內容 (聊天)
      rightContent : "#chatComponent",
      //讀取畫面
      loading : "#shellSplashScreen",
      //new send
      chatService : "#rvSkypeChatService"
    },
    l={
      //搜尋input
      inputSearch : "#searchInputText",
      //搜尋結果
      divSearchResult : "swx-search-results",
      //搜尋結果 People
      divSearchResultPeople : "swx-people-search",
      //搜尋結果 Group
      divSearchResultGroup : "swx-group-search",
      //搜尋結果 單位
      itemSearch : "swx-group-search swx-recent-item",
      //最近聊天
      divRecentsList : "swx-recents",
      //最近聊天 單位
      itemRecent : "swx-recents swx-recent-item",
      //最近聊天 Scroll
      scrollRecent : "swx-recents .scrollViewport"
    },
    r={
      //對話框集合
      chatFragmentsContainer : ".fragmentsContainer",
      //對話框
      itemFragment : ".fragmentsContainer .fragment",
      //對話框log
      itemFragmentLog : ".fragmentsContainer .fragment swx-chat-log"
    },t={};
    function init(){
      for(var i in s){
        t[i] = $(s[i]);
      }
      for(var i in l){
        t[i] = t.leftContent.find(l[i]);
      }
      for(var i in r){
        t[i] = t.rightContent.find(r[i]);
      }
      $.fn.refresh = function() {
        var elems = $(this.selector);
        this.splice(0, this.length);
        this.push.apply( this, elems );
        return this;
      };
    }
    var ge = this.$getEle = function(e){
      var ele = t[e];
      if(ele){
        return ele.refresh();
      }else{
        return [];
      }
    }
    var ga = this.$getAll = function(){
      for(var i in t){
        t[i].refresh();
      }
      return t;
    }
    init();
  }
  return new selector($);
  })($);

  var event = {
    ready : "ONREADY",
    loaded : "LOADED",
    open : "ONOPEN",
    loaderror : "Load_ERROR",
    msgend : "Message_END",
    msgstart : "Message_START",
    msgerror : "Message_ERROR",
    msgprocess : "Message_PROCESS",
    msgready : "Message_READY",
    change : new Event("change")
  }

  var doms = self.DOMs = selector.$getAll();
  var loadingDOM = doms.loading.clone();

  self.getSkypeSelector = function(){return selector;};
  self.getSkypeGroups = function(){
    var tmp = [];
    for(var i in groups){
      var loc = groups[i];
      tmp.push( { id:loc.kid, title:loc.ktitle, encode:loc.kkey } );
    }
    return tmp;
  };
  self.getSkypeFailGroups = function(){
    var tmp = [];
    for(var i in failGroups){
      var loc = failGroups[i];
      tmp.push( { title:loc.ftitle, word:loc.fword } );
    }
    return tmp;
  };

  var UserSession = self.UserSession = {};
  var CustomGroup = null;

  self.getCustomGroups = function(cgid){
    // readCustomGroup();
    var tmp = {};
    for(var c in CustomGroup){
      var loc = CustomGroup[c];
      if(loc.status==0){continue;}
      var gStatus = groupsIdWithEncodeGroup(loc.encodeGroups);
      tmp[loc.id] = {
        id : loc.id,
        name : loc.name,
        groups : gStatus.groupId,
        notFoundGroups : gStatus.notFound
      };
    }
    if(typeof cgid=="number"){
      return tmp[cgid];
    }else{
      return tmp;
    }
  }
  self.addCustomGroup = function(obj){
    var obj = $.extend({
      name : "",
      groups : []
    },obj,true);
    if(obj.id){throw "Error Can't Put Id In AddCustomGroup.";};
    return basicCustomGroup(obj);
  }
  self.updateCustomGroup = function(cgid,obj){
    if(!$.isNumeric(cgid)){throw "Error cgid On updateCustomGroup.";};
    obj.id = cgid;
    return basicCustomGroup(obj);
  }
  self.removeCustomGroup = function(cgid){
    CustomGroup[cgid].status = 0;
    CustomGroup[cgid].encodeGroups = [];
    saveCustomGroup();
    return true;
  }
  self.updateCustomGroupWithOldStorage = function(){
    
    var time_1 = new Date();
    readLocalStorageWithKey("CustomGroup_"+self.UserSession["skypeId"], function(data){
      // console.log(data);
      var cg = data || [];
      var newCustomGroup = [];
      
      for(var nc in cg){
        var loc = cg[nc];
        var newGroups = [];
        if(loc.status==1){
          for(var leg in loc.encodeGroups){
            var loc2 = loc.encodeGroups[leg];
            var newKey = oldGroupKeys[loc2];
            if(newKey){
              newGroups.push(newKey);
            }
          }
        }
        newCustomGroup.push({
          id : loc.id,
          name : loc.name,
          status : loc.status,
          encodeGroups : newGroups
        });
        
      }
      
      CustomGroup = newCustomGroup;
      saveLocalStorageWithKey("NewCustomGroup_"+self.UserSession["skypeId"], newCustomGroup, function(r){
        if(r){
          var time_2 = new Date();
          alert("OK. 費時 : " + (time_2-time_1) + " ms.");
          window.location.reload();
        }
      });
      
    });
    
  }
  
  self.clearUpCustomGroupListWithName = function(name){
    return console.log("暫時不開放");
    // var encode = encodeURIComponent(name);
    // var bl = false;
    // for(var id in CustomGroup){
      // var loc = CustomGroup[id];
      // for(var g in loc.encodeGroups){
        // var loc2 = loc.encodeGroups[g];
        // if(encode==loc2){
          // loc.encodeGroups.splice(g,1);
          // bl = true;
        // }
      // }
    // }
    // if(bl){saveCustomGroup();}
    // return bl;
  }
  self.clearReadyToSend = function(){
    msg.clearReadyToSend();
  }
  self.doReadyToSend = function(){
    msg.doSendReadyToSend();
  }
  
  

  function basicCustomGroup(obj){
    var isNew = typeof obj.id=="undefined";
    // console.log(obj);
    if(typeof obj.name=="string" && obj.name.length==0){console.error("Error No Name On CustomGroup.");return false;};
    if(obj.groups && !$.isArray(obj.groups)){console.error("Error Groups Is Not Array.");return false;};
    if(isNew){
      obj.id = CustomGroup.length;
      CustomGroup.push({
        id : obj.id,
        name : obj.name,
        status : 1,
        encodeGroups : encodeGroupsWithGroups(obj.groups||[])
      });
    }else{
      var cg = CustomGroup[obj.id];
      if(cg){
        if(obj.name){cg.name = obj.name;}
        if(obj.groups){cg.encodeGroups = encodeGroupsWithGroups(obj.groups);}
      }else{
        console.error("Error No Match Id In CustomGroup.");return false;
      }
    }
    // console.log(CustomGroup);
    saveCustomGroup();
    return self.getCustomGroups(obj.id);
  }
  function encodeGroupsWithGroups(g){
    var tmp = [];
    for(var i in g){
      var gid = g[i];
      var key = groupKeys[gid];
      if(!key){throw "Error Groups Id Is Not Found In GroupKeys.";};
      tmp.push(key);
    }
    return tmp;
  }
  function groupsIdWithEncodeGroup(eg){
    var tmp = {"groupId":[],"notFound":[]};
    for(var i in eg){
      var encode = eg[i];
      var groupit = groups[encode];
      if(groupit){
        tmp.groupId.push(groupit.kid);
      }else{
        // console.error("Not Found Group Encode :( "+encode+" ).");
        tmp.notFound.push(decodeURIComponent(encode));
      }
    }
    return tmp;
  }
  function readCustomGroup(){
    // readLocalStorageWithKey("CustomGroup_"+self.UserSession["skypeId"], function(data){
    readLocalStorageWithKey("NewCustomGroup_"+self.UserSession["skypeId"], function(data){
      // console.log(data);
      CustomGroup = data || [];
    });
  }
  function saveCustomGroup(){
    // saveLocalStorageWithKey("CustomGroup_"+self.UserSession["skypeId"], CustomGroup, function(r){console.log(r);});
    saveLocalStorageWithKey("NewCustomGroup_"+self.UserSession["skypeId"], CustomGroup, function(r){console.log(r);});
  }
  //web db
  var webDB = {};
  webDB.tableName = "rv_skype";
  webDB.tableLog = "rv_error_log";
  webDB.db = openDatabase('mydb', '1.0', 'rv_DB', 5 * 1024 * 1024);
  webDB.onError = function(tx,e){
    console.error(e.message);
  }
  webDB.onSuccess = function(tx,r){
    LOG(r);
  }
  webDB.init = function(){
    var db = webDB.db;
    db.transaction(function(tx){
      tx.executeSql("create table if not exists "+webDB.tableName+" (rvid INTEGER PRIMARY KEY ASC, name TEXT, data TEXT, timestamp DATETIME)");
      tx.executeSql("create table if not exists "+webDB.tableLog+" (id INTEGER PRIMARY KEY ASC, name TEXT, data TEXT, timestamp DATETIME)");
    });
  }
  webDB.save = function(name,data,cb){
    var db = webDB.db;
    var timestamp = new Date();
    var insertStr = JSON.stringify(data);
    
    if(cb===false){
      update();
    }else{
      insert();
    }
    
    function update(){
      db.transaction(function(tx){
        var prepareSQL = "update "+webDB.tableName+" set data = '"+insertStr+"' where name = '" + name + "'";
        LOG("prepareSQL = " + prepareSQL);
        tx.executeSql(prepareSQL,[],
        function(tx,r){
          // LOG(r.rowsAffected);
          if(r.rowsAffected==0){insert();}
        },
        webDB.onError
        );
      });
    }
    
    function insert(){
      db.transaction(function(tx){
        var prepareSQL = "insert into "+webDB.tableName+" (name, data, timestamp) values (?,?,?)";
        LOG("prepareSQL = " + prepareSQL);
        tx.executeSql(prepareSQL,[name, insertStr, timestamp],
        function(tx,r){
          clear();
        },
        webDB.onError
        );
      });
    }
    
    function clear(){
      db.transaction(function(tx){
        var prepareSQL = "delete from "+webDB.tableName+" where rvid not in (select rvid from "+webDB.tableName+" where name='"+name+"' order by rvid DESC limit 2) and name='"+name+"'";
        LOG(prepareSQL);
        tx.executeSql(prepareSQL,[],
        function(tx,r){
          if(typeof cb=="function"){cb(true);}
        },
        function(tx,e){
          if(typeof cb=="function"){cb(false,e.message);}
        }
        );
      });
    }
  }
  webDB.read = function(name,cb){
    var db = webDB.db;
    db.transaction(function(tx){
      var prepareSQL = "select max(rvid),data from (select * from "+webDB.tableName+" where name = \'"+name+"\')";
      LOG("prepareSQL = " + prepareSQL);
      tx.executeSql(prepareSQL,[],
      function(tx,r){
        var loc = r.rows[0];
        var idc = "[]";
        // console.log(loc);
        if(loc.data){
          idc = loc.data;
        }
        // 
        if(typeof cb=="function"){cb(JSON.parse(idc));}
      },
      webDB.onError
      );
    });
  }
  webDB.errorLog = function(str){
    var name = "exception";
    var insertStr = str;
    var timestamp = new Date();
    var db = webDB.db;
    db.transaction(function(tx){
      var prepareSQL = "insert into "+webDB.tableLog+" (name, data, timestamp) values (?,?,?)";
      LOG("prepareSQL = " + prepareSQL);
      tx.executeSql(prepareSQL,[name, insertStr, timestamp],webDB.onSuccess,webDB.onError);
    });
  }
  webDB.init();
  //
  
  
  function readLocalStorageWithKey(lskey,callback){
    
    lskey = lskey.replace(/[\:\'\"\=\!\@\#\$\%\^|&\*\)\)\.]+/g,"_");
    // var skypeIdc = "[]";
    webDB.read(lskey,callback);
    
    // var skypeIdc = localStorage.getItem(lskey) || "[]";
    
    return true;
    // return JSON.parse(skypeIdc);
  }
  function saveLocalStorageWithKey(lskey,json,callback){
    
    try{
      lskey = lskey.replace(/[\:\'\"\=\!\@\#\$\%\^|&\*\)\)\.]+/g,"_");
      
      webDB.save(lskey,json,callback);
      
      //localStorage.setItem(lskey,JSON.stringify(json));
    }catch(e){
      webDB.save("error save",e,callback);
      return false;
    }
    return true;
  }
  function insertErrorLog(str){
    webDB.errorLog(str);
  }

  self.sendMessage = function(obj){
    if(!msg){throw "Waiting For SkypeAPI Prepare Complete.";};
    var obj = $.extend({
      id : null,
      text : ""
    },obj,true);
    LOG(obj);
    
    if(!(typeof obj.text=="string" && obj.text.length>0)){throw "Error On Send Message No Text.";}
    $self.trigger(event.msgstart);
    if($.isArray(obj.id)){
      msg.sendMessageWith_IDARRAY_TEXT(obj.id, obj.text);
    }else{
      var id = parseInt(obj.id);
      if(!$.isNumeric(id)){throw "Error On Send Message Id.";}
      msg.sendMessageWith_ID_TEXT(id, obj.text);
    }

  }

  var msg;

  function messageController($$,d,gs,gks){
    var scheme = [],
      self = this,
      readyToSend = [],
      lastText = "",
      dataCount = 0,
      // readyToSend = readLocalStorageWithKey("mcr.readyToSend:"+$$[0].UserSession["skypeId"]),
      // lastText = readLocalStorageWithKey("mcr.lastText:"+$$[0].UserSession["skypeId"]),
      rts,now,timer;
      
    readLocalStorageWithKey("mcr.readyToSend:"+$$[0].UserSession["skypeId"],function(data){readyToSend=data;preload();});
    readLocalStorageWithKey("mcr.lastText:"+$$[0].UserSession["skypeId"],function(data){lastText=data;preload();});
    
    function preload(){
      dataCount++;
      if(dataCount >= 2){
        init();
      }
    }
    
    var groups = gs;
    var groupKeys = gks;
    var changeEvent = new Event('change');
    var limit = 3;
    var time_1,time_2;
    var waitingCallBack = false;
    var timeGapPlus = 0;

    function init(){
      
      setting();
      
      if(readyToSend.length > 0){
        var evt_notSend = [];
        for(var e in readyToSend){
          var gkey = readyToSend[e];
          var gk = groups[gkey];
          evt_notSend.push({id:gk.kid, title:gk.ktitle});
        }
        $$.trigger(event.msgready,[evt_notSend]);
        // prepareLoop();
      }else{
        $$.trigger(event.msgready,[[]]);
      }
      
      d.chatService[0].addEventListener("onNewMessage",waitingCallBackFn,false);
      d.chatService[0].addEventListener("onNewMessage-fail",function(e){
        console.log("onNewMessage-fail");
        // console.log(e);
        var res = JSON.parse(e.detail);
        console.log(res);
        insertErrorLog(res.message);
        var doing = window.alert("Skype Gateway Server 拒絕連線. [ "+res.message+" ]");
        
      },false);
      
    }
    
    function setting(){
      
      self.sendMessageWith_ID_TEXT = function(id,text){
        var gkey = groupKeys[id];
        if(!gkey){throw "ERROR Send Message Because Id Not Found.";}
        scheme.push( {ele:groups[gkey], txt:text} );
        readyToSend.push(gkey);
        lastText = [text];
        saveLocalStorageWithKey("mcr.lastText:"+$$[0].UserSession["skypeId"],lastText);
        prepareLoop();
      }
      self.sendMessageWith_IDARRAY_TEXT = function(ids,text){
        for(var i in ids){
          var gkey = groupKeys[ids[i]];
          if(!gkey){throw "ERROR Send Message Because Id Array.";}
          scheme.push( {ele:groups[gkey], txt:text} );
          readyToSend.push(gkey);
        }
        lastText = [text];
        saveLocalStorageWithKey("mcr.lastText:"+$$[0].UserSession["skypeId"],lastText);
        prepareLoop();
      }
      self.clearReadyToSend = function(){
        if(timer)clearInterval(timer);
        readyToSend = [];
        saveLocalStorageWithKey("mcr.readyToSend:"+$$[0].UserSession["skypeId"],readyToSend,false);
      }
      self.doSendReadyToSend = function(){
        for(var g in readyToSend){
          var gkey = readyToSend[g];
          scheme.push( {ele:groups[gkey], txt:lastText[0]} );
        }
        prepareLoop();
      }
      
    }
    
    
    function prepareLoop(){
      
      time_1 = new Date();
      // console.log(now);
      timeGapPlus = 0;
      onLoop();
      
    }
    
    var deveScheme = [];
    
    function onLoop(){
      // 
      if(developMode){
        now = deveScheme.splice(0,1)[0];
      }else{
        now = scheme.splice(0,1)[0];
      }
      
      if(now){
        
        timeGapPlus++;
        
        try{
          
          if(doSendMessage()){
            
            if(timer)clearTimeout(timer);
            timer = setTimeout(onLoop, limitTimeGap);
            
            $$.trigger(event.msgprocess,[now.ele.ktitle,scheme.length]);
            
          }
        }catch(e){
          $$.trigger(event.msgerror,[e,scheme]);
        }
        
      }else{
        d.chatService.attr("conversationid",null);
        d.chatService.find("button")[0].click();
        if(developMode){ deveScheme = [...scheme];onLoop(); }
        
        
        $$.trigger(event.msgend);
      }
      
    }
    
    
    function waitingCallBackFn(){
      if(waitingCallBack){
        waitingCallBack = false;
        if(timer)clearTimeout(timer);
        
        var pendingTime = (timeGapPlus*5)+sendedTimeGap;
        // console.log("pendingTime =" + pendingTime);
        timer = setTimeout(onLoop, pendingTime);timer=null;
        console.log("Success Sended With Callback.");
        // d.chatService.attr("conversationid",now.ele.conversationid);
      }
    }
    

    function doSendMessage(txt){
      var chatService = d.chatService;
      // var topicTitle = f.find("span[data-swx-testid=conversationTopic]").html();
      // console.log(now.ele.ktitle);
      // console.log(topicTitle);
      
      time_2 = new Date();
      console.log(time_2 - time_1);
      
      if(time_2-time_1 > (limitTimeGap) || chatService.length==0){
        //JavaScript 快掛了 & chatService壞了
        if(timer)clearInterval(timer);
        saveLocalStorageWithKey("mcr.readyToSend:"+$$[0].UserSession["skypeId"],readyToSend,false);
        var reason = "other";
        if(time_2-time_1 > (limitTimeGap)){reason="Time Out.";}
        if(chatService.length==0){reason="ChatService Wrong.";}
        
        insertErrorLog(reason);
        
        alert("javascript 過載 或者 Skype gateway 無回應, 請關閉分頁重新開啟.");
        $("body").empty().text("尚有 : " + readyToSend.length + " 個訊息未送出, 請關閉此分頁並重新開啓.");
        
        return false;
        // console.log("STOP,javascript 過載 請重新開啟.");
      }
      time_1 = new Date();
      
      // console.log(new Date());
      // console.log("所剩未發的數量 = " + scheme.length);
      // console.log(f);
      // if(f.length==0 || now.ele.ktitle!=topicTitle){
        // return false;
      // }
      // console.log(f);
      d.chatService.attr("conversationid",now.ele.conversationid);
      if(developMode){
        d.chatService.find("textarea").val(now.txt + " ; " + new Date().toISOString());
      }else{
        d.chatService.find("textarea").val(now.txt);
      }
      d.chatService.find("button")[0].click();
      waitingCallBack = true;
      
      // console.log(d.chatService);
      
      rts = readyToSend.splice(0,1);
      saveLocalStorageWithKey("mcr.readyToSend:"+$$[0].UserSession["skypeId"],readyToSend,false);
      
      // d.itemFragment.find("swx-message").remove();
      return true;
    }
    return this;
  };


  var timer = 0;

  function prepare(){
    for(var i in event){
      self["EVENT_"+i.toUpperCase()] = event[i];
    }
    timer = setInterval(()=>{
      // console.log(document.body.getAttribute("isREADY"));
      // if(doms.itemRecent.refresh().length > 0 && doms.itemFragment.refresh().length > 0){
      if(document.body.getAttribute("isREADY")){
        if(!$.isNumeric(self.swxLimitGroup)){
          self.swxLimitGroup = 2;
        }
        clearInterval(timer);
        selector.$getAll();
        return launch();
      }
      //console.log(doms);
    }, 1000);
  }

  function launch(){
    LOG("launch!");
    
    doms.divSearchResult.find("swx-people-search").remove();
    doms.divRecentsList.remove();
    
    
    
    if(!developMode){
      loadingDOM.find(".shellSplashLoading").append("<span>0%</span>");
      doms.main.after(loadingDOM);
    }

    self.UserSession = JSON.parse(sessionStorage.getItem("userSession"));
    
    readCustomGroup();

    doms.main.one(event.loaded,function(){
      // doms.chatFragmentsContainer.hide();
      loadingDOM.fadeOut(250,function(){loadingDOM.remove();loadingDOM = null;});
      
      doms.main.find(".sideContainer").remove();
      
      msg = new messageController($self,doms,groups,groupKeys);
      
      // alert("OK");
      // groups["SkypeProjectforCSGroupMessages-4"][0].click();
      $self.trigger(event.loaded);
    });
    
    $self.trigger(event.ready);
              
    var ttime = setTimeout(startBuildSearchInfo,timePreload);
    // startBuildSearchInfo();
    // startBuildRecentInfo();
  }

  var groups = {};
  var failGroups = [];
  var groupsDiv = $("<div class='swx'></div>");
  var groupKeys = [];
  var oldGroupKeys = {};
  var MO = window.MutationObserver || window.WebKitMutationObserver;
  
  function startBuildSearchInfo(){

    var a = 0;
    // var azAry = array_CharRange("A","Z");
    var azAry = ["A","B","C"];
    var word = azAry[a];
    var stimer = 0;
    
    var reWord = [];
    // var dataTitles = [];
    
    // var searchObserver = new MO(function(mut, obs){
    function searchTip(e){
      if(stimer){clearTimeout(stimer);stimer=null;};
      stimer = setTimeout(delay,timeGap);
      // for(var i in mut){
        // var record = mut[i];
        // if(record.target.className=="groups"){
          // stimer = setTimeout(delay,timeGap);
          // break;
        // }else if(i>=mut.length-1){
          // stimer = setTimeout(delay,timeGap*2);
        // }
      // };
    }
    
    $(document)[0].addEventListener("GROUPS_SEARCH_RESULTS",searchTip,false);

    // searchObserver.observe(doms.divSearchResult[0],{
      // childList : true,
      // subtree : true
    // });

    loop();
    
    var fakeTimer = setInterval(fakeRating,500);
    
    function fakeRating(){
      if(rating<85)rating+=1;
      loadingDOM.find("span").text(rating+"%");
    }

    function loop(){
      doms.inputSearch.val(word)[0].dispatchEvent(event.change);
    }
    var rating = 0;
    function delay(){
      console.log("%c Search Word = "+word,"font-size:40px;color:red;");
      doms.itemSearch.refresh();
      for(var i = 0 ; i < doms.itemSearch.length ; i++){
        var dom = doms.itemSearch.eq(i);
        
        var title = dom.data("topic") || "";
        var wrapTxt = title.replace(/[\s\r\n]+/g,"").substr(0,20);
        
        var oldEncodeKey = encodeURIComponent( wrapTxt );
        var key = dom.data("conversationid").replace(/[\/\\\:\'\"\!\@\#\$\%\^\&\*\(\)\.\=]+/g,"_").substr(2,32);
        
        if($.inArray(key,groupKeys)<0){
          // wmap.into++;
          try{
            var kid = groupKeys.length;
            var gdom = {};
            
            gdom.kid = kid;
            gdom.kkey = key;
            gdom.ktitle = title;
            gdom.conversationid = dom.data("conversationid");
            
            groups[key] = gdom;
            // groupsDiv.append(groups[key]);
            groupKeys.push(key);
            oldGroupKeys[oldEncodeKey] = key;
            // dataTitles.push(title);
            
          }catch(e){
            // console.log(dom.data("title"));
            
            if($.inArray(word,reWord) < 0){
              azAry.push(word);
              reWord.push(word);
            }else{
              // var dTitle = title;
              // if($.inArray(dTitle,dataTitles)<0){ failGroups.push( {ftitle : title, fword: word} ); }
            }
            
            // console.log(dom);
            // return false;
          }
        }else{
          // console.log("No People In Group = " + dom.find(".text").text().trim());
          dom.remove();
        }
      }
      
      a++;
      // console.log(word);
      word = azAry[a];
      if((a>1 || developMode) && groupKeys.length > self.swxLimitGroup){word=null;}
      if(word){
        // console.log(groupKeys.length);
        console.log(groupKeys.length);
        rating += Math.floor(groupKeys.length / Math.max(self.swxLimitGroup,groupKeys.length) * 40);
        if(rating>99){rating=99;}
        loadingDOM.find("span").text(rating+"%");
        loop();
      }else if(groupKeys.length < self.swxLimitGroup){
        azAry = azAry.concat(["D","E","G"]);
        word = azAry[a];
        timeGap = 7000;
        console.log("%c Now Groups Item = "+groupKeys.length,"font-size:40px;color:red;");
        loop();
      }else{
        clearInterval(fakeTimer);fakeTimer=null;
        loadingDOM.find("span").text("100%");rating=null;
        // searchObserver.disconnect();
        // searchObserver = null;
        doms.inputSearch.val("")[0].dispatchEvent(event.change);
        console.log(groupKeys);
        // console.log(groups);
        // console.log(azAry);
        doms.divSearchResult.trigger(event.loaded);
      }
    }
    
  }
  
  
  function array_CharRange(start,stop){
    // var result=["0","1","2","3","4","5","6","7","8","9"];
    var result=["0","1","2","3"];
    for (var idx=start.charCodeAt(0),end=stop.charCodeAt(0); idx <=end; ++idx){
      result.push(String.fromCharCode(idx));
    }
    return result;
  };

  prepare();
  return self;
})(SkypeAPI||{}, jQuery, window);

console.log(SkypeAPI);

document.onloadeddata = function(e){
  console.log(e);
}

