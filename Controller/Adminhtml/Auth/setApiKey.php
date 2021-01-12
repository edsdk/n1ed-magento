<?php
namespace EdSDK\Wysiwyg\Controller\Adminhtml\Auth;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Config\Storage\WriterInterface;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Cache\TypeListInterface;
use Magento\Backend\Model\Auth\Session;

class setApiKey extends Action implements HttpPostActionInterface
{
    protected $_publicActions = ['save'];

    protected $cacheTypeList;

    protected $scopeConfig;

    protected $configWriter;

    protected $authSession;

    public function __construct(
        Context $context,
        WriterInterface $configWriter,
        TypeListInterface $cacheTypeList,
        Session $authSession
    ) {
        $this->configWriter = $configWriter;

        $this->cacheTypeList = $cacheTypeList;

        $this->authSession = $authSession;

        if ($this->authSession->isLoggedIn()) {
            $this->configWriter->save(
                'edsdk/general/key',
                $_REQUEST['n1edApiKey'],
                $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT,
                $scopeId = 0
            );
            $this->configWriter->save(
                'edsdk/general/token',
                $_REQUEST['n1edToken'],
                $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT,
                $scopeId = 0
            );
            $this->configCacheClear();

            echo 'ok';
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
