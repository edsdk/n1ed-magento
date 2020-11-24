
/* global varienGlobalEvents, tinyMceEditors, MediabrowserUtility, closeEditorPopup, Base64 */
/* eslint-disable strict */
define([
  'jquery',
  'underscore',
  'mage/translate',
  'prototype',
  'mage/adminhtml/events',
  'jquery/ui'
], function (jQuery, _) {

  var n1ed = Class.create();

  n1ed.prototype = {
    mediaBrowserOpener: null,
    mediaBrowserTargetElementId: null,

    /**
     * @param {*} htmlId
     * @param {Object} config
     */
    initialize: function (id, config) {

      this.id = id;
      this.config = config;

      //includeJS("https://cloud.n1ed.com/cdn/EOEUDFLT/n1tinymce-iframe.js", document, function() {});

      includeJS("https://cloud.n1ed.com/cdn/EOEUDFLT/n1tinymce.js", document, function() {});
      //includeJS("https://local.cloud.n1ed.com/cdn/ATVGDFLT/n1tinymce.js", document, function() {});
    },

    /**
     * @param {*} mode
     */
    setup: function (mode) {

      /*function setupNow(id, config) {
        var elTextArea = document.getElementById(id);
        let elIFrame = window.initEditorInIFrame(elTextArea, config);
        elIFrame.style.width = "1000px";
        elIFrame.style.height = "800px";
      }

      function waitForEditor(id, config) {
        if (window.initEditorInIFrame)
          setupNow(id, config);
        else {
          setTimeout(function () {
            waitForEditor(id, config);
          }, 100);
        }
      }*/

      function setupNow(id, config) {

        tinymce.init({
          selector: "#" + id,
          //urlFileManager: "/flmngr.php",
          "bootstrap4": {
            "includeToGlobalDoc": false
          }
        });
      }

      function waitForEditor(id, config) {
        if (window.tinymce)
          setupNow(id, config);
        else {
          setTimeout(function () {
            waitForEditor(id, config);
          }, 100);
        }
      }

      waitForEditor(this.id, this.config);

    },

    /**
     * Insert content to active editor.
     *
     * @param {String} content
     * @param {Boolean} ui
     */
    /*insertContent: function (content, ui) {
      this.activeEditor().insertText(content);
    },*/

    /**
     * @param {Object} o
     */
    openFileBrowser: function (o) {
    },

    /**
     * Encodes the content so it can be inserted into the wysiwyg
     * @param {String} content - The content to be encoded
     *
     * @returns {*} - The encoded content
     */
    updateContent: function (content) {
    },

    /**
     * On form validation.
     */
    onFormValidation: function () {
      /*if (tinyMCE4.get(this.id)) {
        $(this.id).value = tinyMCE4.get(this.id).getContent();
      }*/
    },
    /**
     * @param {String} id
     */
    get: function (id) {
      //return ckeditor4.instances[id];
    },

    /**
     * @return {Object}
     */
    activeEditor: function () {
      /*var activeInstance = false;
      _.each(ckeditor4.instances, function (instance) {
        if (instance.activeEnterMode === 1) {
          activeInstance = instance;
          instance.getBookmark = function () {
            return null;
          };
          instance.moveToBookmark = function () {
            return instance;
          };
          instance.getNode = function () {
            return instance.getSelection();
          };
          instance.getNode = function () {
            return instance.getSelection();
          };
          activeInstance.selection = instance;

        }
      });
      return activeInstance;*/
    },

    /**
     * @param {*} mode
     * @return {tinyMceWysiwygSetup}
     */
    turnOn: function (mode) {
    },

    /**
     * @return {tinyMceWysiwygSetup}
     */
    turnOff: function () {

      return this;
    },

    /**
     * Retrieve directives URL with substituted directive value.
     *
     * @param {String} directive
     */
    makeDirectiveUrl: function (directive) {

    },

    /**
     * @param {Object} content
     * @return {*}
     */
    encodeDirectives: function (content) {

    },

    /**
     * @param {Object} content
     * @return {*}
     */
    encodeWidgets: function (content) {

    },

    /**
     * @param {Object} content
     * @return {*}
     */
    decodeDirectives: function (content) {

    },

    /**
     * @param {Object} content
     * @return {*}
     */
    decodeWidgets: function (content) {

    },

    /**
     * @param {Object} attributes
     * @return {Object}
     */
    parseAttributesString: function (attributes) {

    },

    /**
     * Update text area.
     */
    updateTextArea: function () {

    },
    setCaretOnElement: function (targetElement) {
      /*this.activeEditor().selection.select(targetElement);
      this.activeEditor().selection.collapse();*/
    },

    /**
     * @param {Object} content
     * @return {*}
     */
    decodeContent: function (content) {

    },

    /**
     * @return {Boolean}
     */
    toggle: function () {
      //return this.wysiwygInstance.toggle();
    },

    /**
     * @param {Object} content
     * @return {*}
     */
    encodeContent: function (content) {
    },

    /**
     * @param {Object} o
     */
    beforeSetContent: function (o) {

    },

    /**
     * @param {Object} o
     */
    saveContent: function (o) {

    },

    /**
     * @returns {Object}
     */
    getAdapterPrototype: function () {
      return n1ed;
    },

    /**
     * Return the content stored in the WYSIWYG field
     * @param {String} id
     * @return {String}
     */
    getContent: function (id) {
      return 'ccc';
    }
  };

  return n1ed.prototype;
});



function includeJS(urlJS, doc, callback) {
  if (!doc)
    doc = document;
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
      if (script.readyState) {  // IE
        script.onreadystatechange = function () {
          if (script.readyState === "loaded" || script.readyState === "complete") {
            script.onreadystatechange = null;
            callback(false);
          }
        };
      } else {  // Others
        script.onload = function () {
          callback(false);
        };
      }
    }
    script.src = urlJS;
    doc.getElementsByTagName("head")[0].appendChild(script);
    return script;
  } else {
    if (callback != null)
      callback(true);
    return null;
  }
}