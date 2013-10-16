<?php

	header("content-type: text/xml");

	$data = $_POST["data"];

	$ptr = fopen("exports/octopus.stl", "wb");
	fwrite($ptr, $data);
	fclose($ptr);

	echo "ok";

	return;
?>

