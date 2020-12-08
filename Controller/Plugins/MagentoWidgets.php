<?php /**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace EdSDK\Wysiwyg\Controller\Plugins;

use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;
use Magento\Framework\Module\Dir;

class MagentoWidgets extends \Magento\Framework\App\Action\Action implements CsrfAwareActionInterface {

  protected $dirFiles;

  protected $dirTmp;

  protected $dirCache;

  protected $assetRepository;

  protected $moduleDir;

  /**
   * @var \Magento\Framework\Controller\Result\JsonFactory
   */
  protected $resultJsonFactory;

  /**
   * @param \Magento\Framework\App\Action\Context $context
   * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
   */
  public function __construct(\Magento\Framework\App\Action\Context $context, \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory, Dir $moduleDir) {
    parent::__construct($context);
    $this->resultJsonFactory = $resultJsonFactory;
    $this->moduleDir = $moduleDir;
  }



  private function createDirIfNotExist(string $path): void {
    if (!file_exists($path)) {
      mkdir($path, 0777, TRUE);
    }
  }

  public function execute() {
    header('Content-Type: application/javascript');
    echo file_get_contents(__DIR__ . '/magento_widgets.js');
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

