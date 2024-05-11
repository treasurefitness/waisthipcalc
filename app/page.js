"use client";
import React, { useState } from "react";
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

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    // Submit email to Kajabi or other backend
    console.log("Email submitted:", email);
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
            <div className="mb-2">
              <Label htmlFor="waist" value="Waist Measurement (in inches):" />
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
            {!showEmailField && <Button type="submit">Calculate Ratio</Button>}
          </form>
          {showEmailField && !submittedEmail && (
            <form
              className="flex flex-col w-full gap-4 p-6"
              onSubmit={handleSubmitEmail}
            >
              <div className="mb-2">
                <Label htmlFor="email" value="Enter your email:" />
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
          {submittedEmail && (
            <div className="pt-6 text-center">
              <p className="pt-3">Hey sis 👋</p>
              <p className="pt-3">Your Waist-to-Hip Ratio is:</p>
              <p className="font-bold text-red-600">{ratio}</p>
              {healthRisk && (
                <p className="pb-2 font-bold">
                  <span className="text-black">Health Risk: </span>{" "}
                  <span className="text-red-600">{healthRisk}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
