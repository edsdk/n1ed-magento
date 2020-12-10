<?php /**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace EdSDK\Wysiwyg\Controller\Plugins;

use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;


class MVPic extends \Magento\Framework\App\Action\Action implements CsrfAwareActionInterface {

  public function __construct(\Magento\Framework\App\Action\Context $context) {
    parent::__construct($context);
  }
  
  public function execute() {

    header('Content-Type: image/png');
    echo file_get_contents(__DIR__ . '/mv.png');
   
  }

  /**
   * View  page action
   *
   * @return \Magento\Framework\Controller\ResultInterface
   */
  public function createCsrfValidationException(RequestInterface $request): ?InvalidRequestException {
    return NULL;
  }

  public function validateForCsrf(RequestInterface $request): ?bool {
    return TRUE;
  }
}

