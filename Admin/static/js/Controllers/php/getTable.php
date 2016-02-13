<?php
session_start();
$postdata = file_get_contents("php://input",true);
$data = json_decode($postdata);
@$category = $data->category;
$server="localhost";
		$uid="root";
		$pwd="par123";

		$con=mysql_connect($server,$uid,$pwd);

		if($con) //if($con==true)
		{
			$mydb=mysql_select_db($category);
			if($mydb)
			{
			}
			else
			{
			return false;
			}
		}
		else
		{
		return false;
		}
$query="show tables from $category";
	$sql=mysql_query($query);
	$row = mysql_fetch_array($sql);
	$x = array();
	while($row = mysql_fetch_array($sql)){
		array_push($x, $row);
	}
	json_encode($x);
	echo json_encode($x);
mysql_close($con);


?>