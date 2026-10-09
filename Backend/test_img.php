@
$f="D:/magang/frontend/public/background tim.jpg";
$i=@getimagesize($f);
var_dump($i);
$im=@imagecreatefromjpeg($f);
var_dump($im!==false);
@
