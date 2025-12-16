export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  // TODO: Implement email sender
  console.log(
    "Sending email to",
    to,
    "with subject",
    subject,
    "and text",
    text
  );
}
