<?php

namespace EdSDK\Wysiwyg\Controller\Plugins;

use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;

class MagentoWidgetsPic extends \Magento\Framework\App\Action\Action implements
    CsrfAwareActionInterface
{
    protected $resultJsonFactory;

    public function __construct(\Magento\Framework\App\Action\Context $context)
    {
        parent::__construct($context);
    }

    public function execute()
    {
        $response = $this->resultFactory->create(
            $this->resultFactory::TYPE_RAW
        );
        //@codingStandardsIgnoreStart
        $response->setContents(file_get_contents(__DIR__ . '/mw.png'));
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
