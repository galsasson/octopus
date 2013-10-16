<?php

	header("content-type: text/xml");

//	$data = $_POST["data"];
	$data = $HTTP_RAW_POST_DATA;

	$ptr = fopen("exports/octopus.stl", "wb");
	fwrite($ptr, $data);
	fclose($ptr);

	echo "ok";

	return;
?>

