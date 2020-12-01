<?php 
namespace n1ed\n1ed\Controller\n1edUpload;
use EdSDK\FlmngrServer\FlmngrServer;

class Upload extends \Magento\Framework\App\Action\Action{
    
    
    // Uncomment line below to enable CORS if your request domain and server domain are different
    // header('Access-Control-Allow-Origin: *');
    
    FlmngrServer::flmngrRequest(
        array(
            'dirFiles' => 'path-to/files',
            'dirTmp'   => 'path-to/tmp',
            'dirCache'   => 'path-to/cache'
        )
    );
}

