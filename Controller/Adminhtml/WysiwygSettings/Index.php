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

/**
 * Class Index
 */
class Index extends Action implements HttpGetActionInterface
{
    const MENU_ID = 'EdSDK_Wysiwyg::edsdk_wysiwyg';

    /**
     * @var PageFactory
     * 
     * 
     */

    protected $cacheTypeList;
    protected $cacheFrontendPool;
    protected $resultPageFactory;

    protected $scopeConfig;

    protected $configWriter;



    /**
     * Index constructor.
     *
     * @param Context $context
     * @param PageFactory $resultPageFactory
     */
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
        // foreach ($this->cacheFrontendPool as $cacheFrontend) {
        //     $cacheFrontend->getBackend()->clean();
        // }
    }

    /**
     * Load the page defined in view/adminhtml/layout/exampleadminnewpage_helloworld_index.xml
     *
     * @return Page
     */
    public function execute()
    {

        $apiKey = $this->scopeConfig->getValue(
            'edsdk\general\key',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );

        $token = $this->scopeConfig->getValue(
            'edsdk\general\token',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );

        if(!$apiKey){
            $apiKey = 'N1EDDFLT';
            $this->configWriter->save('edsdk\general\key', $apiKey, $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $scopeId = 0);
            $this->configCacheClear();
        }

        // die(var_dump($apiKey));

        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu(static::MENU_ID);

        $resultPage->getLayout()->getBlock('EdSDK_settings')->setApi($apiKey);
        $resultPage->getLayout()->getBlock('EdSDK_settings')->setToken($token);
        // $resultPage->getConfig()->getTitle()->prepend(__(''));

        return $resultPage;
    }
}
