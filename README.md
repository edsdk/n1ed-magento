composer config --global --auth http-basic.repo.packagist.com avgustine1 9c415645a0ba70a196003ee27a51f82df4d6ca7b47c65be6c6edb29f960a

composer config repositories.private-packagist composer https://repo.packagist.com/wysiwyg-plugin/

composer config repositories.packagist.org false

composer require edsdk/n1ed-magento

bin/magento s:d:c && bin/magento setup:upgrade && bin/magento c:c



