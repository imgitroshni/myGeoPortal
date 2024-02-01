<?php
{
	ini_set('memory_limit', '256M');
	$text=$_REQUEST['TYPE'];
		$json = file_get_contents($text);
		$yummy = json_decode($json, true);
		$sss1 =   $yummy['features'];
		$ccc = count($sss1);
		if($ccc>0){
			echo 1;
		}else{
			echo 0;
		}
}
?>