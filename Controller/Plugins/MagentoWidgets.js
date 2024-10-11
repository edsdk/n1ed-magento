tinymce.create("tinymce.plugins.magentowidget", {
  init: function (editor, url) {
    var self = this;

    this.activePlaceholder = null;

    editor.addCommand("mceMagentowidget", function (img) {
      if (self.activePlaceholder) {
        img = self.activePlaceholder;
      }

      widgetTools.setActiveSelectedNode(img);
      widgetTools.openDialog(
        editor.settings.mwOpts["window_url"] +
          "widget_target_id/" +
          editor.getElement().id +
          "/"
      );
    });
    editor.ui.registry.addIcon(
      "magentowidgets",
      '<img src="/extras/plugins/magentowidgetspic" />'
    );

    editor.ui.registry.addButton("magentowidget", {
      title: jQuery.mage.__("Insert Widget"),
      cmd: "mceMagentowidget",
      icon: "magentowidgets",
      onAction: function () {
        editor.execCommand("mceMagentowidget", null);
      },
    });

    editor.on("dblClick", function (e) {
      var placeholder = e.target;

      if (self.isWidgetPlaceholderSelected(placeholder)) {
        widgetTools.setEditMode(true);
        editor.execCommand("mceMagentowidget", null);
      }
    });

    (window.varienGlobalEvents || editor.settings.varienGlobalEvents).attachEventHandler(
      "wysiwygEncodeContent",
      function (content) {
        // debugger;
        content = self.encodeWidgets(
          self.decodeWidgets(content, editor),
          editor
        );
        content = self.removeDuplicateAncestorWidgetSpanElement(content);

        return content;
      }
    );

    (window.varienGlobalEvents || editor.settings.varienGlobalEvents).attachEventHandler(
      "wysiwygDecodeContent",
      function (content) {
        content = self.decodeWidgets(content, editor);

        return content;
      }
    );

    (window.varienGlobalEvents || editor.settings.varienGlobalEvents).attachEventHandler(
      "wysiwygClosePopups",
      function () {
        editor.settings.wysiwyg.closeEditorPopup(
          "widget_window" + editor.settings.wysiwyg.getId()
        );
      }
    );
  },

  isWidgetPlaceholderSelected: function (placeholder) {
    var isSelected = false;

    if (
      placeholder.nodeName &&
      (placeholder.nodeName === "SPAN" || placeholder.nodeName === "IMG") &&
      placeholder.className &&
      placeholder.className.indexOf("magento-widget") !== -1
    ) {
      this.activePlaceholder = placeholder;
      isSelected = true;
    } else {
      this.activePlaceholder = null;
    }

    return isSelected;
  },

  encodeWidgets: function (content, editor) {
    return content.gsub(/\{\{widget(.*?)\}\}/i, function (match) {
      var attributes = editor.settings.wysiwyg.parseAttributesString(match[1]),
        imageSrc,
        imageHtml = "";

      if (attributes.type) {
        attributes.type = attributes.type.replace(/\\\\/g, "\\");
        imageSrc = editor.settings.mwOpts.placeholders[attributes.type];

        if (imageSrc) {
          imageHtml +=
            '<span class="magento-placeholder magento-widget mceNonEditable" ' +
            'contenteditable="false">';
        } else {
          imageSrc = editor.settings.mwOpts["error_image_url"];
          imageHtml +=
            "<span " +
            'class="magento-placeholder magento-placeholder-error magento-widget mceNonEditable" ' +
            'contenteditable="false">';
        }

        imageHtml += "<img";
        imageHtml += ' id="' + Base64.idEncode(match[0]) + '"';
        imageHtml += ' src="' + imageSrc + '"';
        imageHtml += " />";

        if (editor.settings.mwOpts.types[attributes.type]) {
          imageHtml += editor.settings.mwOpts.types[attributes.type];
        }

        imageHtml += "</span>";

        return imageHtml;
      }
    });
  },

  /**
   * Convert image placeholder HTML to {{widget}} style syntax
   * @param {String} content
   * @return {*}
   */
  decodeWidgets: function (content, editor) {
    return content.gsub(
      /(<span class="[^"]*magento-widget[^"]*"[^>]*>)?<img([^>]+id="[^>]+)>(([^>]*)<\/span>)?/i,
      function (match) {
        var attributes = editor.settings.wysiwyg.parseAttributesString(
            match[2]
          ),
          widgetCode,
          result = match[0];

        if (attributes.id) {
          try {
            widgetCode = Base64.idDecode(attributes.id);
          } catch (e) {
            // Ignore and continue.
          }

          if (widgetCode && widgetCode.indexOf("{{widget") !== -1) {
            result = widgetCode;
          }
        }

        return result;
      }
    );
  },

  /**
   * Tinymce has strange behavior with html and this removes one of its side-effects
   * @param {String} content
   * @return {String}
   */
  removeDuplicateAncestorWidgetSpanElement: function (content) {
    var parser,
      doc,
      returnval = "";

    if (!window.DOMParser) {
      return content;
    }

    parser = new DOMParser();
    doc = parser.parseFromString(
      content.replace(/&quot;/g, "&amp;quot;"),
      "text/html"
    );

    [].forEach.call(
      doc.querySelectorAll(".magento-widget"),
      function (widgetEl) {
        var widgetChildEl = widgetEl.querySelector(".magento-widget");

        if (!widgetChildEl) {
          return;
        }

        [].forEach.call(widgetEl.childNodes, function (el) {
          widgetEl.parentNode.insertBefore(el, widgetEl);
        });

        widgetEl.parentNode.removeChild(widgetEl);
      }
    );

    returnval += doc.head
      ? doc.head.innerHTML.replace(/&amp;quot;/g, "&quot;")
      : "";
    returnval += doc.body
      ? doc.body.innerHTML.replace(/&amp;quot;/g, "&quot;")
      : "";

    return returnval ? returnval : content;
  },
});

tinymce.PluginManager.add("magentowidget", tinymce.plugins.magentowidget);
