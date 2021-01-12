<?php
namespace EdSDK\Wysiwyg\Controller\Adminhtml\Auth;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\Config\Storage\WriterInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Cache\TypeListInterface;
use Magento\Backend\Model\Auth\Session;

/**
 * Class Index
 */
class Get extends Action implements HttpGetActionInterface
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     *
     */

    protected $_publicActions = ['get'];
    protected $cacheTypeList;

    protected $scopeConfig;

    protected $configWriter;

    protected $authSession;
    protected $customerSession;

    /**
     * @param \Magento\Framework\App\Action\Context $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     */
    public function __construct(
        Context $context,
        ScopeConfigInterface $scopeConfig,
        WriterInterface $configWriter,
        TypeListInterface $cacheTypeList,
        Session $authSession
    ) {
        $this->scopeConfig = $scopeConfig;
        $this->configWriter = $configWriter;

        $this->scopeConfig = $scopeConfig;
        $this->configWriter = $configWriter;

        $this->cacheTypeList = $cacheTypeList;

        if ($this->authSession->isLoggedIn()) {
            $apiKey = $this->scopeConfig->getValue(
                'edsdk/general/key',
                \Magento\Store\Model\ScopeInterface::SCOPE_STORE
            );

            $token = $this->scopeConfig->getValue(
                'edsdk/general/token',
                \Magento\Store\Model\ScopeInterface::SCOPE_STORE
            );

            if (!$apiKey) {
                $apiKey = 'N1EDDFLT';
                $this->configWriter->save(
                    'edsdk/general/key',
                    $apiKey,
                    $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT,
                    $scopeId = 0
                );
                $this->configCacheClear();
            }
            echo json_encode(['apiKey' => $apiKey, 'token' => $token]);
        } else {
            die('No auth');
        }

        parent::__construct($context);
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
    }
}
