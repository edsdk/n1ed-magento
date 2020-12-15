<?php
namespace EdSDK\Wysiwyg\Observer;

use Magento\Framework\Event\ObserverInterface;


class LogoutEvent implements ObserverInterface
{
    const DEFAULT_SESSION_NAME_OF_FRONTEND = 'PHPSESSID';

    /**
     * (non-PHPdoc)
     * @see \Magento\Framework\Event\ObserverInterface::execute()
     */
    public function execute(\Magento\Framework\Event\Observer $observer) {
        die('lol');
       session_destroy();
        return;
    }
}