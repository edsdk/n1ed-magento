#!/bin/sh

mkdir -p zip
rm -f zip/edsdk_n1ed-magento-1.0.11.zip
zip -r zip/edsdk_n1ed-magento-1.0.11.zip . -x '.git/' -x '.git/*' -x '.idea/' -x '.idea/*' 'zip.sh' -x 'zip/*' '.gitignore'
#unzip -l zip/edsdk_n1ed-magento-1.0.11.zip