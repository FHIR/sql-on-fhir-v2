<?php
function Redirect($url)
{
  header('Location: ' . $url, true, 302);
  exit();
}

$accept = $_SERVER['HTTP_ACCEPT'];
if (strpos($accept, 'application/json+fhir') !== false)
  Redirect('https://sql-on-fhir.org/ig/2.0.0/ImplementationGuide-org.sql-on-fhir.ig.json2');
elseif (strpos($accept, 'application/fhir+json') !== false)
  Redirect('https://sql-on-fhir.org/ig/2.0.0/ImplementationGuide-org.sql-on-fhir.ig.json1');
elseif (strpos($accept, 'json') !== false)
  Redirect('https://sql-on-fhir.org/ig/2.0.0/ImplementationGuide-org.sql-on-fhir.ig.json');
elseif (strpos($accept, 'application/xml+fhir') !== false)
  Redirect('https://sql-on-fhir.org/ig/2.0.0/ImplementationGuide-org.sql-on-fhir.ig.xml2');
elseif (strpos($accept, 'application/fhir+xml') !== false)
  Redirect('https://sql-on-fhir.org/ig/2.0.0/ImplementationGuide-org.sql-on-fhir.ig.xml1');
elseif (strpos($accept, 'html') !== false)
  Redirect('https://sql-on-fhir.org/ig/2.0.0/index.html');
else 
  Redirect('https://sql-on-fhir.org/ig/2.0.0/ImplementationGuide-org.sql-on-fhir.ig.xml');
?>
    
You should not be seeing this page. If you do, PHP has failed badly.
