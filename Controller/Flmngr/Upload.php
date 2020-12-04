<?php /**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace EdSDK\Wysiwyg\Controller\Flmngr;

use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;
use EdSDK\FlmngrServer\FlmngrServer;

class Upload extends \Magento\Framework\App\Action\Action implements CsrfAwareActionInterface
{

       protected $dirFiles;

       protected $dirTmp;

       protected $dirCache;

       /**
        * @var \Magento\Framework\Controller\Result\JsonFactory
        */
        protected $resultJsonFactory;
        /**
         * @param \Magento\Framework\App\Action\Context $context
         * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
         */
        public function __construct(
       \Magento\Framework\App\Action\Context $context,
       \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory )
       {
              parent::__construct($context);
              $this->resultJsonFactory = $resultJsonFactory;
              $objectManager = \Magento\Framework\App\ObjectManager::getInstance();

              $dir = $objectManager->get('\Magento\Framework\Filesystem\DirectoryList');

              $this->createDirIfNotExist($this->dirFiles = $dir->getPath('media') . '/wysiwyg');

              $this->createDirIfNotExist($this->dirCache = $dir->getPath('cache') . '/wysiwyg');

              $this->createDirIfNotExist($this->dirTmp = $dir->getPath('tmp') . '/wysiwyg');
       }


       private function createDirIfNotExist(string $path): void 
       {
              if (!file_exists($path)) {
                     mkdir($path, 0777, true);
              }
       }

       public function execute()
       {

          FlmngrServer::flmngrRequest([ 'dirFiles' => $this->dirFiles, 'dirTmp'   => $this->dirTmp, 'dirCache'   => $this->dirCache ]);
   
          
       //    $result = $this->resultJsonFactory->create();
       //    $data = ['message' => 'Hello world!111'];
   
       //    return $result->setData($data);
   
       //    echo json_encode(['lol' => 'magento']);
   }




























       /**
        * View  page action
              *
              * @return \Magento\Framework\Controller\ResultInterface
              */
       public function createCsrfValidationException(RequestInterface $request): ? InvalidRequestException
       {
       return null;
       }
       
       public function validateForCsrf(RequestInterface $request): ?bool
       {
       return true;
       }
 }
