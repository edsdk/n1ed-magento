<?php 

namespace EdSDK\Wysiwyg\Controller\Auth;

use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;
use Magento\Framework\App\Config\Storage\WriterInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Cache\TypeListInterface;

class Save extends \Magento\Framework\App\Action\Action implements CsrfAwareActionInterface {

  /**
   * @var \Magento\Framework\Controller\Result\JsonFactory
   */
  protected $cacheTypeList;

  protected $scopeConfig;

  protected $configWriter;

  /**
   * @param \Magento\Framework\App\Action\Context $context
   * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
   */
  public function __construct(\Magento\Framework\App\Action\Context $context,
   \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
   ScopeConfigInterface $scopeConfig,
    WriterInterface $configWriter,
    TypeListInterface $cacheTypeList
   ) 
  {
    parent::__construct($context);
    $this->configWriter = $configWriter;

    $this->cacheTypeList = $cacheTypeList;
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

    $this->configWriter->save('edsdk\general\key', $_REQUEST['n1edApiKey'], $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $scopeId = 0);
    $this->configWriter->save('edsdk\general\token', $_REQUEST['n1edToken'], $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $scopeId = 0);
    $this->configCacheClear();
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
