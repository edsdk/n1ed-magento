<?php
namespace EdSDK\Wysiwyg\Controller\Adminhtml\WysiwygSettings;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\View\Result\Page;
use Magento\Framework\View\Result\PageFactory;
use Magento\Framework\App\Config\Storage\WriterInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Cache\TypeListInterface;
use Magento\Framework\App\Cache\Frontend\Pool;

class Index extends Action implements HttpGetActionInterface
{
    const MENU_ID = 'EdSDK_Wysiwyg::edsdk_wysiwyg';

    protected $cacheTypeList;
    protected $cacheFrontendPool;
    protected $resultPageFactory;

    protected $scopeConfig;

    protected $configWriter;

    public function __construct(
        Context $context,
        PageFactory $resultPageFactory,
        ScopeConfigInterface $scopeConfig,
        WriterInterface $configWriter,
        TypeListInterface $cacheTypeList,
        Pool $cacheFrontendPool
    ) {
        parent::__construct($context);

        $this->resultPageFactory = $resultPageFactory;

        $this->scopeConfig = $scopeConfig;

        $this->configWriter = $configWriter;

        $this->cacheTypeList = $cacheTypeList;

        $this->cacheFrontendPool = $cacheFrontendPool;
    }

    private function configCacheClear()
    {
        $types = ['config'];

        foreach ($types as $type) {
            $this->cacheTypeList->cleanType($type);
        }
    }

    public function execute()
    {
        $apiKey = $this->scopeConfig->getValue(
            'edsdk/general/key',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );

        $token = $this->scopeConfig->getValue(
            'edsdk/general/token',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );

        if (!$apiKey) {
            $apiKey = 'MGNTN1ED';
            $this->configWriter->save(
                'edsdk/general/key',
                $apiKey,
                $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT,
                $scopeId = 0
            );
            $this->configCacheClear();
        }

        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu(static::MENU_ID);
        $resultPage
            ->getLayout()
            ->getBlock('EdSDK_settings')
            ->setApi($apiKey);
        $resultPage
            ->getLayout()
            ->getBlock('EdSDK_settings')
            ->setToken($token);

        return $resultPage;
    }
}
