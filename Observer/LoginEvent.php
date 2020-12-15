<?php
namespace EdSDK\Wysiwyg\Observer;

use Magento\Framework\Event\ObserverInterface;


class LoginEvent implements ObserverInterface
{
    const DEFAULT_SESSION_NAME_OF_FRONTEND = 'PHPSESSID';

    /**
     * (non-PHPdoc)
     * @see \Magento\Framework\Event\ObserverInterface::execute()
     */
    public function execute(\Magento\Framework\Event\Observer $observer) {
        // die('lol');
        if (! isset($_COOKIE[self::DEFAULT_SESSION_NAME_OF_FRONTEND])) return;
        $backSessionId = session_id();
        $frontendSessionId = $_COOKIE[self::DEFAULT_SESSION_NAME_OF_FRONTEND];
        session_write_close();
        session_id($frontendSessionId);
        session_start();
        $_SESSION['admin'] = [$backSessionId];
        session_write_close();
        session_id($backSessionId);
        session_start();
        return;
    }
}