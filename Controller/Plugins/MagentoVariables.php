<?php

namespace EdSDK\Wysiwyg\Controller\Plugins;

use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Filesystem\Io\File;
use Magento\Framework\App\Request\InvalidRequestException;

class MagentoVariables extends \Magento\Framework\App\Action\Action implements
    CsrfAwareActionInterface
{
    private $fs;
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        File $fs
    ) {
        parent::__construct($context);
        $this->fs = $fs;
    }

    public function execute()
    {
        $response = $this->resultFactory->create(
            $this->resultFactory::TYPE_RAW
        );
        //@codingStandardsIgnoreStart
        $response->setContents(
            $this->fs->read(__DIR__ . '/MagentoVariables.js')
        );
        //@codingStandardsIgnoreStop
        $response->setHeader('Content-Type', 'application/javascript');
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
