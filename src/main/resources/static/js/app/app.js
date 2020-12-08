'use strict'
$(document).ready(function() {

   $("#wm-wiremock-port").click(function(e) {
       e.preventDefault();
       e.stopPropagation();

       var host = window.location.host
       if (host.indexOf(":") > 0) {
           host = host.split(":")[0]
       }
       var port = $("#wm-wiremock-port-label").text()
       var wiremockAddress = window.location.protocol + "//" + host + ":" + port + "/"
       window.open(wiremockAddress);
   });

    function getHeader(header) {
        var req = new XMLHttpRequest();
        req.open('GET', document.location, false);
        req.send(null);

        // associate array to store all values
        var data = new Object();

        // get all headers in one call and parse each item
        var headers = req.getAllResponseHeaders().toLowerCase();
        var aHeaders = headers.split('\n');
        var i = 0;
        for (i = 0; i < aHeaders.length; i++) {
            var thisItem = aHeaders[i];
            var key = thisItem.substring(0, thisItem.indexOf(':'));
            var value = thisItem.substring(thisItem.indexOf(':') + 1);
            data[key] = value;
        }

        // get referer
        var referer = document.referrer;
        data["Referer"] = referer;

        //get useragent
        var useragent = navigator.userAgent;
        data["UserAgent"] = useragent;

        //extra code to display the values in html
        var display = "";
        for (var key in data) {
            if (key == header)
                return data[key];
        }
        return null
    }

    function showToast(text){
        $("#wm_toast_text").text(text)
        $('.toast').toast("show");
        $('.toast').on('show.bs.toast', function () {
            $('.toast').css("display", "")
        });
        $('.toast').on('hidden.bs.toast', function () {
            $('.toast').css("display", "none")
        })
    }

    $(document).on("mousedown", function (e1) {
      if (e1.which === 2) {
        $(document).one("mouseup", function (e2) {
          if (e1.target === e2.target) {
            var e3 = $.event.fix(e2);
            e3.type = "middleclick";
            $(e2.target).trigger(e3);
          }
        });
      }
    });

    ko.bindingHandlers.codemirror = {
        init: function(element, valueAccessor) {
            var options = ko.unwrap(valueAccessor());
            element.editor = CodeMirror(element, ko.toJS(options));
            element.editor.on('change', function(cm) {
                options.value(cm.getValue());
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                var wrapper = element.editor.getWrapperElement();
                wrapper.parentNode.removeChild(wrapper);
            });
        },
        update: function(element, valueAccessor) {
            var value = ko.toJS(valueAccessor()).value;
            if (element.editor) {
                var cur = element.editor.getCursor();
                element.editor.setValue(getPrettyJsonOrDefault(value));
                element.editor.setCursor(cur);
                element.editor.refresh();
            }
        }
    };

    function getPrettyJsonOrDefault(text) {
        try {
            return JSON.stringify(JSON.parse(text), null, '    ');
        } catch (e) {
            return text;
        }
    }

    ko.bindingHandlers.htmlValue = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            ko.utils.registerEventHandler(element, "keyup", function() {
                var modelValue = valueAccessor();
                var elementValue = element.innerText;
                if (ko.isWriteableObservable(modelValue)) {
                    modelValue(elementValue);
                }

                else { //handle non-observable one-way binding
                    var allBindings = allBindingsAccessor();
                    if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers'].htmlValue) allBindings['_ko_property_writers'].htmlValue(elementValue);
                }
            }
                                         )
        },
        update: function(element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()) || "";
            if (element.innerText !== value) {
                element.innerText = value;
            }
        }
    };

    $.doHttpRequest = function(type, url, data, callback) {
        var dataType = 'json'
        if (type == "DELETE" || type == "PATCH") {
            dataType = 'text'
        }

        return jQuery.ajax({
            'type': type,
            'url': url,
            'contentType': 'application/json',
            'data': data,
            'dataType': dataType,
            'success': callback
        });
    };

    $.confirmPrompt = function(message, confirm, confirmCallback, cancel, cancelCallback) {
        bootbox.confirm({
            message: message,
            buttons: {
                confirm: {
                    label: '<i class="fa fa-check"></i> '+confirm,
                    className: 'btn-success'
                },
                cancel: {
                    label: '<i class="fa fa-times"></i> '+cancel,
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {confirmCallback() } else { cancelCallback() }
            }
        });
    }

    function getRotationDegrees(obj) {
        var matrix = obj.css("-webkit-transform") ||
            obj.css("-moz-transform") ||
            obj.css("-ms-transform") ||
            obj.css("-o-transform") ||
            obj.css("transform");
        if (matrix !== 'none') {
            var values = matrix.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        } else {
            var angle = 0;
        }
        return (angle < 0) ? angle + 360 : angle;
    }

    //////////////// Mouse hover events ///////////////////////////
    $(document).on("mouseenter", ".wm-stub-item", function() {
        $(this).children(".wm-stub-menu-img").css("visibility", "visible")
    });

    $(document).on("mouseleave", ".wm-stub-item", function() {
        $(this).children(".wm-stub-menu-img").css("visibility", "hidden")
    });

    $(document).on("mouseenter", ".wm-stubs-collection-name-container", function() {
        $(this).children(".wm-stub-group-menu-img").css("visibility", "visible")
    });

    $(document).on("mouseleave", ".wm-stubs-collection-name-container", function() {
        $(this).children(".wm-stub-group-menu-img").css("visibility", "hidden")
    });

    $(document).on("mouseenter", ".wm-stub-tab-nav", function() {
        $(this).children(".wm-close-stub-tab").css("visibility", "visible")
    });

    $(document).on("mouseleave", ".wm-stub-tab-nav", function() {
        $(this).children(".wm-close-stub-tab").css("visibility", "hidden")
    });

    $(document).on("mouseenter", ".wm-content-editable-stub-name-container", function() {
        $(this).children(".wm-content-editable-stub-name-pencil").css("visibility", "visible")
    });

    $(document).on("mouseleave", ".wm-content-editable-stub-name-container", function() {
        $(this).children(".wm-content-editable-stub-name-pencil").css("visibility", "hidden")
    });
    //////////////// Mouse hover events ///////////////////////////

    $(document).on("middleclick", ".wm-stub-tab-nav", function (e) {
        var stub = ko.dataFor($(this)[0]);
    	removeTabEditor(stub)
    });

    $(document).on("click", "#wm-stubs-collection-name-container", function(e) {
        e.preventDefault();
        e.stopPropagation();

        $(this).parent().find("#wm-expand-close-img").click();
    });

    $(document).on("click", "#wm-expand-close-img", function(e) {
        e.preventDefault();
        e.stopPropagation();

        var degrees = 90;
        var imgArrow = $("#wm-expand-close-img");
        if (getRotationDegrees(imgArrow) > 0) {
            degrees = 0;
        }
        imgArrow.css({
            '-webkit-transform': 'rotate(' + degrees + 'deg)',
            '-moz-transform': 'rotate(' + degrees + 'deg)',
            '-ms-transform': 'rotate(' + degrees + 'deg)',
            'transform': 'rotate(' + degrees + 'deg)'
        });
    });

    ////////////// Stub group ContextMenu ////////////////
    var buildStubGroupContextMenuFunction = function($trigger, e) {
        var stubGroupMenuItems = {
            "new": {name: "Novo Stub", icon: "add"},
            "edit": {name: "Editar", icon: "edit"},
            "sep1": "---------",
            "delete": {name: "Apagar", icon: "delete"},
        }

        var stubGroupClickCallback = function(key, options) {
            var stubGroup = ko.dataFor($trigger[0]);
            switch (key) {
                case "new": newStub(stubGroup); break;
                case "edit": editStubGroup(stubGroup); break;
                case "delete": deleteStubGroup(stubGroup); break;
            }
        }

        return {
            callback: stubGroupClickCallback,
            items: stubGroupMenuItems
        };
    }

    $.contextMenu({
        selector: '#wm-stub-group-menu-img',
        trigger: 'left',
        build: buildStubGroupContextMenuFunction
    });

    $.contextMenu({
        selector: "#wm-stubs-collection-name-container",
        build: buildStubGroupContextMenuFunction
    });

    var buildStubContextMenuFunction = function($trigger, e) {
        var stubMenuItems = {
            "duplicate": {name: "Duplicar", icon: "edit"},
            "sep1": "---------",
            "delete": {name: "Apagar", icon: "delete"},
        }

        var stubClickCallback = function(key, options) {
            var stubGroup = ko.contextFor($trigger[0]).$parent;
            var stub = ko.contextFor($trigger[0]).$data;
            switch (key) {
                case "duplicate": duplicateStub(stubGroup, stub); break;
                case "delete": deleteStub(stubGroup, stub); break;
            }
        }

        return {
            callback: stubClickCallback,
            items: stubMenuItems
        };
    }

    $.contextMenu({
        selector: '#wm-stub-menu-img',
        trigger: 'left',
        build: buildStubContextMenuFunction
    });

    $.contextMenu({
        selector: "#wm-stub-item",
        build: buildStubContextMenuFunction
    });
    ////////////// Stub group ContextMenu ////////////////

    ////////////// Models ///////////////////////////////
    function Stub(data) {
        this.id = ko.observable(0);
        this.name = ko.observable("");
        this.description = ko.observable("");
        this.stub = ko.observable("");
        this.order = ko.observable(0);

        if (data !== undefined) {
            if (data.id !== undefined) {
                this.id(data.id);
            }
            if (data.name !== undefined) {
                this.name(data.name);
            }
            if (data.description !== undefined) {
                this.description(data.description);
            }
            if (data.stub !== undefined) {
                this.stub(data.stub);
            }
            if (data.order !== undefined) {
                this.order(data.order);
            }
        }

        this.requestMethod = ko.computed(function() {
            try {
                var stubObject = JSON.parse(this.stub())

                return (stubObject !== null &&
                        stubObject.request !== undefined &&
                        stubObject.request.method !== undefined) ?
                    stubObject.request.method : "???"
            } catch (e) {
                return "???"
            }
        }, this);

        this.requestColorClass = ko.computed(function() {
            var requestMethod = this.requestMethod()
            switch (requestMethod) {
                case "POST":
                    return "wm-stub-item-request-type-post";
                case "GET":
                    return "wm-stub-item-request-type-get";
                case "PUT":
                    return "wm-stub-item-request-type-put";
                case "DELETE":
                    return "wm-stub-item-request-type-delete";
                default:
                    return "wm-stub-item-request-type-other";
            }
        }, this);
    }

    function StubGroup(data) {
        this.id = ko.observable(0);
        this.name = ko.observable("");
        this.description = ko.observable("");
        this.stubs = ko.observableArray([]);
        this.order = ko.observable(0);

        if (data !== undefined) {
            if (data.id !== undefined) {
                this.id(data.id)
            }
            if (data.name !== undefined) {
                this.name(data.name);
            }
            if (data.description !== undefined) {
                this.description(data.description);
            }
            if (data.stubs !== undefined) {
                this.stubs(data.stubs);
            }
            if (data.order !== undefined) {
                this.order(data.order);
            }
        }
    }

    function TabStubEditor(data) {
        this.stub = ko.observable();
        this.stubGroup = ko.observable();
        this.active = ko.observable(false);

        this.invisible = function() {
            return !active();
        }

        if (data !== undefined) {
            if(data.stub !== undefined) {
                this.stub(data.stub);
            }
            if(data.stubGroup !== undefined) {
                this.stubGroup(data.stubGroup);
            }
            if(data.active !== undefined) {
                this.active(data.active);
            }
        }
    }
    ////////////// Models ///////////////////////////////

    function convertRequestResponseToStubGroup(stubGroup) {
        var stubs = [];
        stubGroup.stubs.forEach(function(stub, index) {
            stubs.push(convertRequestResponseToStub(stub));
        });

        self.stubGroups.push(new StubGroup({
            id: stubGroup.id,
            name: stubGroup.name,
            description: stubGroup.description,
            stubs: stubs,
            order: stubGroup.order
        }));
    }

    function convertRequestResponseToStub(stub){
        return new Stub({
            id: stub.id,
            name: stub.name,
            description: stub.description,
            stub: stub.stub,
            order: stub.order
        });
    }

    //////////////////////////// knockout ///////////////////////////////
    function ViewModel() {
        self.lastTabStubEditorWithFocus = ko.observable();
        self.tabStubEditors = ko.observableArray([]);
        self.stubGroups = ko.observableArray([]);

        self.loadStubGroups = function() {
            $("#wm-loading-stub").css("visibility", "visible");

            var endPointGetStubs = "/api/stubgroups";
            // var endPointGetStubs = "http://localhost:8081/stubgroups"

            $.doHttpRequest("GET", endPointGetStubs, null, function (data){
                self.stubGroups.removeAll();
                data.forEach(function(stubGroup, index) {
                    convertRequestResponseToStubGroup(stubGroup);
                })
            }).fail(function(res) {
                // TODO Remove this Mock when finished
                //////// mock ////////////////
                stubGroups.push(new StubGroup({
                    name: "Stub Group",
                    description: "  ",
                    order: self.stubGroups().length,
                    stubs: [
                        new Stub({
                            id: 1,
                            name: "Stub Teste",
                            stub: "{\"request\": {\"method\": \"POST\"}}"
                        }),
                        new Stub({
                            id: 2,
                            name: "Stub Teste 2",
                            stub: "{\"request\": {\"method\": \"GET\"}}"
                        })
                    ]
                }));
                //////// mock ////////////////
            }).always(function() {
                $("#wm-loading-stub").css("visibility", "hidden");
            });
        }

        function getTabForStub(stub) {
            var tab = null;
            self.tabStubEditors().forEach(function(tabEditor, index) {
                if(tabEditor.stub().id() == stub.id()) {
                    tab = tabEditor
                }
            });
            return tab;
        }

        self.onStubClick = function(stub, stubGroup) {
            var tabEditor = getTabForStub(stub);
            if (tabEditor === null) {
                tabEditor = new TabStubEditor({
                    stub: stub,
                    stubGroup: stubGroup
                });
                self.tabStubEditors.push(tabEditor);
                setTimeout(function() {self.requestTabFocus(tabEditor)}, 50);
            } else {
                self.requestTabFocus(tabEditor)
                return
            }
        };

        self.requestTabFocus = function (tab) {
            if(tab != null) {
                self.tabStubEditors().forEach(function(tabEditor, index) {
                    if(tabEditor.active()) {
                        lastTabStubEditorWithFocus = tabEditor;
                    }
                    tabEditor.active(false);
                });
                if(tab != null) {
                    tab.active(true);
                }
            }
        }.bind(this);

        /////////// new Stub Group ///////////////
        self.onNewFolderClick = function() {
            $('#newStubGroupModal').modal({
                backdrop: 'static',
                keyboard: false
            });
        }

        var stubGroupBeingEdited = null;
        self.onNewFolderSaveClick = function() {
            var stubName = $("#newStubModalNameInput").val();
            var description = $("#newStubModalDescInput").val();
            if (stubName == "") {
                $("#newStubModalNameInput").addClass("is-invalid");
                return
            }

            $("#wm-loading-saving-new-stub").css("visibility", "visible");

            if(stubGroupBeingEdited == null) {
                var newStubGroup = new StubGroup({
                    name: stubName,
                    description: description,
                    order: self.stubGroups().length
                });

                var json = ko.toJSON(newStubGroup);
                $.doHttpRequest("POST", "/api/stubgroup", json, function (data){
                    convertRequestResponseToStubGroup(data);
                    $('#newStubGroupModal').modal('hide');
                }).fail(function(res) {
                    console.error(res.responseText);
                }).always(function() {
                    $("#wm-loading-saving-new-stub").css("visibility", "hidden");
                });

            } else {
                var notObservable = ko.toJS(stubGroupBeingEdited);
                notObservable.name = stubName;
                notObservable.description = description;

                var json = ko.toJSON(notObservable);
                $.doHttpRequest("PATCH", "/api/stubgroup", json, function (data){
                    stubGroupBeingEdited.name(stubName);
                    stubGroupBeingEdited.description(description);

                    $('#newStubGroupModal').modal('hide');
                }).fail(function(res) {
                    console.error(res.responseText);
                }).always(function() {
                    $("#wm-loading-saving-new-stub").css("visibility", "hidden");
                });
            }
        }

        $('#newStubGroupModal').on('shown.bs.modal', function() {
            $('#newStubModalNameInput').trigger('focus');
        })

        $("#newStubGroupModal").on("hidden.bs.modal", function() {
            $('#newStubModalNameInput').val("");
            $('#newStubModalDescInput').val("");
            stubGroupBeingEdited = null;
        });
        /////////// new Stub Group ///////////////

        self.deleteStubGroup = function(stubGroup){
            $.confirmPrompt(
                "Você vai apagar esta pasta permanentemente. Tem certeza disso?",
                "Sim", function() {
                    $("#wm-full-screen-loading").css("visibility", "visible");

                    var json = ko.toJSON(stubGroup);
                    var url = "/api/stubgroup/" + stubGroup.id()
                    $.doHttpRequest("DELETE", url, json, function (data){
                      removeStubsFromTabEditor(stubGroup);
                      self.stubGroups.remove(stubGroup);
                    }).fail(function(res) {
                      console.error(res.responseText);
                    }).always(function() {
                      $("#wm-full-screen-loading").css("visibility", "hidden");
                    });
                },
                "Não", function() {}
            )
        }

        self.editStubGroup = function(stubGroup){
            $('#newStubGroupModal').modal({
                backdrop: 'static',
                keyboard: false
            });

            $('#newStubModalNameInput').val(stubGroup.name());
            $('#newStubModalDescInput').val(stubGroup.description());
            stubGroupBeingEdited = stubGroup;
        }

        self.duplicateStub = function(stubGroup, stub) {
            var stubCopy = ko.toJS(stub);
            stubCopy.id = 0;
            stubCopy.name += " (Cópia)";

            var json = ko.toJSON(stubCopy);
            var url = "/api/stubgroup/" + stubGroup.id() + "/stub"
            $.doHttpRequest("POST", url, json, function (data) {
                var newStub = convertRequestResponseToStub(data);
                stubGroup.stubs.push(newStub);
                $('#newStubGroupModal').modal('hide');
            }).fail(function(res) {
                console.error(res.responseText);
            }).always(function() {

            });
        }

        self.deleteStub = function(stubGroup, stub) {
            $.confirmPrompt(
                "Você vai apagar este stub permanentemente. Tem certeza disso?",
                "Sim", function() {
                    $("#wm-full-screen-loading").css("visibility", "visible");

                    var json = ko.toJSON(stubGroup);
                    var url = "/api/stub/" + stub.id();
                    $.doHttpRequest("DELETE", url, json, function (data){
                      removeStubFromTabEditor(stubGroup, stub);
                      stubGroup.stubs.remove(stub);
                    }).fail(function(res) {
                      console.error(res.responseText);
                    }).always(function() {
                      $("#wm-full-screen-loading").css("visibility", "hidden");
                    });
                },
                "Não", function() {}
            );
        }

        function removeStubFromTabEditor(stubGroup, stub) {
            self.tabStubEditors().forEach(function(tabEditor, index) {
                if (tabEditor.stubGroup() == stubGroup &&
                    tabEditor.stub() == stub) {
                    removeTabEditor(tabEditor);
                }
            });
        }

        function removeStubsFromTabEditor(stubGroup) {
            self.tabStubEditors().forEach(function(tabEditor, index) {
                if (tabEditor.stubGroup() == stubGroup) {
                    removeTabEditor(tabEditor);
                }
            });
        }

        self.newStub = function(stubGroup) {
            var stub = new Stub({
                name: "Novo Stub",
                order: stubGroup.stubs.length,
                stub: "{ \"request\":{\"urlPathPattern\" : \"\", \"method\":\"POST\", \"headers\":{ \"Content-Type\":{ \"contains\":\"application/json\" }, \"Authorization\":{ \"matches\":\"Bearer .*\" } }, \"bodyPatterns\":[ { \"matchesJsonPath\":\"$.[?($..field == 'value')]\" } ] }, \"response\":{ \"status\" : 200, \"jsonBody\" : { }, \"headers\" : { \"Content-Type\" : \"application/json\" } } }"
            });
            var json = ko.toJSON(stub);
            var url = "/api/stubgroup/" + stubGroup.id() + "/stub"
            $.doHttpRequest("POST", url, json, function (data) {
                var newStub = convertRequestResponseToStub(data);
                stubGroup.stubs.push(newStub);
                $('#newStubGroupModal').modal('hide');
            }).fail(function(res) {
                console.error(res.responseText);
            }).always(function() {

            });
        }

        self.removeTabEditor = function(tab) {
            if(self.tabStubEditors.indexOf(tab) !== -1) {
                self.tabStubEditors.remove(tab);

                if(tab.active() && lastTabStubEditorWithFocus != null) {
                    requestTabFocus(lastTabStubEditorWithFocus);
                }
            }
        }

        self.saveEditedStub = function(tabEditor){
            var button = $("#wm-stub-text-save")
            var spinner = $("#wm-stub-text-save > span")

            spinner.css("display", "")
            button.attr("disabled", true)

            var json = ko.toJSON(tabEditor.stub());
            var url = "/api/stubgroup/" + tabEditor.stubGroup().id() + "/stub"
            $.doHttpRequest("POST", url, json, function (data) {
                showToast("Operação realizada com sucesso!")
            }).fail(function(res) {
                showToast("Opa, deu um erro aqui: " + res.responseText)
                console.error(res.responseText);
            }).always(function() {
                spinner.css("display", "none")
                button.attr("disabled", false)
            });
        }

        /////////// Init functions ////////////
        self.loadStubGroups();
    };

    var vm = new ViewModel();
    ko.applyBindings(vm);
    //////////////////////////// knockout ///////////////////////////////

});
