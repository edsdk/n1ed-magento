define([
  "jquery",
  "underscore",
  "mage/adminhtml/events",
  "mage/adminhtml/wysiwyg/events",
  "Magento_Variable/js/config-directive-generator",
  "Magento_Variable/js/custom-directive-generator",
], function (
  jQuery,
  _,
  varienGlobalEvents,
  wysiwygEvents,
  configDirectiveGenerator,
  customDirectiveGenerator
) {
  "use strict";

  var tinyMce4Wysiwyg = Class.create();

  tinyMce4Wysiwyg.prototype = {
    mediaBrowserOpener: null,
    mediaBrowserTargetElementId: null,
    magentoVariablesPlugin: null,
    mode: "exact",

    /**
     * @param {*} htmlId
     * @param {Object} config
     */
    initialize: function (htmlId, config) {
      if (URLPrecedingsDetect()) {
        this.adminURL = URLPrecedingsDetect() + "/" + findAdminURL();
      } else {
        this.adminURL = findAdminURL();
      }

      var authUrl = "/" + this.adminURL + "/edsdk/auth/get";

      var request = new XMLHttpRequest();
      request.open("GET", authUrl, false); // `false` makes the request synchronous
      request.send(null);
      var apiKey = JSON.parse(request.responseText).apiKey;
      var token = JSON.parse(request.responseText).token;

      includeJS(
        "https://cloud.n1ed.com/cdn/" + apiKey + "/n1tinymce.js",
        document,
        function () {}
      );

      this.id = htmlId;
      this.config = config;
      this.config.apiKey = apiKey;
      this.config.token = token;

      _.bindAll(
        this,

        "initialize",
        "onUndo",
        "setup",
        "removeEvents",
        "addPluginToToolbar",
        "setToolbarStatus",
        "getSettings",
        "get",
        "getId",
        "activeEditor",
        "insertContent",
        "setContent",
        "setCaretOnElement",
        "openFileBrowser",
        "translate",
        "getMediaBrowserOpener",
        "getMediaBrowserTargetElementId",
        "getToggleButton",
        "getPluginButtons",
        "turnOn",
        "closeEditorPopup",
        "turnOff",
        "closePopups",
        "toggle",
        "onFormValidation",
        "onChangeContent",
        "beforeSetContent",
        "saveContent",
        "getContent",
        "getAdapterPrototype",
        "fixRangeSelection",
        "updateTextArea",
        "getTextArea",
        "setEnabledStatus",
        "makeDirectiveUrl",
        "encodeDirectives",
        "decodeDirectives",
        "parseAttributesString",
        "decodeContent",
        "encodeContent",
        "addContentEditableAttributeBackToNonEditableNodes"
      );

      varienGlobalEvents.attachEventHandler(
        "tinymceChange",
        this.onChangeContent
      );
      varienGlobalEvents.attachEventHandler(
        "tinymceBeforeSetContent",
        this.beforeSetContent
      );
      varienGlobalEvents.attachEventHandler(
        "tinymceSetContent",
        this.updateTextArea
      );
      varienGlobalEvents.attachEventHandler(
        "tinymceSaveContent",
        this.saveContent
      );
      varienGlobalEvents.attachEventHandler("tinymceUndo", this.onUndo);

      if (typeof tinyMceEditors === "undefined") {
        window.tinyMceEditors = $H({});
      }

      tinyMceEditors.set(this.id, this);
    },

    /**
     * Ensures the undo operation works properly
     */
    onUndo: function () {
      this.addContentEditableAttributeBackToNonEditableNodes();
    },

    /**
     * Setup TinyMCE4 editor
     */
    setup: function (mode) {
      var self = this;
      var deferreds = [];

      function setupNow(settings) {
        n1tinymce.init(settings);
      }

      function waitForEditor(settings) {
        if (window.n1tinymce) {
          setupNow(settings);
        } else {
          setTimeout(function () {
            waitForEditor(settings);
          }, 100);
        }
      }

      waitForEditor(this.getSettings());
    },

    /**
     * Remove events from instance.
     *
     * @param {String} wysiwygId
     */
    removeEvents: function (wysiwygId) {
      var editor;

      if (
        typeof tinyMceEditors !== "undefined" &&
        tinyMceEditors.get(wysiwygId)
      ) {
        editor = tinyMceEditors.get(wysiwygId);
        varienGlobalEvents.removeEventHandler(
          "tinymceChange",
          editor.onChangeContent
        );
      }
    },

    /**
     * Add plugin to the toolbar if not added.
     *
     * @param {String} plugin
     * @param {String} separator
     */
    addPluginToToolbar: function (plugin, separator) {
      var plugins = this.config.tinymce4.plugins.split(" "),
        toolbar = this.config.tinymce4.toolbar.split(" ");

      if (plugins.indexOf(plugin) === -1) {
        plugins.push(plugin);
      }

      if (toolbar.indexOf(plugin) === -1) {
        toolbar.push(separator || "", plugin);
      }

      this.config.tinymce4.plugins = plugins.join(" ");
      this.config.tinymce4.toolbar = toolbar.join(" ");
    },

    /**
     * Set the status of the toolbar to disabled or enabled (true for enabled,
     * false for disabled)
     * @param {Boolean} enabled
     */
    setToolbarStatus: function (enabled) {
      var controlIds = this.get(this.getId()).theme.panel.rootControl
        .controlIdLookup;

      _.each(controlIds, function (controlId) {
        controlId.disabled(!enabled);
        controlId.canFocus = enabled;

        if (controlId.tooltip) {
          controlId.tooltip().state.set("rendered", enabled);

          if (enabled) {
            jQuery(controlId.getEl())
              .children("button")
              .andSelf()
              .removeAttr("style");
          } else {
            jQuery(controlId.getEl())
              .children("button")
              .andSelf()
              .attr(
                "style",
                "color: inherit;" +
                  "background-color: inherit;" +
                  "border-color: transparent;"
              );
          }
        }
      });
    },

    /**
     * @return {Object}
     */
    getSettings: function () {
      var settings,
        eventBus = this.eventBus;

      var mwi = this.config.plugins.findIndex(function (plugin) {
        return plugin.name == "magentowidget";
      });
      var mvi = this.config.plugins.findIndex(function (plugin) {
        return plugin.name == "magentovariable";
      });

      // debugger;

      var toolbar;
      var mwOpts;
      var mvOpts;
      var external_plugins;

      if (mvi != -1 && mwi != -1) {
        mwOpts = this.config.plugins[mwi].options;
        mvOpts = this.config.plugins[mvi].options;
        external_plugins = {
          magentowidget: "/extras/plugins/magentowidgets",
          magentovariable: "/extras/plugins/magentovariables",
        };
        toolbar = [
          "cut copy | undo redo | searchreplace | bold italic strikethrough | forecolor backcolor | blockquote | removeformat",
          "formatselect | link | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | magentowidget magentovariable",
        ];
      } else {
        mwOpts = null;
        mvOpts = null;
        external_plugins = null;
        toolbar = [
          "cut copy | undo redo | searchreplace | bold italic strikethrough | forecolor backcolor | blockquote | removeformat",
          "formatselect | link | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent",
        ];
      }

      var flmngrURL = "/" + this.adminURL + "/edsdk/flmngr/flmngr";
      settings = {
        selector: "#" + this.getId(),
        integration: "magento",
        urlFileManager: flmngrURL,
        urlFileManager__CSRF: {
          params: {
            form_key: window.FORM_KEY,
          },
        },
        urlFiles: "/pub/media/wysiwyg/",
        relative_urls: false,
        apiKey: this.config.apiKey,
        token: this.config.token,
        varienGlobalEvents: varienGlobalEvents,
        configDirectiveGenerator: configDirectiveGenerator,
        customDirectiveGenerator: customDirectiveGenerator,
        bootstrap4: {
          includeToGlobalDoc: false,
        },
        wysiwyg: this,
        mwOpts: mwOpts,
        mvOpts: mvOpts,
        external_plugins: external_plugins,
        toolbar: toolbar,

        /**
         * @param {Object} editor
         */
        setup: function (editor) {
          var onChange;

          editor.on("BeforeSetContent", function (evt) {
            varienGlobalEvents.fireEvent("tinymceBeforeSetContent", evt);
            eventBus.fireEvent(wysiwygEvents.beforeSetContent);
          });

          editor.on("SaveContent", function (evt) {
            varienGlobalEvents.fireEvent("tinymceSaveContent", evt);
            eventBus.fireEvent(wysiwygEvents.afterSave);
          });

          editor.on("paste", function (evt) {
            varienGlobalEvents.fireEvent("tinymcePaste", evt);
            eventBus.fireEvent(wysiwygEvents.afterPaste);
          });

          editor.on("PostProcess", function (evt) {
            varienGlobalEvents.fireEvent("tinymceSaveContent", evt);
            eventBus.fireEvent(wysiwygEvents.afterSave);
          });

          editor.on("undo", function (evt) {
            varienGlobalEvents.fireEvent("tinymceUndo", evt);
            eventBus.fireEvent(wysiwygEvents.afterUndo);
          });

          editor.on("focus", function () {
            eventBus.fireEvent(wysiwygEvents.afterFocus);
          });

          editor.on("blur", function () {
            eventBus.fireEvent(wysiwygEvents.afterBlur);
          });

          /**
           * @param {*} evt
           */
          onChange = function (evt) {
            varienGlobalEvents.fireEvent("tinymceChange", evt);
            eventBus.fireEvent(wysiwygEvents.afterChangeContent);
          };

          editor.on("Change", onChange);
          editor.on("keyup", onChange);

          editor.on("ExecCommand", function (cmd) {
            varienGlobalEvents.fireEvent("tinymceExecCommand", cmd);
          });

          editor.on("init", function (args) {
            varienGlobalEvents.fireEvent(
              "wysiwygEditorInitialized",
              args.target
            );
            eventBus.fireEvent(wysiwygEvents.afterInitialization);
          });
        },
      };

      if (this.config.skin) {
        settings.skin = this.config.skin;
      }

      if (this.config.baseStaticUrl && this.config.baseStaticDefaultUrl) {
        settings["document_base_url"] = this.config.baseStaticUrl;
      }
      // Set the document base URL
      if (this.config["document_base_url"]) {
        settings["document_base_url"] = this.config["document_base_url"];
      }

      if (this.config.width) {
        settings.width = this.config.width;
      }

      if (this.config.height) {
        settings.height = this.config.height;
      }

      if (this.config.plugins) {
        settings.magentoPluginsOptions = {};

        _.each(this.config.plugins, function (plugin) {
          settings.magentoPluginsOptions[plugin.name] = plugin.options;
        });
      }

      if (this.config.settings) {
        Object.extend(settings, this.config.settings);
      }

      return settings;
    },

    /**
     * @param {String} id
     */
    get: function (id) {
      return n1tinymce.get(id);
    },

    /**
     * @return {String|null}
     */
    getId: function () {
      return (
        this.id ||
        (this.activeEditor() ? this.activeEditor().id : null) ||
        tinyMceEditors.values()[0].id
      );
    },

    /**
     * @return {Object}
     */
    activeEditor: function () {
      return n1tinymce.activeEditor;
    },

    /**
     * Insert content to active editor.
     *
     * @param {String} content
     * @param {Boolean} ui
     */
    insertContent: function (content, ui) {
      this.activeEditor().execCommand(
        "mceInsertContent",
        typeof ui !== "undefined" ? ui : false,
        content
      );
    },

    /**
     * Replace entire contents of wysiwyg with string content parameter
     *
     * @param {String} content
     */
    setContent: function (content) {
      this.get(this.getId()).setContent(content);
    },

    /**
     * Set caret location in WYSIWYG editor.
     *
     * @param {Object} targetElement
     */
    setCaretOnElement: function (targetElement) {
      this.activeEditor().selection.select(targetElement);
      this.activeEditor().selection.collapse();
    },

    /**
     * @param {Object} o
     */
    openFileBrowser: function (o) {
      var typeTitle = this.translate("Select Images"),
        storeId = this.config["store_id"] ? this.config["store_id"] : 0,
        frameDialog = jQuery('div.mce-container[role="dialog"]'),
        self = this,
        wUrl =
          this.config["files_browser_window_url"] +
          "target_element_id/" +
          this.getId() +
          "/" +
          "store/" +
          storeId +
          "/";

      this.mediaBrowserOpener = o.win;
      this.mediaBrowserTargetElementId = o.field;

      if (typeof o.type !== "undefined" && o.type !== "") {
        //eslint-disable-line eqeqeq
        wUrl = wUrl + "type/" + o.type + "/";
      }

      frameDialog.hide();
      jQuery("#mce-modal-block").hide();

      require(["mage/adminhtml/browser"], function () {
        MediabrowserUtility.openDialog(wUrl, false, false, typeTitle, {
          /**
           * Closed.
           */
          closed: function () {
            frameDialog.show();
            jQuery("#mce-modal-block").show();
          },

          targetElementId: self.activeEditor() ? self.activeEditor().id : null,
        });
      });
    },

    /**
     * @param {String} string
     * @return {String}
     */
    translate: function (string) {
      return jQuery.mage.__ ? jQuery.mage.__(string) : string;
    },

    /**
     * @return {null}
     */
    getMediaBrowserOpener: function () {
      return this.mediaBrowserOpener;
    },

    /**
     * @return {null}
     */
    getMediaBrowserTargetElementId: function () {
      return this.mediaBrowserTargetElementId;
    },

    /**
     * @return {jQuery|*|HTMLElement}
     */
    getToggleButton: function () {
      return $("toggle" + this.getId());
    },

    /**
     * Get plugins button.
     */
    getPluginButtons: function () {
      return jQuery("#buttons" + this.getId() + " > button.plugin");
    },

    /**
     * @param {*} mode
     * @return {wysiwygSetup}
     */
    turnOn: function (mode) {
      this.closePopups();

      this.setup(mode);

      this.getPluginButtons().hide();

      n1tinymce.execCommand("mceAddControl", false, this.getId());

      return this;
    },

    /**
     * @param {String} name
     */
    closeEditorPopup: function (name) {
      if (
        typeof popups !== "undefined" &&
        popups[name] !== undefined &&
        !popups[name].closed
      ) {
        popups[name].close();
      }
    },

    /**
     * @return {wysiwygSetup}
     */
    turnOff: function () {
      this.closePopups();

      this.getPluginButtons().show();

      n1tinymce.execCommand("mceRemoveEditor", false, this.getId());

      return this;
    },

    /**
     * Close popups.
     */
    closePopups: function () {
      // close all popups to avoid problems with updating parent content area
      varienGlobalEvents.fireEvent("wysiwygClosePopups");
      this.closeEditorPopup("browser_window" + this.getId());
    },

    /**
     * @return {Boolean}
     */
    toggle: function () {
      var content;

      if (!n1tinymce.get(this.getId())) {
        this.turnOn();

        return true;
      }

      content = this.get(this.getId())
        ? this.get(this.getId()).getContent()
        : this.getTextArea().val();

      this.turnOff();

      if (content.match(/{{.+?}}/g)) {
        this.getTextArea().val(content.replace(/&quot;/g, '"'));
      }

      return false;
    },

    /**
     * On form validation.
     */
    onFormValidation: function () {
      if (n1tinymce.get(this.getId())) {
        $(this.getId()).value = n1tinymce.get(this.getId()).getContent();
      }
    },

    /**
     * On change content.
     */
    onChangeContent: function () {
      // Add "changed" to tab class if it exists
      var tab;

      this.updateTextArea();

      if (this.config["tab_id"]) {
        tab = $$("a[id$=" + this.config["tab_id"] + "]")[0];

        if ($(tab) != undefined && $(tab).hasClassName("tab-item-link")) {
          //eslint-disable-line eqeqeq
          $(tab).addClassName("changed");
        }
      }
    },

    /**
     * @param {Object} o
     */
    beforeSetContent: function (o) {
      o.content = this.encodeContent(o.content);
    },

    /**
     * @param {Object} o
     */
    saveContent: function (o) {
      o.content = this.decodeContent(o.content);
    },

    /**
     * Return the content stored in the WYSIWYG field
     * @param {String} id
     * @return {String}
     */
    getContent: function (id) {
      return id
        ? this.get(id).getContent()
        : this.get(this.getId()).getContent();
    },

    /**
     * @returns {Object}
     */
    getAdapterPrototype: function () {
      return tinyMce4Wysiwyg;
    },

    /**
     * Fix range selection placement when typing.  This fixes MAGETWO-84769
     * @param {Object} editor
     */
    fixRangeSelection: function (editor) {
      var selection = editor.selection,
        dom = editor.dom,
        rng = dom.createRng(),
        doc = editor.getDoc(),
        markerHtml,
        marker;

      // Validate the range we're trying to fix is contained within the current
      // editors document
      if (
        !selection.getContent().length &&
        jQuery.contains(doc, selection.getRng().startContainer)
      ) {
        markerHtml =
          '<span id="mce_marker" data-mce-type="bookmark">\uFEFF</span>';
        selection.setContent(markerHtml);
        marker = dom.get("mce_marker");
        rng.setStartBefore(marker);
        rng.setEndBefore(marker);
        dom.remove(marker);
        selection.setRng(rng);
      }
    },

    /**
     * Update text area.
     */
    updateTextArea: function () {
      var editor = this.get(this.getId()),
        content;

      if (!editor || editor.id !== this.activeEditor().id) {
        return;
      }

      this.addContentEditableAttributeBackToNonEditableNodes();

      content = editor.getContent();
      content = this.decodeContent(content);

      this.getTextArea().val(content).trigger("change");
    },

    /**
     * @return {Object} jQuery textarea element
     */
    getTextArea: function () {
      return jQuery("#" + this.getId());
    },

    /**
     * Set the status of the editor and toolbar
     *
     * @param {Boolean} enabled
     */
    setEnabledStatus: function (enabled) {
      if (this.activeEditor()) {
        this.activeEditor().getBody().setAttribute("contenteditable", enabled);
        this.activeEditor().readonly = !enabled;
        this.setToolbarStatus(enabled);
      }

      if (enabled) {
        this.getTextArea().removeProp("disabled");
      } else {
        this.getTextArea().prop("disabled", "disabled");
      }
    },

    /**
     * Retrieve directives URL with substituted directive value.
     *
     * @param {String} directive
     */
    makeDirectiveUrl: function (directive) {
      return this.config["directives_url"]
        .replace(/directive/, "directive/___directive/" + directive)
        .replace(/\/$/, "");
    },

    /**
     * Convert {{directive}} style attributes syntax to absolute URLs
     * @param {Object} content
     * @return {*}
     */
    encodeDirectives: function (content) {
      // collect all HTML tags with attributes that contain directives
      return content.gsub(
        /<([a-z0-9\-\_]+[^>]+?)([a-z0-9\-\_]+="[^"]*?\{\{.+?\}\}.*?".*?)>/i,
        function (match) {
          var attributesString = match[2],
            decodedDirectiveString;

          // process tag attributes string
          attributesString = attributesString.gsub(
            /([a-z0-9\-\_]+)="(.*?)(\{\{.+?\}\})(.*?)"/i,
            function (m) {
              decodedDirectiveString = encodeURIComponent(
                Base64.mageEncode(m[3].replace(/&quot;/g, '"') + m[4])
              );

              return (
                m[1] +
                '="' +
                m[2] +
                this.makeDirectiveUrl(decodedDirectiveString) +
                '"'
              );
            }.bind(this)
          );

          return "<" + match[1] + attributesString + ">";
        }.bind(this)
      );
    },

    /**
     * Convert absolute URLs to {{directive}} style attributes syntax
     * @param {Object} content
     * @return {*}
     */
    decodeDirectives: function (content) {
      var directiveUrl = this.makeDirectiveUrl("%directive%").split("?")[0], // remove
        // query
        // string
        // from
        // directive
        // escape special chars in directives url to use in regular expression
        regexEscapedDirectiveUrl = directiveUrl.replace(
          /([$^.?*!+:=()\[\]{}|\\])/g,
          "\\$1"
        ),
        regexDirectiveUrl =
          regexEscapedDirectiveUrl.replace(
            "%directive%",
            '([a-zA-Z0-9,_-]+(?:%2[A-Z]|)+/?)(?:(?!").)*'
          ) + '/?(\\\\?[^"]*)?', // allow optional query string
        reg = new RegExp(regexDirectiveUrl);

      return content.gsub(reg, function (match) {
        return Base64.mageDecode(
          decodeURIComponent(match[1]).replace(/\/$/, "")
        ).replace(/"/g, "&quot;");
      });
    },

    /**
     * @param {Object} attributes
     * @return {Object}
     */
    parseAttributesString: function (attributes) {
      var result = {};

      // Decode &quot; entity, as regex below does not support encoded quote
      attributes = attributes.replace(/&quot;/g, '"');

      attributes.gsub(
        /(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/,
        function (match) {
          result[match[1]] = match[2];
        }
      );

      return result;
    },

    /**
     * @param {Object} content
     * @return {*}
     */
    decodeContent: function (content) {
      if (this.config["add_directives"]) {
        content = this.decodeDirectives(content);
      }

      content = varienGlobalEvents.fireEventReducer(
        "wysiwygDecodeContent",
        content
      );

      return content;
    },

    /**
     * @param {Object} content
     * @return {*}
     */
    encodeContent: function (content) {
      if (this.config["add_directives"]) {
        content = this.encodeDirectives(content);
      }

      content = varienGlobalEvents.fireEventReducer(
        "wysiwygEncodeContent",
        content
      );

      return content;
    },

    /**
     * Reinstate contenteditable attributes on .mceNonEditable nodes
     */
    addContentEditableAttributeBackToNonEditableNodes: function () {
      jQuery(".mceNonEditable", this.activeEditor().getDoc()).attr(
        "contenteditable",
        false
      );
    },
  };

  return tinyMce4Wysiwyg.prototype;
});

function includeJS(urlJS, doc, callback) {
  if (!doc) {
    doc = document;
  }
  var scripts = doc.getElementsByTagName("script");
  var alreadyExists = false;
  var existingScript = null;
  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].getAttribute("src");
    if (src && src.indexOf(urlJS) !== -1) {
      alreadyExists = true;
      existingScript = scripts[i];
    }
  }
  if (!alreadyExists) {
    var script = doc.createElement("script");
    script.type = "text/javascript";
    if (callback != null) {
      if (script.readyState) {
        // IE
        script.onreadystatechange = function () {
          if (
            script.readyState === "loaded" ||
            script.readyState === "compvare"
          ) {
            script.onreadystatechange = null;
            callback(false);
          }
        };
      } else {
        // Others
        script.onload = function () {
          callback(false);
        };
      }
    }
    script.src = urlJS;
    doc.getElementsByTagName("head")[0].appendChild(script);
    return script;
  } else {
    if (callback != null) {
      callback(true);
    }
    return null;
  }
}

function findAdminURL() {
  var regexp = new RegExp("admin*");
  var path = window.location.pathname.split("/");
  return path.find(function (p) {
    return regexp.test(p);
  });
}

function URLPrecedingsDetect() {
  // var regexp = new RegExp("index.php");
  var path = window.location.pathname.split("/");
  return path.find(function (p) {
    return p == "index.php";
  });
}
