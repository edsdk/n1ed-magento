<?php
namespace EdSDK\Wysiwyg\Controller\Adminhtml\WysiwygSettings;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\View\Result\Page;
use Magento\Framework\View\Result\PageFactory;
use Magento\Framework\App\Config\Storage\WriterInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;

/**
 * Class Index
 */
class Index extends Action implements HttpGetActionInterface
{
    const MENU_ID = 'EdSDK_Wysiwyg::edsdk_wysiwyg';

    /**
     * @var PageFactory
     */
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
        WriterInterface $configWriter 
        ) {
        parent::__construct($context);

        $this->resultPageFactory = $resultPageFactory;

        $this->scopeConfig = $scopeConfig;

        $this->configWriter = $configWriter;
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
        if(!$apiKey){
            $apiKey = 'N1EDDFLT';
            $this->configWriter->save('edsdk\general\key', $apiKey, $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $scopeId = 0);
        }

        // die(var_dump($apiKey));

        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu(static::MENU_ID);

        $resultPage->getLayout()->getBlock('EdSDK_settings')->setApi($apiKey);
        $resultPage->getLayout()->getBlock('EdSDK_settings')->setToken('');
        // $resultPage->getConfig()->getTitle()->prepend(__(''));

        return $resultPage;
    }
}
