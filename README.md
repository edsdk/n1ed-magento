<p align="center">
    <a href="https://n1ed.com/"><img src="https://n1ed.com/img/favicons/favicon-64x64.png" alt="N1ED" /></a>
</p>

<h1 align="center">N1ED</h1>

<p align="center">
    <strong>Create your content block by block using N1ED page builder.</strong>
</p>

<p align="center">
    <a href="https://n1ed.com/">Home page</a> ∙ <a href="https://n1ed.com/doc/install-magento-extension">Install</a> ∙ <a href="https://n1ed.com/demo/">Try Online</a>
</p>

[![Edit articles with N1ED](https://n1ed.com/img/index/main-screenshot.jpg)](https://n1ed.com)

## N1ED module for Magento

This module for Magento CMS will install N1ED - the powerful editor based on TinyMCE with a lot of plugins.

### Main features:


- Provides built-in plugins:
    - Bootstrap Editor
    - File Manager
    - Image Editor
    - Translator
    - Chat GPT
- Adds many new widgets
- Mobile simulation feature and gives you content preview in different display resolutions
- Advanced breadcrumbs integrated with powerful widget editing system
- Useful fullscreen mode
- Always auto updated using CDN
- Configure N1ED and other add-ons visually using Dashboard

## Installation

Change directory to the root of your Magento installation and run in the console.

```
composer require edsdk/n1ed-magento
bin/magento s:d:c && bin/magento setup:upgrade && bin/magento c:c
```

Go to your web control panel into:

    Stores → Configuration → General → Content management.

Uncheck "Use system value" box related to "WYSIWYG Editor" field, then choose "N1ED" in the combobox, then press "Save Config".

Then you can go into any content or product page and see N1ED in action.


## Support

Please feel free to ask any questions regarding installation or using sending a letter to [support e-mail](mailto:support@helpdesk.edsdk.com).