tinymce.create("tinymce.plugins.magentovariable", {
  init: function (editor, url) {
    var self = this;

    editor.addCommand("openVariablesSlideout", function (commandConfig) {
      var selectedElement;

      if (commandConfig) {
        selectedElement = commandConfig.selectedElement;
      } else {
        selectedElement = tinymce.activeEditor.selection.getNode();
      }
      MagentovariablePlugin.setEditor(editor);
      MagentovariablePlugin.loadChooser(
        editor.settings.mvOpts.url,
        editor.settings.wysiwyg.getId(),
        selectedElement
      );
    });

    editor.ui.registry.addIcon(
      "magentovariable",
      '<img src="/extras/plugins/magentovariablespic" />'
    );

    editor.ui.registry.addButton("magentovariable", {
      title: jQuery.mage.__("Insert Variable"),
      tooltip: jQuery.mage.__("Insert Variable"),
      cmd: "openVariablesSlideout",
      icon: "magentovariable",
      onAction: function (evt) {
        editor.execCommand("openVariablesSlideout", {
          ui: true,
          selectedElement: evt.target,
        });
      },
    });

    editor.on("dblclick", function (evt) {
      if (jQuery(evt.target).hasClass("magento-variable")) {
        editor.selection.collapse(false);
        editor.execCommand("openVariablesSlideout", {
          ui: true,
          selectedElement: evt.target,
        });
      }
    });

    editor.settings.varienGlobalEvents.attachEventHandler(
      "wysiwygEncodeContent",
      function (content) {
        content = self.encodeVariables(content, editor);

        return content;
      }
    );

    editor.settings.varienGlobalEvents.attachEventHandler(
      "wysiwygDecodeContent",
      function (content) {
        content = self.decodeVariables(content, editor);

        return content;
      }
    );
  },

  encodeVariables: function (content, editor) {
    content = content.gsub(
      /\{\{config path=\"([^\"]+)\"\}\}/i,
      function (match) {
        var path = match[1],
          magentoVariables,
          imageHtml;

        magentoVariables = JSON.parse(editor.settings.mvOpts.placeholders);

        if (
          magentoVariables[match[1]] &&
          magentoVariables[match[1]]["variable_type"] === "default"
        ) {
          imageHtml =
            '<span id="%id" class="magento-variable magento-placeholder mceNonEditable">' +
            "%s</span>";
          imageHtml = imageHtml.replace(
            "%s",
            magentoVariables[match[1]]["variable_name"]
          );
        } else {
          imageHtml =
            '<span id="%id" class="' +
            "magento-variable magento-placeholder magento-placeholder-error " +
            "mceNonEditable" +
            '">' +
            "Not found" +
            "</span>";
        }

        return imageHtml.replace("%id", Base64.idEncode(path));
      }
    );

    content = content.gsub(
      /\{\{customVar code=([^\}\"]+)\}\}/i,
      function (match) {
        var path = match[1],
          magentoVariables,
          imageHtml;

        magentoVariables = JSON.parse(editor.settings.mvOpts.placeholders);

        if (
          magentoVariables[match[1]] &&
          magentoVariables[match[1]]["variable_type"] === "custom"
        ) {
          imageHtml =
            '<span id="%id" class="magento-variable magento-custom-var magento-placeholder ' +
            'mceNonEditable">%s</span>';
          imageHtml = imageHtml.replace(
            "%s",
            magentoVariables[match[1]]["variable_name"]
          );
        } else {
          imageHtml =
            '<span id="%id" class="' +
            "magento-variable magento-custom-var magento-placeholder " +
            "magento-placeholder-error mceNonEditable" +
            '">' +
            match[1] +
            "</span>";
        }

        return imageHtml.replace("%id", Base64.idEncode(path));
      }
    );

    return content;
  },

  decodeVariables: function (content, editor) {
    var doc = new DOMParser().parseFromString(
        content.replace(/&quot;/g, "&amp;quot;"),
        "text/html"
      ),
      returnval = "";

    [].forEach.call(
      doc.querySelectorAll("span.magento-variable"),
      function (el) {
        var $el = jQuery(el);

        if ($el.hasClass("magento-custom-var")) {
          $el.replaceWith(
            editor.settings.customDirectiveGenerator.processConfig(
              Base64.idDecode($el.attr("id"))
            )
          );
        } else {
          $el.replaceWith(
            editor.settings.configDirectiveGenerator.processConfig(
              Base64.idDecode($el.attr("id"))
            )
          );
        }
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

tinymce.PluginManager.add("magentovariable", tinymce.plugins.magentovariable);
