<?php 
namespace EdSDK\Wysiwyg\Controller\Adminhtml\Auth;

use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Backend\App\Action;
use Magento\Framework\App\RequestInterface;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Request\InvalidRequestException;
use Magento\Framework\App\Config\Storage\WriterInterface;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Cache\TypeListInterface;

class Save extends Action implements HttpPostActionInterface {


  protected $_publicActions = ['save'];

  /**
   * @var \Magento\Framework\Controller\Result\JsonFactory
   */
  protected $cacheTypeList;

  protected $scopeConfig;

  protected $configWriter;

  protected $authSession;
  /**
   * @param \Magento\Framework\App\Action\Context $context
   * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
   */
  public function __construct(Context $context,
   \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
   ScopeConfigInterface $scopeConfig,
    WriterInterface $configWriter,
    TypeListInterface $cacheTypeList,
    \Magento\Backend\Model\Auth\Session $authSession
   ) 
  {
    
    $this->configWriter = $configWriter;

    $this->cacheTypeList = $cacheTypeList;

    $this->authSession = $authSession;

    if($this->authSession->isLoggedIn()){

      $this->configWriter->save('edsdk\general\key', $_REQUEST['n1edApiKey'], $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $scopeId = 0);
      $this->configWriter->save('edsdk\general\token', $_REQUEST['n1edToken'], $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $scopeId = 0);
      $this->configCacheClear();
  
        echo 'ok';
  
      } else {
       die( 'No auth');
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

  public function execute() {

   
  }
}
