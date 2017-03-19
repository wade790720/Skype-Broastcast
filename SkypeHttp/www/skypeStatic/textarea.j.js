function j(e, i) {
    function ct() {
        return !!i.conversationModel
    }

    function ht() {
        var e = n.get().personsAndGroupsManager.mePerson.preferences(s.userSettings.preferences.TYPING_INDICATOR);
        return e ? e.value() : !0
    }

    function pt() {
        var e;
        if (!ct() || !rt.isFeatureOn(s.featureFlags.TYPING_INDICATOR_ENABLED) || !ht()) return;
        e = i.conversationModel.chatService;
        if (!e.sendIsTyping.enabled()) return;
        if (R.personsAndGroupsManager.mePerson.status() === _.onlineStatus.Hidden) return;
        X = !0, V = L.setTimeout(function() {
            X = !1
        }, m.THROTTLE), e.sendIsTyping()
    }

    function dt() {
        z = j.messageBody().length, p.execute(e.updateSizing)
    }

    function vt() {
        return !!j.messageBody().trim() || !!j.quotedMessageHTML().trim()
    }

    function mt() {
      console.log("mt()");
        // W && (W = null, e.editing(!1), At())
    }

    function gt(t, n) {
        var r = n.stopImmediatePropagation;
        return n._stopImmediatePropagationCalled = !1, n.stopImmediatePropagation = function() {
            n._stopImmediatePropagationCalled = !0, r.apply(n, arguments)
        }, j.dispatchEvent(t, {
            event: n,
            viewModel: j,
            view: e
        }, j.DIRECTION.CHILD), n._stopImmediatePropagationCalled
    }

    function yt() {
        return !!q
    }

    function bt(e) {
        var t = e.isEdited ? s.telemetry.chat.UI_EDIT_MESSAGE : s.telemetry.chat.UI_SEND_MESSAGE,
            n = {
                emoticonsCount: e.emoticonsCount || 0,
                messageLength: e.messageLength,
                participantsCount: Z()
            };
        ct() && Z() === 1 && (n.user_to = [i.conversationModel.participants()[0].person.id(), L.skypeTelemetryManager.PIIType.Identity]), e.isEdited && (n.timedelta = e.timedelta), A.get().sendEvent(o.telemetry.uiTenantToken, t, n)
    }

    function wt() {
        var e = F._translatorSettings && F._translatorSettings.isEnabled;
        return e && (st = F._translatorSettings.meLanguage.code, ot = F._translatorSettings.participantLanguage.code), U && e && st && ot && st !== ot
    }

    function Et(e) {
        e.translation ? q(e.message, null, e) : q(e.message)
    }

    function St() {
        var e = d.processOutgoingTextMessage(d.stripHTML(j.messageBody()));
        return d.isMessageWithEmoticonsOnly(e)
    }

    function xt() {
        return j.destination() === s.messageDestination.SKYPE_NETWORK
    }
    
    function Tt() {
      //snow TT
      console.log("Tt()");
        function n() {
            var t = o.messageFilters && o.messageFilters.outgoingMessageFilter ? o.messageFilters.outgoingMessageFilter : null,
                n = r.isFunction(t) ? t(j.messageBody()) : j.messageBody(),
                i = {
                    quotesPresent: kt(),
                    quotedMessageXML: j.quotedMessageXML()
                };
                console.log(n);
                console.log(e);
                
                console.log(i);
                console.log(typeof q);
                
            e === "RichText/Sms" && (i.targets = [j.destination()]),
            q(n, e, i)
            // e === "RichText/Sms" && k.build(n, j.conversationModel, i.targets).publish()
        }
        var e = xt() ? "RichText" : "RichText/Sms";
        // t.getInstance().startTrace("messagePostSuccess"), t.getInstance().startTrace("messagePost"), t.getInstance().startTrace("messageAdd");
        // if (yt()) {
          // console.log(D);
          // console.log(St);
            wt() && !St() ? D.requestTranslation(j.messageBody(), s.chat.messageType.OUTGOING, F, Et) : n();
            // var i = d.getEmoticonNamesFromMessage(d.processOutgoingTextMessage(j.messageBody())),
                // u = g.resolve(s.serviceLocator.PES_MRU_SERVICE);
                //console.log(i);
                // console.log(u);
            // u.addItemsToMru(r.map(i, function(e) {
                // return {
                    // id: e,
                    // type: S.itemTypes.emoticon.id
                // }
            // })),
            // O.emoticonsSentInMessage(i, nt), nt = [],
            // j.dispatchEvent(a.textarea.MESSAGE_SENT, {}, j.DIRECTION.PARENT),
            // bt({
                // messageLength: j.messageBody().length,
                // emoticonsCount: i.length
            // })
        // }
        console.log(q);
    }
    
    
    //snow 自定義送信
    window.customSendMessage = snowCustomSendMessage;
    function snowCustomSendMessage(str) {
      if(str&&str.length>0){
        var e = xt() ? "RichText" : "RichText/Sms";
        n();
      }
      function n() {
          var t = o.messageFilters && o.messageFilters.outgoingMessageFilter ? o.messageFilters.outgoingMessageFilter : null,
              n = r.isFunction(t) ? t(j.messageBody()) : j.messageBody(),
              i = {
                  quotesPresent: kt(),
                  quotedMessageXML: j.quotedMessageXML()
              };
          e === "RichText/Sms" && (i.targets = [j.destination()]),
          q(str, e, i);
          console.log(q);
          // e === "RichText/Sms" && k.build(n, j.conversationModel, i.targets).publish()
      }
    }

    function Nt(e, t) {
        var n = t.translation,
            i = r.filter(e.translations(), function(e) {
                return e.users && e.users[0] && x.isMePersonId(e.users[0].mri)
            }).length;
        n && (!e.translations || !e.translations().length || !i ? e._translationsArray.add(n) : e.translations().forEach(function(e) {
            x.isMePersonId(e.users[0].mri) && (e.users[0].value = n.users[0].value)
        })), e.html(t.message)
    }

    function Ct() {
      //snow Ct 
      console.log("Ct()");
        var e = d.getEmoticonNamesFromMessage(d.processOutgoingTextMessage(j.messageBody())),
            t = j.quotedMessageXML() + d.processOutgoingTextMessage(j.messageBody(), i.conversationModel),
            n = t.length,
            r = W.timestamp(),
            o = D.findMatchingTranslation(W.translations, F._translatorSettings),
            u = wt() && (o && o !== t || !o && W.html() !== t),
            a = {
                messageLength: n,
                emoticonsCount: e.length,
                isEdited: !0,
                timedelta: M.getMessageLifeDurationGroup(new Date - r)
            };
        u ? (D.requestTranslation(j.messageBody(), s.chat.messageType.OUTGOING, F, Nt.bind(null, W)), bt(a), ft.announce({
            key: "message_edited_success"
        })) : W.html() !== t && (W.translations && W.translations().length && W.translations.empty(), W.html(t), bt(a), ft.announce({
            key: "message_edited_success"
        })), mt()
    }

    function kt() {
        return j.quotedMessageXML().length > 0
    }

    function Lt() {
        j.quotedMessageHTML(""), j.quotedMessageXML(""), j.messageQuoted = undefined
    }

    function At(t) {
      console.log("textarea.HAS_INPUT : 1 : clear");
      // console.log(j);
      // console.log(j.quotedMessageXML());
      // console.log(j.messageBody());
        !t && j.messageBody("").length && j.messageBody(""), kt() && Lt(), z = -1, dt(), E.publish(a.textarea.HAS_INPUT, !1), j.dispatchEvent(a.textarea.INPUT, {
            viewModel: j,
            view: e
        }, j.DIRECTION.CHILD)
    }

    function Ot(e) {
        if (e.type === "button") return e.isEditedMessage ? C.chat.editMessageButton : C.chat.sendMessageButton;
        if (e.type === "enter") return e.isEditedMessage ? C.chat.editMessageEnter : C.chat.sendMessageEnter
    }

    function Mt(e) {
        var t = g.resolve(s.serviceLocator.ACTION_TELEMETRY),
            n = Ot(e);
        t.recordAction(n)
    }

    function _t() {
        Mt({
            type: "button",
            isEditedMessage: W
        }), Pt()
    }

    function Dt() {
        Mt({
            type: "enter",
            isEditedMessage: W
        }), Pt()
    }

    function Pt() {
      // snow send message by textarea
      console.log("Pt()");
        if (!vt()) return;
        if (!W && !yt()) return;
        // console.log(Ct);
        // console.log(Tt);
        W ? Ct() : Tt(), W = null, At()
    }

    function Ht() {
        _t(), zt()
    }

    function Bt(e) {
        if (W || yt()) e.preventDefault(), Dt()
    }

    function jt() {
        var e = i.conversationModel.historyService.activityItems().reverse(),
            t = R.personsAndGroupsManager.mePerson.id();
        return e.filter(function(e) {
            var n = e._isSMS && e._isSMS();
            return e.sender && e.sender.id() === t && !n
        })[0]
    }

    function Ft(e) {
        xt() || j.dispatchEvent(a.textarea.UPDATE_SMS_FRAGMENTS, e, j.DIRECTION.PARENT)
    }

    function It(e) {
      console.log("textarea.HAS_INPUT: 2");
        $.chatInput = e, j.dispatchEvent(a.textarea.CHANGED, e, j.DIRECTION.PARENT), E.publish(a.textarea.HAS_INPUT, !0), Ft(e)
    }

    function qt(e) {
        $.quotedMessageXML = e, j.dispatchEvent(a.textarea.CHANGED, e, j.DIRECTION.PARENT)
    }

    function Rt(e) {
      // console.log("3");
        $.quotedMessageHTML = e, j.dispatchEvent(a.textarea.CHANGED, e, j.DIRECTION.PARENT), E.publish(a.textarea.HAS_INPUT, !0)
    }

    function Ut(e) {
        j.dispatchEvent(a.textarea.UPDATE_SMS_DESTINATION, {
            destination: e,
            inputText: j.messageBody()
        }, j.DIRECTION.PARENT)
    }

    function zt() {
        h.get().addFocusRequestToQueue(i.chatInputEl.querySelector("textarea"), h.Priorities.Low)
    }

    function Wt() {
        if (!j.hasChatCapability()) return;
        Xt() && zt()
    }

    function Xt() {
        return Boolean(i.chatInputEl.offsetParent)
    }

    function Vt(e) {
        return !T.isCarriageReturn(e) && !T.isNewLine(e) && !T.isWhiteSpace(e)
    }

    function $t() {
        var e = j.hasChatCapability() ? "area_text_insertText" : "area_text_agent_insertText";
        return Jt() && (e = "invite_free_respond_request"), j.destination() !== s.messageDestination.SKYPE_NETWORK && (e = "sms_input_text_message", !j.isEnabled() && j.isPstnSmsOnly && (e = "sms_insufficient_balance")), w.fetch({
            key: e
        })
    }

    function Jt() {
        function e() {
            return r.find(et(), function(e) {
                return e.type() === _.activityType.ContactRequestIncomingInviteFree
            })
        }
        return e() && g.resolve(s.serviceLocator.FEATURE_FLAGS).isFeatureOn(s.featureFlags.INVITE_FREE_IMPLICIT_INCOMING_CONTACT_REQUEST)
    }

    function Kt(e) {
        var t = r.find(e.sourceTab.packs, function(t) {
            return t.items.some(function(t) {
                return t === e.item
            })
        });
        nt.push({
            item: e.item,
            type: e.sourceTab.id === "mru" ? s.telemetry.pes.source.RECENTS : s.telemetry.pes.source.ROSTER,
            tabIndex: e.sourceTab.index,
            tabName: e.sourceTab.title,
            section: t && t.isFeatured ? s.telemetry.pes.section.FEATURED : s.telemetry.pes.section.REGULAR
        })
    }

    function Qt(t) {
        t && t.prefillTextarea && !j.messageBody() && (j.messageBody(w.fetch({
            key: "unanswered_call_chatinput_placeholder"
        })), e.setCaretToEnd()), t && t.focusTextarea && zt()
    }

    function Gt(t) {
        var n = e.getSelectionStart(),
            r = e.getSelectionEnd();
        n === 0 && r === 0 && (At(!0), t.stopPropagation(), ft.announce({
            key: "label_text_clearedQuotes"
        }))
    }

    function Yt(e) {
        return e === u.ESCAPE && !Zt() ? !0 : e === u.BACKSPACE && j.messageBody() === "" && kt() ? !0 : !1
    }

    function Zt() {
        return j.messageBody().length === 0 && !kt()
    }

    function en(e) {
        return e.preventDefault(), e.stopPropagation(), c.getBrowserInfo().isIeEngine && (e.returnValue = !1), !1
    }

    function tn() {
        return ut && xt()
    }

    function nn(e, t) {
        var n = e.sender.displayName(),
            r = n || e.sender.id(),
            i = l.formatTimestamp(e.timestamp()),
            s = t || P.getContentToQuote(e),
            o = "[" + i + "] " + n + ": " + s + " \n \n <<< ";
        j.narratorTextForQuotes(w.fetch({
            key: "label_quoted_message",
            params: {
                quotesContent: s,
                senderName: n,
                time: i
            }
        }));
        if (tn()) {
            var u = j.conversationModel && j.conversationModel.conversationId ? j.conversationModel.conversationId : "";
            o = P.getQuotedXmlString(e.sender.id(), r, s, u, e.timestamp())
        }
        return o
    }

    function rn(e) {
        j.quotedMessageXML(e), j.quotedMessageHTML(P.getQuotesDisplay(j.quotedMessageXML()))
    }
    var j = this,
        F = i.conversationModel,
        I = F && F.chatService.sendMessage,
        q = i.sendMessage || I,
        R = n.get(),
        U = R.translatorService,
        z = -1,
        W = null,
        X = !1,
        V, $, J, K, Q, G, Y, Z = ct() ? b.newObservableProperty(i.conversationModel.participantsCount) : v.observable(1),
        et = ct() ? b.newObservableCollection(i.conversationModel.historyService.activityItems) : v.observableArray(),
        tt = "active",
        nt = [],
        rt = g.resolve(s.serviceLocator.FEATURE_FLAGS),
        it = rt.isFeatureOn(s.featureFlags.TRANSLATOR_SENDING_ENABLED),
        st, ot, ut = rt.isFeatureOn(s.featureFlags.FORMAT_QUOTES_ENABLED),
        at = rt.isFeatureOn(s.featureFlags.CONTEXT_MENU_COPY_MESSAGES_ENABLED),
        ft = H.narrator,
        lt;
    j.init = function() {
        ct() ? $ = y.forModel(i.conversationModel) : $ = {
            chatInput: null,
            quotedMessageXML: null,
            quotedMessageHTML: null
        }, lt = n.get().conversationsManager, j.conversationModel = i.conversationModel, j.isEnabled = v.observable(i.isEnabled), j.isServiceEnabled = i.isServiceEnabled, j.hasChatCapability = i.hasChatCapability, j.getSelectionStart = e.getSelectionStart, j.setBlurAndFocus = Wt, j.messageMaxLength = s.textarea.MAX_LENGTH, j.destination = i.destination || v.observable(s.messageDestination.SKYPE_NETWORK), j.isPstnSmsOnly = i.isPstnSmsOnly || !1, j.topicViewModel = N.build(i.conversationModel), Y = j.isEnabled().subscribe(function(e) {
            e && p.execute(Wt)
        }), j.messageBody = v.observable(), J = j.messageBody.subscribe(It), j.messageBody($.chatInput || ""), G = j.destination.subscribe(Ut), j.quotedMessageHTML = v.observable($.quotedMessageHTML || ""), j.quotedMessageXML = v.observable($.quotedMessageXML || ""), j.narratorTextForQuotes = v.observable(""), j.label = v.pureComputed(function() {
            return Z() < 2 ? w.fetch({
                key: "label_text_insertText_oneToOne",
                params: {
                    displayName: j.topicViewModel.topic(),
                    quotedText: j.quotedMessageHTML() !== "" ? j.narratorTextForQuotes() : ""
                }
            }) : w.fetch({
                key: "label_text_insertText_group",
                params: {
                    displayName: j.topicViewModel.topic(),
                    participantsText: w.fetch({
                        key: "label_text_participant",
                        count: Z()
                    }),
                    quotedText: j.quotedMessageHTML() !== "" ? j.narratorTextForQuotes() : ""
                }
            })
        }), j.placeholder = v.computed($t), j.selectedSuggestion = v.observable(), dt(), K = j.quotedMessageXML.subscribe(qt), Q = j.quotedMessageHTML.subscribe(Rt), j.registerEvent(a.textarea.SUBMIT_AND_FOCUS, Ht), j.registerEvent(a.emoticonPicker.EMOTICON_SELECTED, j.insertAtCursor), j.registerEvent(f.EVENTS.CALL_SCREEN_CLOSE, zt), j.registerEvent(f.EVENTS.UNANSWERED_CALL_CLOSE, Qt), j.registerEvent(a.message.QUOTE, j.quoteMessageText), j.registerEvent(a.message.EDIT, j.requestEditMessageText), j.registerEvent(a.expressionPicker.CLOSE_REQUEST, Wt), j.registerEvent(a.shareControl.SHARE_CONTROL_HIDE, zt), j.registerEvent(a.suggestionList.ITEM_SELECTED, j.selectedSuggestion), E.subscribe(a.textarea.UPDATE_SMS_DESTINATION, j.updateQuotedMessage), E.subscribe(a.newConversation.CANCELLED, zt), E.subscribe(a.navigation.FRAGMENT_LOADED, Wt), E.subscribe(a.navigation.LEAVE_EDIT_MODE, zt), E.subscribe(a.expressionPicker.ITEM_SEND_REQUEST, j.insertAtCursor), E.subscribe(a.textarea.UPDATE_TEXTAREA_ENABLE, j.updateTextAreaEnable), j.dispatchEvent(a.textarea.INITIALIZATION_COMPLETE, j, j.DIRECTION.PARENT), Wt()
    }, j.dispose = function() {
        L.clearTimeout(V), E.unsubscribe(a.newConversation.CANCELLED, zt), E.unsubscribe(a.navigation.LEAVE_EDIT_MODE, zt), E.unsubscribe(a.navigation.FRAGMENT_LOADED, Wt), E.unsubscribe(a.expressionPicker.ITEM_SEND_REQUEST, j.insertAtCursor), E.unsubscribe(a.textarea.UPDATE_SMS_DESTINATION, j.updateQuotedMessage), E.unsubscribe(a.textarea.UPDATE_TEXTAREA_ENABLE, j.updateTextAreaEnable), Y.dispose(), J.dispose(), K.dispose(), Q.dispose(), j.placeholder.dispose(), j.topicViewModel.dispose(), G.dispose()
    }, j.updateTextAreaEnable = function(e) {
        j.isPstnSmsOnly && j.isEnabled(e)
    }, j.insertAtCursor = function(t, n) {
        var r, s, o, u, a = t.item;
        if (a.type !== "emoticon" || t.conversation !== i.conversationModel) return;
        Kt(t), r = n || e.getSelectionStart(), s = j.messageBody(), o = a.shortcut + " ", u = T.inject(s, o, r), j.messageBody(u), e.setCursorAt(r + o.length), Wt()
    }, j.handleKeyDown = function(e, t) {
        if (gt(a.textarea.KEY_DOWN, t)) return !1;
        var n = t.keyCode || t.which;
        return n === u.UP && e.messageBody() === "" && e.requestEditMessageText(), Yt(n) ? (mt(), At(), t.stopPropagation(), ft.announce({
            key: "label_text_clearedText"
        })) : n === u.BACKSPACE && kt() && Gt(t), !0
    }, j.handleInput = function() {
      // console.log("4");
        j.messageBody().length !== z && dt(), Zt() && (E.publish(a.textarea.HAS_INPUT, !1), mt()), j.dispatchEvent(a.textarea.INPUT, {
            viewModel: j,
            view: e
        }, j.DIRECTION.CHILD)
    }, j.handleKeyPress = function(e, t) {
        if (gt(a.textarea.KEY_PRESS, t)) return !1;
        var n = t.keyCode || t.which;
        return n === u.ENTER && !t.shiftKey ? Bt(t) : X || pt(), !0
    }, j.onFocus = function() {
        i.chatInputEl.addClass(tt)
    }, j.onBlur = function() {
        i.chatInputEl.removeClass(tt), e.updateSizing()
    }, j.onBeforePaste = function(e, t) {
        return en(t)
    }, j.onPaste = function(t, r) {
        function w(e) {
            e.name = B, o.push(e)
        }

        function E(e) {
            d ? Vt(e) && (m += e, v--, d = !1) : (m += e, v--, T.isNewLine(e) && (d = !0))
        }

        function x() {
            var e = lt._getMessageCopiedToCache(),
                t = e && e.sourceMessage;
            if (!t) return !1;
            var n = e.selectedText,
                r = n ? n : P.getContentToQuote(t);
            return r && r.replace(/\n/g, "") === m ? (j.quoteMessageText(t, n), m = "", !0) : !1
        }

        function N() {
            if (tn() && at) {
                var e = x();
                e || lt._setMessageCopiedToCache(undefined)
            }
        }
        var i = r.clipboardData || L.clipboardData,
            o = [],
            u = !!L.clipboardData,
            a = rt.isFeatureOn(s.featureFlags.FILE_PASTE_ENABLED),
            f = j.conversationModel.fileTransferService.send.enabled(),
            l = a && n.get().personsAndGroupsManager.mePerson.preferences(s.userSettings.preferences.FILE_PASTE).value(),
            c = a && f && l,
            h, d, v, m, g, y, b;
        r.originalEvent && (i = i || r.originalEvent.clipboardData), h = i.getData("Text");
        if (!h && c) {
            u ? Array.prototype.forEach.call(i.files, function(e) {
                w(e)
            }) : Array.prototype.some.call(i.types, function(e) {
                return e === "Files"
            }) && Array.prototype.forEach.call(i.items, function(e) {
                var t = e.getAsFile();
                t && w(t)
            });
            if (o.length) return j.conversationModel.fileTransferService.send(o), en(r)
        }
        h = i.getData("Text"), d = !0, m = "", g = j.messageBody(), y = e.getSelectionStart(), b = e.getSelectionEnd(), v = j.messageMaxLength - g.length + b - y;
        for (var S = 0; S < h.length && v > 0; S++) E(h[S]);
        return N(), j.messageBody(T.inject(g, m, y, b)), p.execute(function() {
            e.setCursorAt(y + m.length)
        }), dt(), en(r)
    }, j.quoteMessageText = function(t, n) {
        var r = nn(t, n);
        mt(), j.messageQuoted = t, tn() ? rn(r) : j.messageBody(r + j.messageBody()), dt(), p.execute(e.setCaretToEnd)
    }, j.updateQuotedMessage = function() {
        if (kt() && !xt()) {
            var e = j.messageQuoted;
            Lt(), j.quoteMessageText(e)
        }
    }, j.requestEditMessageText = function(t) {
        if (!ct()) return;
        var n = i.conversationModel.historyService.activityItems();
        if (!n.length) return;
        t = t || jt();
        if (!t || t.type() === _.activityType.SystemMessage) return;
        if (t.html && t.html.set.enabled() && t.text) {
            At();
            var s = d.compactHtml(t.html()),
                o = D.findMatchingTranslation(t.translations, F._translatorSettings),
                u = it && o ? o : s,
                a = d.quotesPresentInHTML(u);
            if (a) {
                var f = d.quotesPresentInXML(t.getOriginalContent());
                j.quotedMessageHTML(a), j.quotedMessageXML(f), u = r.isUndefined(u) ? "" : u.replace(a, "")
            }
            t._skypeemoteoffset && (u = u.substr(t._skypeemoteoffset)), u = d.extractMessageTextContent(u), j.messageBody(u), W = t, dt(), p.execute(e.setCaretToEnd), e.editing(!0)
        }
    }
    setTimeout(function(){
      console.log("FIND QQQQ");
      console.log(q);
    },5000);
}