<?php 
namespace EdSDK\Wysiwyg\Controller\Auth;


use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;
use Magento\Framework\App\Config\Storage\WriterInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Cache\TypeListInterface;
use Magento\Customer\Model\Session;

class Get extends \Magento\Framework\App\Action\Action implements CsrfAwareActionInterface {

  /**
   * @var \Magento\Framework\Controller\Result\JsonFactory
   */
  protected $cacheTypeList;

  protected $scopeConfig;

  protected $configWriter;

  protected $authSession;
  protected $customerSession;

  /**
   * @param \Magento\Framework\App\Action\Context $context
   * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
   */
  public function __construct(\Magento\Framework\App\Action\Context $context,
   \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
   ScopeConfigInterface $scopeConfig,
    WriterInterface $configWriter,
    TypeListInterface $cacheTypeList,
    \Magento\Backend\Model\Auth\Session $authSession
   ) 
  {
    parent::__construct($context);

    
    $this->scopeConfig = $scopeConfig;
    $this->configWriter = $configWriter;

    $this->cacheTypeList = $cacheTypeList;

    $this->authSession = $authSession;

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

  public function execute() {


  
    if(array_key_exists('admin',$_SESSION) && count($_SESSION['admin']) > 0){


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
echo json_encode(['apiKey' => $apiKey, 'token' => $token]);
} else {
  echo 'No auth';
}

    
 
  }

  /**
   * View  page action
   *
   * @return \Magento\Framework\Controller\ResultInterface
   */
  public function createCsrfValidationException(RequestInterface $request): ?InvalidRequestException {
    return NULL;
  }

  public function validateForCsrf(RequestInterface $request): ?bool {
    return TRUE;
  }
}
