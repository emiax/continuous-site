<?php

if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {

  $name = $_POST['name'];    
  $email = $_POST['email'];
  $message = $_POST['message'];
  
  $content = "This is a message from the form on continuous.se/en!\n\n";
  $content .= "Name: " . $name . "\n";
  $content .= "Answer to: " . $email . "\n";
  $content .= "Message: \n" . $message . "\n";

  mail('webform@continuous.se', 'Continuous: Meddelande', $content);
        
  echo '<div id="thanks">Thank you for your message! You will receive an answer within a few days.</div>';
}