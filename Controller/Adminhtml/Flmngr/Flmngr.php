<?php

namespace EdSDK\Wysiwyg\Controller\Adminhtml\Flmngr;

use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;
use EdSDK\FlmngrServer\FlmngrServer;
use Magento\Backend\App\Action;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Backend\Model\Auth\Session;
use Magento\Framework\App\CsrfAwareActionInterface;

class Flmngr extends Action implements
    HttpPostActionInterface,
    CsrfAwareActionInterface,
    HttpGetActionInterface
{
    protected $_publicActions = ['flmngr'];

    protected $dirFiles;

    protected $dirTmp;

    protected $dirCache;

    public function __construct(Context $context, Session $authSession)
    {
        parent::__construct($context);
    }

    private function createDirIfNotExist(string $path): void
    {
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
    }

    public function execute()
    {
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();

        $dir = $objectManager->get(
            \Magento\Framework\Filesystem\DirectoryList::class
        );

        $this->createDirIfNotExist(
            $this->dirFiles = $dir->getPath('media') . '/wysiwyg'
        );

        $this->createDirIfNotExist(
            $this->dirCache = $dir->getPath('cache') . '/wysiwyg'
        );

        $this->createDirIfNotExist(
            $this->dirTmp = $dir->getPath('tmp') . '/wysiwyg'
        );

        $response = $this->resultFactory->create(
            $this->resultFactory::TYPE_RAW
        );

        // die(var_dump($this->dirCache, $this->dirFiles, $this->dirTmp));
        $response->setContents(
            FlmngrServer::flmngrRequest([
                'dirFiles' => $this->dirFiles,
                'dirTmp' => $this->dirTmp,
                'dirCache' => $this->dirCache,
            ])
        );
        return $response;
    }

    public function createCsrfValidationException(
        RequestInterface $request
    ): ?InvalidRequestException {
        return null;
    }

    public function validateForCsrf(RequestInterface $request): ?bool
    {
        return true;
    }
}
