$(function() {
    //Skype Web Ready
    SkypeAPI.$.on(SkypeAPI.EVENT_READY, function() {
        var user = SkypeAPI.UserSession.skypeId;
        SkypeAPI.swxLimitGroup = localStorage.getItem("swxLimitGroup:" + user) || 5;
    });
    SkypeAPI.$.on(SkypeAPI.EVENT_LOADED, function() {
        launch();
        const overlayWelcome = $("#swx-overlayWelcome")
        const overlayContainer = $(".overlayContainer")
        const shellMainStage = $("#shellMainStage")
        overlayWelcome.remove();
        overlayContainer.remove();
        shellMainStage.css("min-height", $(window).outerHeight());
    });
    //MessageController 準備就緒時
    SkypeAPI.$.on(SkypeAPI.EVENT_MSGREADY, function(e, notSended, lastText) {
        if (notSended.length) {
            const CHROME_EXTENSION_ID = chrome.runtime.id
            const mainArea = $(".custom-group")
            const promptBtn = $('<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#modal-warning" data-backdrop="static" data-keyboard="false" style="visibility:hidden;">提示按鈕</button>')
            const notSendBtn = $('<button type="button" class="btn btn-success" data-toggle="modal" data-target="#modal-success" data-backdrop="static" data-keyboard="false" style="visibility:hidden;">續傳按鈕</button>')
            const promptTmp = $(`<div id="modal-warning" class="modal fade modal-alert modal-warning">
                                      <div class="modal-dialog">
                                          <div class="modal-content">
                                              <div class="modal-header"><img src="chrome-extension://` + CHROME_EXTENSION_ID + `/img/warning.png"></div>
                                              <div class="modal-title">確認以下清單是否繼續發送?!</div>
                                              <div class="modal-body"></div>
                                              <div class="modal-footer">
                                                  <button type="button" class="btn btn-warning js-again" data-dismiss="modal">繼續</button>
                                                  <button type="button" class="btn btn-outline js-notagain" data-dismiss="modal">取消</button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>`)
            const notSendTmp = $(`<div id="modal-success" class="modal fade modal-alert modal-success">
                                    <div class="modal-dialog" style="width:1000px">
                                        <div class="modal-content">
                                            <div class="modal-header"><img src="chrome-extension://` + CHROME_EXTENSION_ID + `/img/success.png"></div>
                                            <div class="modal-title">上次尚未發送完畢的群組，續傳中...</div>
                                            <hr class="m-y-0">
                                            <div class="modal-body">
                                                <div id="js-scroll" class="list-menu"></div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-success btn-loading js-btn-close" data-dismiss="modal" disabled>完成關閉</button>
                                            </div>
                                        </div>
                                    </div>
                                  </div>`)
            mainArea.append(promptBtn)
            mainArea.append(promptTmp)
            mainArea.append(notSendBtn)
            mainArea.append(notSendTmp)
            promptBtn.click()

            promptTmp.on('click', 'button.js-again', function() {
                SkypeAPI.doReadyToSend()
                notSendBtn.click()
                promptTmp.remove()
                promptBtn.remove()
            })

            promptTmp.on('click', 'button.js-notagain', function() {
                SkypeAPI.clearReadyToSend()
                promptTmp.remove()
                promptBtn.remove()
                modalBackDrop.remove()
            })

            const modalBackDrop = $(".modal-backdrop")
            notSendTmp.on('click', 'button.js-btn-close', function() {
                notSendTmp.find(".list-menu").empty()
                notSendTmp.remove()
                notSendBtn.remove()
                modalBackDrop.remove()
            });

            let outPut = "";
            var count = 1
            for (let s in notSended) {
                const loc = notSended[s];
                promptTmp.find(".modal-body").append("<p>" + count + "." + loc.title + "</p>")
                promptTmp.find(".modal-body").css("overflow-y","auto").css("max-height","455px")
                promptTmp.find(".modal-body p").css("text-align","left")
                promptTmp.find(".modal-body p").css("padding","5px")
                promptTmp.find(".modal-body p").css("line-height","25px")
                promptTmp.find(".modal-body p").css("border-bottom","1px solid #d8d8d8")
                count++
            }
        }
    });

    //Skype Start
    function launch() {
        const body = $("body");
        const main = $("#shellMainStage .main");
        const CHROME_EXTENSION_ID = chrome.runtime.id;
        body.append('<div class="modal-overlay"></div>');
        main.append(`<div id="group-chat-submit">
                        <div class="container" style="padding:20px">
                            <div class="box-cell main_container">
                                <div class="row">
                                    <h3 class="p-x-3 col-xs-12 col-md-12 col-lg-12" style="margin-top:5px">&nbsp;&nbsp;Skype Broadcast Tool</h3></div>
                                <div class="panel custom-group">
                                    <div class="panel-body p-a-1">
                                        <div class="btn-toolbar col-xs-12 col-md-7 col-lg-8" role="toolbar">
                                            <button type="button" class="btn btn-primary js-add" data-toggle="modal" data-target="#modal-info" data-backdrop="static" data-keyboard="false">新增群組</button>
                                        </div>
                                    </div>
                                    <hr class="m-y-0">
                                    <div class="panel-body table-area">
                                        <table class="page-messages-items table table-striped m-a-0 custom-group-menu">
                                            <thead>
                                                <tr>
                                                    <td colspan="4">
                                                        <div class="box m-a-0 bg-transparent"><a class="box-cell text-default text-center">自訂群組清單列表</a></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>自訂群組名稱</th>
                                                    <th>自訂群組內的群組數目</th>
                                                    <th>功能列表</th>
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="modal-frame"></div>
                            </div>
                        </div>
                      </div>`);
        groupSubmit = main.find("#group-chat-submit");

        //監聽送信狀態 - 開始送訊
        SkypeAPI.$.on(SkypeAPI.EVENT_MSGSTART, function() {});

        //監聽送信狀態 - 送訊中
        let totalSendedGroup = 0;
        var progressBar = null;
        SkypeAPI.$.on(SkypeAPI.EVENT_MSGPROCESS, function(e, title, remain) {
            const item = $('<div class="widget-tasks-item"><span class="label label-success pull-right">Success</span><label class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" checked> <span class="custom-control-indicator"></span> <span class="widget-tasks-title">' + title + '</span></label></div>');
            $("#modal-success .list-menu").append(item);
            const percent = 100 - Math.round(remain / (totalSendedGroup || 1) * 100);

            if (!!progressBar) { progressBar.width(percent + "%"); }
            // auto-scroll to end
            var elem = document.getElementById("js-scroll")
            elem.scrollTop = elem.scrollHeight
            console.log("已送出的群組名稱 = " + title);
            console.log("所剩未發的數量 = " + remain);
        });

        //監聽送信狀態 - 結束送訊
        SkypeAPI.$.on(SkypeAPI.EVENT_MSGEND, function() {
            console.log("結束送訊");
            $("#modal-success").find("button").removeClass("btn-loading");
            $("#modal-success").find("button").prop("disabled", false);
        });

        //監聽送信狀態 - 送訊出錯
        SkypeAPI.$.on(SkypeAPI.EVENT_MSGERROR, function(e, msg, scheme) {
            console.log("送訊出錯：" + msg);
            alert("送訊出錯");
        });

        // SkypeAPI :: 取得group列表
        const list = SkypeAPI.getSkypeGroups();

        // SkypeAPI :: 取得自訂group列表
        const allCoustomGroup = SkypeAPI.getCustomGroups();

        const mainArea = $(".custom-group");
        const customModal = $('.modal-frame');
        const overLay = $('.modal-overlay');

        // Plugin Modals Element
        customModal.bind('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
            if (customModal.hasClass('state-leave')) {
                customModal.removeClass('state-leave');
            }
        });

        // ViewCustomGroup - Click Button ViewGroup
        mainArea.on('click', 'button.js-view', function() {
            const viewModal = $("#modal-large-view")
            const tmp = $('<div id="modal-large-view" class="modal"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-body"><ul class="list-group"></ul></div></div></div></div>');
            viewModal.remove();
            mainArea.append(tmp);

            const nowEditGroup = $(this).parents("tr");
            const loc = nowEditGroup.data("cg");
            for (let l in loc.groups) {
                const gid = loc.groups[l];
                const title = list[gid].title;
                const subGroup = $('<li class="list-group-item">' + title + '</li>');
                $("#modal-large-view .list-group").append(subGroup);
            }
        });

        // AddCustomGroup - Step0 Click Button
        mainArea.on("click", "button.js-add", function() {
            const tmp = $(`<div id="modal-info" class="modal fade modal-alert modal-info">
                          <div class="modal-dialog">
                              <div class="modal-content">
                                  <div class="modal-header"><img src="chrome-extension://` + CHROME_EXTENSION_ID + `/img/info.png"></div>
                                  <div class="modal-title" style="text-align:left">請輸入自定群組名稱</div>
                                  <div class="modal-body">
                                      <div class="form-group">
                                          <input type="text" class="form-control" placeholder="Group Name" maxlength="62">
                                      </div>
                                  </div>
                                  <div class="modal-footer">
                                      <button type="button" class="btn btn-info js-btn-next">下ㄧ步</button>
                                      <button type="button" class="btn btn-outline js-btn-cancel" data-dismiss="modal">取消</button>
                                  </div>
                              </div>
                          </div>
                        </div>`);
            mainArea.append(tmp);

            const addGroup = $(".modal-info");
            // AddCustomGroup - Step1 Input Group Name
            addGroup.on('click', 'button.js-btn-next', function() {
                var title = addGroup.find("input").val();

                if (title) {
                    // Modals Template Loading
                    const selectGroupTemplate = $(`<div class="custom-modal" style="height: 100%;">
                                                    <div class="modal-inset">
                                                        <div class="custom-modal-body">
                                                            <div class="page-header" style="margin:0;padding-bottom:10px">
                                                                <div class="col-xs-12 col-md-12 col-lg-12">
                                                                    <h1 class="group-name pull-left">自訂群組標題字幕</h1></div>
                                                            </div>
                                                            <div class="panel-body" style="box-shadow:0 2px 3px #d4d4d4">
                                                                <div class="col-xs-12 col-md-7 col-lg-8">
                                                                    <div class="input-group">
                                                                        <input type="text" id="groupList-search" class="form-control" placeholder="搜尋"> <span class="input-group-btn"><button type="submit" class="btn btn-primary btn-search">搜尋</button></span></div>
                                                                </div>
                                                                <div class="col-xs-12 col-md-5 col-lg-4">
                                                                    <button type="button" class="btn btn-primary btn-outline js-check-all"><i class="fa fa-check"></i> 全選</button>
                                                                    <button type="button" class="btn btn-primary btn-outline js-check-remove"><i class="fa fa-remove"></i> 取消</button>
                                                                </div>
                                                            </div>
                                                            <div class="skype-group"></div>
                                                            <div class="modal-footer" style="box-shadow:0 -1px 3px #d4d4d4">
                                                                <button type="button" class="btn btn-outline js-btn-order" data-toggle="modal" data-target="#modal-info">上ㄧ步</button>&nbsp;&nbsp;
                                                                <button type="button" class="btn btn-primary pull-right js-btn-suceess">完成</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`);
                    customModal.append(selectGroupTemplate);

                    const formGroup = $(".custom-modal");
                    const formTitle = formGroup.find("h1").text(title);
                    addGroup.find(".form-group").removeClass("has-error");

                    //Skype List Menu Loading
                    const groupList = $(".skype-group");
                    list.forEach(function(record) {
                        const tmp = $('<div class="widget-messages-item unread"><label class="widget-messages-checkbox custom-control custom-checkbox custom-control-blank"><input type="checkbox" class="custom-control-input"><span class="custom-control-indicator"></span></label><a class="widget-messages-from">' + record.title + '</a></div>');
                        tmp.data("g", record);
                        groupList.append(tmp);
                    });

                    // AddCustomGroup - Step2 Check Group Name
                    const groupListSearch = $("#groupList-search");
                    groupListSearch.on("change", function(e) {
                        const time1 = new Date();
                        const txt = this.value;
                        const gl = groupList.find("div").css("display", "");
                        if (txt.length) {
                            gl.filter(function(i) {
                                return !this.innerText.match(txt);
                            }).css("display", "none");
                        }
                        var time2 = new Date();
                        console.log(time2 - time1);
                    });

                    formGroup.on('click', 'button.js-check-all', function() {
                        formGroup.find(".skype-group input[type=checkbox]:visible").prop('checked', true);
                    });
                    formGroup.on("click", "button.js-check-remove", function() {
                        formGroup.find(".skype-group input[type=checkbox]:visible").prop('checked', false);
                    });

                    $(".js-btn-order").on('click', function() {
                        customModals(customModal, overLay);
                        formGroup.remove();
                    });

                    $('.js-btn-suceess').on('click', function() {
                        const txt = formGroup.find(".group-name").text();
                        var groups = [];
                        groupList.find("input:checked").each(function(i, x) {
                            const li = $(this).parents(".widget-messages-item");
                            const data = li.data("g");
                            groups.push(data.id);
                        });

                        //展示新增群組
                        var locData = SkypeAPI.addCustomGroup({
                            name: txt,
                            groups: groups
                        });

                        if (locData) {
                            var tmp = buildCustomGroupTemplateWithObject(locData);
                            $(".custom-group-menu").append(tmp);
                            groupList.find("input").prop("checked", false);
                        }

                        customModals(customModal, overLay);
                        addGroup.remove();
                        formGroup.remove();
                        // View Toastr Add-Success
                        toastr["info"](txt + "&nbsp;群組已建立");
                    });

                    // OpenNextForm
                    overLay.addClass('state-show');
                    customModal.removeClass('state-leave').addClass('state-appear');

                    // CloseForm
                    addGroup.modal('hide');
                } else {
                    addGroup.find(".form-group").addClass("has-error");
                }
            });

            addGroup.on("click", "button.js-btn-cancel", function() {
                addGroup.remove();
            });
        });

        // EditCustomGroup - Step0 Click Button
        mainArea.on("click", "button.js-edit", function() {
            const title = $(this).parents("tr").find(".trName a").text();
            const numName = $(this).parents("tr").find(".trName a")
            const numGroup = $(this).parents("tr").find(".trNum");
            const selectGroupTemplate = $(`<div class="custom-modal modal-edit">
                                            <div class="modal-inset">
                                                <div class="custom-modal-body">
                                                    <div class="page-header">
                                                        <div class="input-title-area pull-left">
                                                            <input type="text" class="form-control group-name pull-left" placeholder="Group Name" maxlength="62" readonly>
                                                        </div>
                                                        <div class="btn-edit-area pull-right">
                                                            <button type="button" class="btn btn-primary btn-outline js-title-edit">編輯</button>
                                                            <button type="button" class="btn btn-primary btn-outline js-title-success">完成</button>
                                                            <button type="button" class="btn btn-primary btn-outline disappear js-title-cancel">取消</button>
                                                        </div>
                                                    </div>
                                                    <div class="panel-body">
                                                        <div class="input-search-area pull-left">
                                                            <div class="input-group">
                                                                <input type="text" id="groupList-search" class="form-control" placeholder="搜尋"> <span class="input-group-btn"><button type="submit" class="btn btn-primary btn-search">搜尋</button></span>
                                                            </div>
                                                        </div>
                                                        <div class="pull-right btn-area">
                                                            <button type="button" class="btn btn-primary btn-outline js-check-all">全選</button>
                                                            <button type="button" class="btn btn-primary btn-outline js-check-remove">取消</button>
                                                        </div>
                                                    </div>
                                                    <div class="skype-group"></div>
                                                    <div class="modal-footer" style="box-shadow:0 -1px 3px #d4d4d4">
                                                        <button type="button" class="btn btn-outline btn-cancel pull-right" style="margin-left:10px;">取消</button>&nbsp;&nbsp;
                                                        <button type="button" class="btn btn-primary pull-right js-btn-suceess">完成</button>
                                                    </div>
                                                </div>
                                            </div>
                                         </div>`);
            customModal.append(selectGroupTemplate);

            const formGroup = $(".custom-modal");
            const formTitle = formGroup.find("input.group-name").val(title);

            const nowEditGroup = $(this).parents("tr");
            const loc = nowEditGroup.data("cg");
            const groupList = $(".skype-group");

            const groupListSearch = $("#groupList-search");
            groupListSearch.on("change", function(e) {
                var time1 = new Date();
                var txt = this.value;
                var gl = groupList.find("div").css("display", "");
                if (txt.length > 0) {
                    gl.filter(function(i) {
                        // console.log(!this.innerText.match(txt));
                        return !this.innerText.match(txt);
                    }).css("display", "none");
                }
                var time2 = new Date();
                console.log(time2 - time1);
            });

            groupList.data("cg", loc);
            list.forEach(function(record) {
                var tmp = $('<div class="widget-messages-item unread"><label class="widget-messages-checkbox custom-control custom-checkbox custom-control-blank"><input type="checkbox" class="custom-control-input" name=' + record.id + '><span class="custom-control-indicator"></span></label><a class="widget-messages-from">' + record.title + '</a></div>');
                tmp.data("g", record);
                groupList.append(tmp);
            });

            for (let l in loc.groups) {
                groupList.find("input[name=" + loc.groups[l] + "]").prop("checked", true);
            }

            formGroup.on("click", "button.js-check-all", function() {
                formGroup.find(".skype-group input[type=checkbox]:visible").prop('checked', true);
            });
            formGroup.on("click", "button.js-check-remove", function() {
                formGroup.find(".skype-group input[type=checkbox]:visible").prop('checked', false);
            });

            const editGroup = $(this).parents("tr").data("cg").id;
            $(".btn-cancel").on('click', function() {
                customModals(customModal, overLay);
                formGroup.remove();
            });

            const btnTitleEdit = $('.js-title-edit')
            const btnTitleSuccess = $('.js-title-success')
            const btnTitleCancel = $('.js-title-cancel')
            const inputTitleValue = $('.input-title-area .group-name')
            btnTitleSuccess.css("display", "none")

            btnTitleEdit.on('click', function() {
                btnTitleEdit.css("display", "none")
                btnTitleSuccess.css("display", "inline-block")
                btnTitleCancel.removeClass("disappear")
                inputTitleValue.prop('readonly', false).focus();
            })

            btnTitleSuccess.on('click', function() {
                btnTitleEdit.css("display", "inline-block")
                btnTitleSuccess.css("display", "none")
                btnTitleCancel.addClass("disappear")
                inputTitleValue.prop('readonly', true);

                var editTitleGroup = SkypeAPI.updateCustomGroup(editGroup, {
                    name: inputTitleValue.val()
                });

                if (editTitleGroup) {
                    nowEditGroup.data("cg", editTitleGroup);
                }
            })

            btnTitleCancel.on('click', function() {
                btnTitleEdit.css("display", "inline-block")
                btnTitleSuccess.css("display", "none")
                btnTitleCancel.addClass("disappear")
                inputTitleValue.prop('readonly', true);
            })

            $('.js-btn-suceess').on('click', function() {
                var groups = [];
                var data = {};

                groupList.find("input:checked").each(function(i, x) {
                    var li = $(this).parents(".widget-messages-item");
                    var data = li.data("g");
                    groups.push(data.id);
                });
                var newData = SkypeAPI.updateCustomGroup(editGroup, {
                    groups: groups
                });
                if (newData) {
                    nowEditGroup.data("cg", newData);
                }
                formGroup.remove();
                numName.text(formTitle.val());
                numGroup.text(groups.length + "個群組");
                customModals(customModal, overLay);
                toastr["info"](formTitle.val() + "&nbsp;群組已編輯更新");
                toastr["info"]("群組數目為:&nbsp;" + groups.length + "個");
            });

            // OpenForm
            overLay.addClass('state-show');
            customModal.removeClass('state-leave').addClass('state-appear');
        });

        // DelCustomGroup - Step0 Click Button
        mainArea.on("click", "button.js-delete", function() {
            const li = $(this).parents("tr");
            const title = li.find(".trName a").text();
            const data = li.data("cg");
            const id = data.id;
            const tmp = $(`<div id="modal-danger" class="modal fade modal-alert modal-danger">
                          <div class="modal-dialog">
                              <div class="modal-content">
                                  <div class="modal-header"><img src="chrome-extension://` + CHROME_EXTENSION_ID + `/img/delete.png"></div>
                                  <div class="modal-title">確定是否刪除群組?!</div>
                                  <div class="modal-body"></div>
                                  <div class="modal-footer">
                                      <button type="button" class="btn btn-danger js-btn-delete" data-dismiss="modal">刪除</button>
                                      <button type="button" class="btn btn-outline js-btn-cancel" data-dismiss="modal">取消</button>
                                  </div>
                              </div>
                          </div>
                        </div>`);
            mainArea.append(tmp);

            const deleteGroup = $(".modal-danger");
            // DelCustomGroup - Step1 Delete Button
            deleteGroup.on("click", "button.js-btn-delete", function() {
                deleteGroup.remove();
                deleteGroup.modal('hide');

                if (SkypeAPI.removeCustomGroup(id)) {
                    li.remove();
                };
                toastr["error"](title + "&nbsp;群組已刪除");
            });

            deleteGroup.on("click", "button.js-btn-cancel", function() {
                deleteGroup.remove();
            });
        });

        // SendMessageCustomGroup - Step0 Click Button
        mainArea.on("click", "button.btn.js-send", function() {
            const title = $(this).parents("tr").find(".trName a").text();
            const tmp = $(`<div class="modal fade" id="modal-large" tabindex="-1">
                          <div class="modal-dialog modal-lg">
                              <div class="modal-content">
                                  <div class="modal-header">
                                      <button type="button" class="close" data-dismiss="modal">×</button>
                                      <h4 class="modal-title">` + title + ` 訊息輸入中...</h4></div>
                                  <div class="modal-body">
                                      <textarea class="form-control message-textarea"></textarea>
                                  </div>
                                  <div class="modal-footer">
                                      <button type="button" class="btn btn-success js-btn-send" data-toggle="modal" data-target="#modal-success" data-backdrop="static" data-keyboard="false">發送</button>
                                      <button type="button" class="btn btn-outline js-btn-cancel" data-dismiss="modal">取消</button>
                                  </div>
                              </div>
                          </div>
                        </div>`);
            mainArea.append(tmp);
            const li = $(this).parents("tr");
            const data = li.data("cg");
            const groups = data.groups;
            totalSendedGroup = groups.length;

            const sendMessageTextarea = $("#modal-large");
            sendMessageTextarea.on("click", "button.js-btn-send", function() {
                var txt = $(".message-textarea").val();

                const sendTemplate = $(`<div id="modal-success" class="modal fade modal-alert modal-success">
                                        <div class="modal-dialog" style="width:1000px">
                                            <div class="modal-content">
                                                <div class="modal-header"><img src="chrome-extension://` + CHROME_EXTENSION_ID + `/img/success.png"></div>
                                                <div class="modal-title">發送訊息中...</div>
                                                <div class="progress" style="margin:10px">
                                                    <div class="progress-bar progress-bar-success progress-bar-striped active" style="width:0%"></div>
                                                </div>
                                                <hr class="m-y-0">
                                                <div class="modal-body">
                                                    <div id="js-scroll" class="list-menu"></div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-success btn-loading" data-dismiss="modal" disabled>完成關閉</button>
                                                </div>
                                            </div>
                                        </div>
                                      </div>`);
                mainArea.append(sendTemplate);
                progressBar = sendTemplate.find(".progress-bar");

                sendTemplate.on("click", "button.btn-success", function() {
                    sendTemplate.find(".list-menu").empty();
                    sendMessageTextarea.remove();
                    sendTemplate.remove();
                });

                SkypeAPI.sendMessage({
                    id: groups,
                    text: txt
                });



                sendMessageTextarea.modal('hide');
            });
            sendMessageTextarea.on('click', 'button.js-btn-cancel', function() {
                sendMessageTextarea.remove();
            });

            // Auto Textarea Height
            textAreaMessage = $("textarea.message-textarea");
            $(function($) {
                textAreaMessage.css("overflow", "hidden").bind("keydown keyup", function() {
                    $(this).height('0px').height($(this).prop("scrollHeight") + "px");
                }).keydown();
                textAreaMessage.height('150px');
            });
        });

        // 顯示所有自訂群組清單
        for (let i in allCoustomGroup) {
            var loc = allCoustomGroup[i];
            var tmp = buildCustomGroupTemplateWithObject(loc);
            $(".custom-group-menu").append(tmp);
        }

        function buildCustomGroupTemplateWithObject(loc) {
            const tmp = $(`<tr>
                          <td class="trName" style=" width: calc(100%/3); ">
                              <div class="box m-a-0 bg-transparent"><a class="box-cell text-default">` + loc.name + `</a></div>
                          </td>
                          <td class="trNum">` + loc.groups.length + `個群組</td>
                          <td style=" width: calc(100%/2); ">
                              <div class="box-cell text-xs-right group-action-btn">
                                  <button type="button" class="btn btn-outline btn-view js-view" data-toggle="modal" data-target="#modal-large-view">檢視群組</button>
                                  <button type="button" class="btn btn-primary js-edit">編輯群組</button>
                                  <button type="button" class="btn btn-success js-send" data-toggle="modal" data-target="#modal-large" data-backdrop="static" data-keyboard="false">發送訊息</button>
                                  <button type="button" class="btn btn-danger js-delete" data-toggle="modal" data-target="#modal-danger" data-backdrop="static" data-keyboard="false">刪除群組</button>
                              </div>
                          </td>
                        </tr>`);
            tmp.data("cg", loc);

            return tmp;
        }

        function customModals(modal, overlay) {
            overlay.removeClass('state-show');
            modal.removeClass('state-appear');
        }

        // Toastr Options
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }
});
