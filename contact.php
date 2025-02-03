<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\OAuth;
//@see https://github.com/greew/oauth2-azure-provider
use Greew\OAuth2\Client\Provider\Azure;

require 'vendor/autoload.php';

$email = getenv('loyiso@skunkworks.africa'); // your office365 email
$clientId = getenv('a53bd6dd-854c-40c3-b417-6a4d97a55d2b'); // Azure Client ID
$tenantId = getenv('972e8de4-e365-43a3-99ec-c86a0cc249e8'); // Azure Tenant ID
$clientSecret = getenv('AZURE_CLIENT_SECRET_VALUE'); // Optional. Azure Client Secret Value (Certificates & secrets)
$refreshToken = getenv('AZURE_REFRESH_TOKEN');

$mail = new PHPMailer(true);
$clientId = 'a53bd6dd-854c-40c3-b417-6a4d97a55d2b';
$tenantId = ' 972e8de4-e365-43a3-99ec-c86a0cc249e8';
$clientSecret = '2f83b05d-85db-4e14-b671-2220bdc7afab';

try {
   // Configure PHPMailer for SMTP
   $mail->isSMTP();
   $mail->Host       = 'smtp.office365.com';
   $mail->SMTPAuth   = true;
   $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
   $mail->Port       = 587;

   // Set OAuth2 token
   $mail->AuthType = 'XOAUTH2';
   $mail->setOAuth(new OAuth([
       'provider' => new Azure([
           'clientId' => $clientId,
           'tenantId' => $tenantId,
           'clientSecret' => $clientSecret
       ]),
       'clientId' => $clientId,
       'refreshToken' => $refreshToken,
       'clientSecret' => $clientSecret,
       'userName' => $email,
   ]));

   //Sender and recipient settings
   $mail->setFrom($email, 'First Last'); // your office365 email
   $mail->addAddress('someone@someserver.com', 'John Doe');

   //Content
   $mail->isHTML(true);
   $mail->Subject = 'OAuth2 Email Test';
   $mail->Body    = 'This is a test email using OAuth2 authentication with Office 365 SMTP and PHPMailer.';

   //Send email
   $mail->send();
   echo 'Message has been sent';
} catch (Exception $e) {
   echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}