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
    $objectManager = \Magento\Framework\App\ObjectManager::getInstance();

    $this->moduleDir = $moduleDir;
    


    // $this->createDirIfNotExist($this->dirFiles = $dir->getPath('media') . '/wysiwyg');

    // $this->createDirIfNotExist($this->dirCache = $dir->getPath('cache') . '/wysiwyg');

    // $this->createDirIfNotExist($this->dirTmp = $dir->getPath('tmp') . '/wysiwyg');
  }



  private function createDirIfNotExist(string $path): void {
    if (!file_exists($path)) {
      mkdir($path, 0777, TRUE);
    }
  }

  public function execute() {

    // echo $moduleControllerPath = $this->moduleDir->getDir('EdSDK_Wysiwyg', Dir::MODULE_CONTROLLER_DIR);
    header('Content-Type: application/javascript');
    echo file_get_contents(__DIR__ . '/magento_widgets.js');
    // $this->getMyFilePath();

    // FlmngrServer::flmngrRequest([
    //   'dirFiles' => $this->dirFiles,
    //   'dirTmp' => $this->dirTmp,
    //   'dirCache' => $this->dirCache,
    // ]);
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

