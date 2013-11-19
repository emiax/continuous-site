<?php

if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {

  $name = $_POST['name'];    
  $email = $_POST['email'];
  $message = $_POST['message'];
  
  $content = "Detta är ett meddelande från formuläret på continuous.se!\n\n";
  $content .= "Namn: " . $name . "\n";
  $content .= "Svara till: " . $email . "\n";
  $content .= "Meddelande: \n" . $message . "\n";

  mail('webform@continuous.se', 'Continuous: Meddelande', $content);
        
  echo '<div id="thanks">Tack för ditt meddelande! Räkna med svar inom några dagar.</div>';
}