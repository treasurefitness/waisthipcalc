"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Profile from "./Treasure_Fitness_Logo.png";
import { Button, Card, Label, TextInput } from "flowbite-react";

export default function CardWithFormInputs() {
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [ratio, setRatio] = useState(null);
  const [healthRisk, setHealthRisk] = useState(null);
  const [email, setEmail] = useState("");
  const [showEmailField, setShowEmailField] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    let timer;
    if (emailSent && ratio) {
      // If email is sent and ratio is calculated, set a timer to reset after 5 seconds
      timer = setTimeout(() => {
        setRatio(null);
        setHealthRisk(null);
        setShowEmailField(false);
        setSubmittedEmail(false);
        setEmailSent(false);
        setEmailSuccess(false);
        setEmailError(false);
      }, 5000);
    }

    if (emailSuccess) {
      // If email is successfully sent, set a timer to reset after 4 seconds
      timer = setTimeout(() => {
        setEmailSuccess(false);
        setShowEmailField(false);
        setSubmittedEmail(false);
        setEmail("");
      }, 4000);
    }

    // Clean up the timer
    return () => clearTimeout(timer);
  }, [emailSent, ratio, emailSuccess]);

  const handleSubmitMeasurements = (e) => {
    e.preventDefault();

    const waistValue = parseFloat(waist);
    const hipValue = parseFloat(hip);

    if (!isNaN(waistValue) && !isNaN(hipValue) && hipValue !== 0) {
      const calculatedRatio = waistValue / hipValue;
      setRatio(calculatedRatio.toFixed(2));

      if (calculatedRatio <= 0.8) {
        setHealthRisk("Low");
      } else if (calculatedRatio >= 0.81 && calculatedRatio <= 0.85) {
        setHealthRisk("Moderate");
      } else {
        setHealthRisk("High");
      }
      setShowEmailField(true); // Show the email field after calculating the ratio
      setWaist(""); // Clear waist input
      setHip("");
    } else {
      alert("Please enter valid waist and hip measurements.");
    }
  };

  const sendEmailToZapier = async (email, ratio, healthRisk) => {
    try {
      const response = await fetch(
        "https://hooks.zapier.com/hooks/catch/8441989/3jq2s1o/",
        {
          method: "POST",
          body: JSON.stringify({ email, ratio, healthRisk }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email to Zapier");
      }

      console.log("Email sent successfully to Zapier");
      setEmailSuccess(true);
    } catch (error) {
      console.error("Error sending email to Zapier:", error.message);
      setEmailSuccess(false);
      setEmailError(true); // Display error message if email fails to send
    }
  };

  const handleSubmitEmail = (e) => {
    e.preventDefault();

    // Submit email, ratio, and health risk to Zapier webhook
    sendEmailToZapier(email, ratio, healthRisk).catch((error) =>
      console.error("Error sending email to Zapier:", error.message)
    );
    setSubmittedEmail(true);
  };

  return (
    <Card className="flex flex-col justify-center h-screen">
      <div className="flex flex-col items-center justify-center h-screen ">
        <div className="w-full max-w-md p-8 overflow-hidden bg-white rounded shadow-lg">
          <Image src={Profile} alt="profile" width={"25%"} height={"auto"} />
          <h1 className="pb-4 font-bold text-center text-red-600">
            Visceral Fat (Waist-to-Hip Ratio) Calculator
          </h1>
          <form
            className="flex flex-col w-full gap-4 p-6"
            onSubmit={handleSubmitMeasurements}
          >
            {!showEmailField && (
              <>
                <div className="mb-2">
                  <Label
                    htmlFor="waist"
                    value="Waist Measurement (in inches):"
                  />
                  <TextInput
                    id="waist"
                    required
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <Label htmlFor="hip" value="Hip Measurement (in inches):" />
                  <TextInput
                    id="hip"
                    required
                    type="number"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                  />
                </div>
              </>
            )}
            {!showEmailField && <Button type="submit">Calculate Ratio</Button>}
          </form>
          {showEmailField && !submittedEmail && (
            <form
              className="flex flex-col w-full gap-4 p-6"
              onSubmit={handleSubmitEmail}
            >
              <div className="mb-2">
                <Label
                  htmlFor="email"
                  value="Please enter your email to get your measurements:"
                />
                <TextInput
                  id="email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit">Submit Email</Button>
            </form>
          )}
          {emailSuccess && (
            <div className="pt-6 text-center text-green-600">
              <p>Email submitted successfully! Check your inbox.</p>
            </div>
          )}
          {emailError && (
            <div className="pt-6 text-center text-red-600">
              <p>Email not submitted. Please try again later.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
