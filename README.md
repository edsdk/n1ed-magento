# N1ED module for Magento

This module for Magento CMS will install N1ED - the powerful editor based on TinyMCE with a lot of plugins.

# Installation

Change directory to the root of your Magento installation and run in the console.

```
composer require edsdk/n1ed-magento
bin/magento s:d:c && bin/magento setup:upgrade && bin/magento c:c
```

Go to your web control panel into:

    Stores → Configuration → General → Content management.

Uncheck "Use system value" box related to "WYSIWYG Editor" field, then choose "N1ED" in the combobox, then press "Save Config".

Then you can go into any content or product page and see N1ED in action.  