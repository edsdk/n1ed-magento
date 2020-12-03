composer require edsdk/flmngr-server-php

composer config --global --auth http-basic.repo.packagist.com avgustine1 9c415645a0ba70a196003ee27a51f82df4d6ca7b47c65be6c6edb29f960a

composer config repositories.private-packagist composer https://repo.packagist.com/wysiwyg-plugin/

composer config repositories.packagist.org false

composer require avgustine/wysiwyg

bin/magento s:d:c && bin/magento setup:upgrade && bin/magento c:c


FILE MANAGER

File Manager URL: /upload/filemngr/upload

Files URL: /pub/media/wysiwyg/

Uploads directory: /

