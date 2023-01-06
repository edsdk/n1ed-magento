#!/bin/sh

mkdir -p zip
zip -r zip/edsdk_n1ed-magento-1.0.7.zip . -x '.git/*' 'zip.sh' -x 'zip/*' '.gitignore'