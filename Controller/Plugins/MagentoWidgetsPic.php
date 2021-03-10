<?php

namespace EdSDK\Wysiwyg\Controller\Plugins;

use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;
use Magento\Framework\Filesystem\Io\File;

class MagentoWidgetsPic extends \Magento\Framework\App\Action\Action implements
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
        $response->setContents($this->fs->read(__DIR__ . '/mw.png'));
        //@codingStandardsIgnoreStop
        $response->setHeader('Content-Type', 'image/png');
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
