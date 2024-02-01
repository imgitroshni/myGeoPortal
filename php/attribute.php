<!DOCTYPE html>
<html>
<body>
<style>
table {
border: 1px solid #ddd;
  border-collapse: collapse;
  width: 100%;
  font-size: 14px;
}

th, td {
border: 1px solid #ddd;
  text-align: left;
  padding: 5px;
}

tr:nth-child(even){background-color: #f2f2f2}

th {
  background-color: #4CAF50;
  color: white;  
}
</style>
<h4 id="headname">No Data</h4>
<p id="info" ></p>
<?php
{
	$text=$_REQUEST['TYPE'];
	$name=$_REQUEST['NAME'];
		$json = file_get_contents($text);
		//echo $json;
		$yummy = json_decode($json, true);
		$sss1 =   $yummy['features'];
		$ccc = count($sss1);
		if($ccc>0){
		$sss =   $yummy['features'][0]['properties'];
		foreach($sss as $key=>$value){
				if($key == 'Link')
				{
				//$output[] = array($key  =>  $value);
				}else 
				{
				$output[] = array($key  =>  $value);
				}
			}
			
		$res = json_encode($output);
		//echo $res ;
		}
}
?>
<script>
var namm = 'Analytical data';
var arrayOfObjects = eval('<?php echo $res ;?>');
var temp="<table><tr><th>Name</th><th>Value</th></tr>";
for(var i=0;i<arrayOfObjects.length;i++){
	var object = arrayOfObjects[i];
    for (var property in object) {
		if(property=='link'){
		temp += "<tr><td>"+property+"</td><td><a href='"+object[property]+"' target='_blank'>"+namm+"</a></td></tr>"
		}else
		{
			temp += "<tr><td>"+property+"</td><td>"+object[property]+"</td></tr>"
		}
    }
}
document.getElementById("info").innerHTML = temp+'</table>';
document.getElementById("headname").innerHTML = '<?php echo $name ;?>';

</script>
</body>
</html>