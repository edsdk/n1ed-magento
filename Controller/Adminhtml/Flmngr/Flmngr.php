<?php

namespace EdSDK\Wysiwyg\Controller\Adminhtml\Flmngr;

use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;
use EdSDK\FlmngrServer\FlmngrServer;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Config\Storage\WriterInterface;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Cache\TypeListInterface;
use Magento\Backend\Model\Auth\Session;

class Flmngr extends Action implements HttpPostActionInterface
{
    protected $_publicActions = ['upload'];

    protected $_openActions = ['upload'];

    protected $dirFiles;

    protected $dirTmp;

    protected $dirCache;

    public function __construct(Context $context, Session $authSession)
    {
        if ($authSession->isLoggedIn()) {
            $objectManager = \Magento\Framework\App\ObjectManager::getInstance();

            $dir = $objectManager->get(
                '\Magento\Framework\Filesystem\DirectoryList'
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

            die(
                FlmngrServer::flmngrRequest([
                    'dirFiles' => $this->dirFiles,
                    'dirTmp' => $this->dirTmp,
                    'dirCache' => $this->dirCache,
                ])
            );
        } else {
            die('No auth');
        }
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
    }
}
