<?php
header("Content-Type: application/json");

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    die();
}

// Sanitize inputs
$name = filter_var($_POST["name"] ?? "", FILTER_SANITIZE_STRING);
$email = filter_var($_POST["email"] ?? "", FILTER_SANITIZE_EMAIL);
$phone = filter_var($_POST["phone"] ?? "", FILTER_SANITIZE_STRING);
$class = filter_var($_POST["class"] ?? "", FILTER_SANITIZE_STRING);
$message_body = filter_var($_POST["message"] ?? "", FILTER_SANITIZE_STRING);

// Validate inputs
if (empty($name) || empty($email) || empty($phone) || empty($class)) {
    echo json_encode(["status" => "error", "message" => "Please fill in all required fields."]);
    die();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    die();
}

// Email settings
$to = "meenaben@yoga.shivaservices.co.in";
$subject = "New Class Booking Request from $name";

// Email content
$email_content = "New Booking/Inquiry Request:

";
$email_content .= "Name: $name
";
$email_content .= "Email: $email
";
$email_content .= "Phone: $phone
";
$email_content .= "Class Selected: $class

";
$email_content .= "Message/Health Concerns:
$message_body
";

// Email headers
$headers = "From: $name <$email>
";
$headers .= "Reply-To: $email
";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to, $subject, $email_content, $headers)) {
    echo json_encode(["status" => "success", "message" => "Thank you for joining our Yoga journey. 🙏 We will reach out to you soon!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Oops! Something went wrong and we couldn t send your request. Please try again or call us directly."]);
}
?>