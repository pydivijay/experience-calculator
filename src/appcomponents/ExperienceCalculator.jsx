import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ExperienceCalculator = () => {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState({
    companyName: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});

  const calculateTotalExperience = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Calculate years
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    // Adjust for negative months or days
    if (days < 0) {
      months--;
      days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate(); // Get last day of the previous month
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} years, ${months} months, ${days} days`;
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company Name is required";
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.date = "Start Date cannot be greater than End Date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addExperience = () => {
    if (!validateForm()) return;
    const totalExperience = calculateTotalExperience(
      formData.startDate,
      formData.endDate
    );
    setExperiences([...experiences, { ...formData, totalExperience }]);
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      companyName: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    });
    setErrors({});
  };

  const clearExperiences = () => {
    setExperiences([]);
    clearForm();
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const calculateOverallExperience = () => {
    let totalYears = 0;
    let totalMonths = 0;
    let totalDays = 0;

    experiences.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);

      // Calculate the difference in years, months, and days
      let years = end.getFullYear() - start.getFullYear();
      let months = end.getMonth() - start.getMonth();
      let days = end.getDate() - start.getDate();

      // Adjust for negative days or months
      if (days < 0) {
        months--;
        days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Get the last day of the previous month
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      // Accumulate the total years, months, and days
      totalYears += years;
      totalMonths += months;
      totalDays += days;

      // If totalDays exceeds 30, adjust totalMonths and totalDays
      if (totalDays >= 30) {
        totalMonths++;
        totalDays -= 30;
      }

      // If totalMonths exceeds 12, adjust totalYears and totalMonths
      if (totalMonths >= 12) {
        totalYears++;
        totalMonths -= 12;
      }
    });

    return `${totalYears} years, ${totalMonths} months, ${totalDays} days`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
      <Card className="w-full max-w-4xl p-6 shadow-2xl bg-white rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
            Experience Calculator
          </h2>
          <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
            <Label className="text-gray-700">Company Name</Label>
            <Input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="mb-2 p-2 border rounded-lg w-full"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm">{errors.companyName}</p>
            )}

            <Label className="text-gray-700">Start Date</Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className="mb-2 p-2 border rounded-lg w-full"
            />

            <Label className="text-gray-700">End Date</Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className="mb-4 p-2 border rounded-lg w-full"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}

            <div className="flex justify-between">
              <Button
                onClick={addExperience}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Add Experience
              </Button>
              <Button
                onClick={clearForm}
                className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
              >
                Reset
              </Button>
              <Button
                onClick={clearExperiences}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Clear All
              </Button>
            </div>
          </div>
          <table className="w-full border-collapse border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-indigo-500 text-white">
                <th className="border border-gray-300 p-3">Company Name</th>
                <th className="border border-gray-300 p-3">Start Date</th>
                <th className="border border-gray-300 p-3">End Date</th>
                <th className="border border-gray-300 p-3">Total Experience</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp, index) => (
                <tr
                  key={index}
                  className="border border-gray-300 bg-gray-50 hover:bg-gray-100"
                >
                  <td className="border border-gray-300 p-3 text-center">
                    {exp.companyName}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {exp.startDate}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {exp.endDate}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {exp.totalExperience}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <Button
                      onClick={() => removeExperience(index)}
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {experiences.length > 0 && (
            <div className="mt-4 p-4 text-center bg-indigo-100 rounded-lg text-indigo-700 font-semibold shadow-md">
              Overall Experience: {calculateOverallExperience()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExperienceCalculator;
