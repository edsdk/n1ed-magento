tinymce.create("tinymce.plugins.magentovariable", {
    /**
     * Initialize editor plugin.
     *
     * @param {tinymce.editor} editor - Editor instance that the plugin is initialized in.
     * @param {String} url - Absolute URL to where the plugin is located.
     */
    init: function (editor, url) {
        var self = this;
        /**
         * Add new command to open variables selector slideout.
         */
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

        /**
         * Add button to the editor toolbar.
         */
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

        /**
         * Double click handler on the editor to handle dbl click on variable placeholder.
         */
        editor.on("dblclick", function (evt) {
            if (jQuery(evt.target).hasClass("magento-variable")) {
                editor.selection.collapse(false);
                editor.execCommand("openVariablesSlideout", {
                    ui: true,
                    selectedElement: evt.target,
                });
            }
        });

        /**
         * Attach event handler for when wysiwyg editor is about to encode its content
         */
        editor.settings.varienGlobalEvents.attachEventHandler(
            "wysiwygEncodeContent",
            function (content) {
                content = self.encodeVariables(content, editor);

                return content;
            }
        );

        /**
         * Attach event handler for when wysiwyg editor is about to decode its content
         */
        editor.settings.varienGlobalEvents.attachEventHandler(
            "wysiwygDecodeContent",
            function (content) {
                content = self.decodeVariables(content, editor);

                return content;
            }
        );
    },

    /**
     * Encode variables in content
     *
     * @param {String} content
     * @returns {*}
     */
    encodeVariables: function (content, editor) {
        content = content.gsub(
            /\{\{config path=\"([^\"]+)\"\}\}/i,
            function (match) {
                var path = match[1],
                    magentoVariables,
                    imageHtml;

                magentoVariables = JSON.parse(
                    editor.settings.mvOpts.placeholders
                );

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

                magentoVariables = JSON.parse(
                    editor.settings.mvOpts.placeholders
                );

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

    /**
     * Decode variables in content.
     *
     * @param {String} content
     * @returns {String}
     */
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

/**
 * Register plugin
 */
tinymce.PluginManager.add("magentovariable", tinymce.plugins.magentovariable);
