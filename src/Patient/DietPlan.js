import React, { useState } from 'react';
import './Patientcss/dietplan.css';

const dietPlans = {
  heart: [
    "Include more fruits and vegetables",
    "Opt for whole grains",
    "Choose lean protein sources like fish and poultry",
    "Limit salt and sugar intake",
  ],
  weightLoss: [
    "Eat smaller portions",
    "Focus on high-fiber foods",
    "Stay hydrated",
    "Avoid sugary drinks and processed foods",
  ],
  liver: [
    "Reduce alcohol consumption",
    "Add more greens like spinach and kale",
    "Avoid fatty and fried foods",
    "Stay hydrated with water and green tea",
  ],
  skinGlow: [
    "Eat foods rich in antioxidants like berries",
    "Drink plenty of water",
    "Add nuts and seeds to your diet",
    "Avoid too much sugar and processed foods",
  ],
  height: [
    "Maintain a balanced diet with calcium and protein",
    "Engage in regular exercise and stretching",
    "Ensure adequate sleep for growth",
    "Avoid junk food",
  ],
  hair: [
    "Consume biotin-rich foods like eggs and nuts",
    "Include omega-3 fatty acids from fish",
    "Stay hydrated",
    "Avoid excessive heat or chemical treatments",
  ],
  sleep: [
    "Create a consistent sleep schedule",
    "Avoid caffeine before bedtime",
    "Include foods rich in magnesium like spinach and bananas",
    "Practice relaxation techniques before sleep",
  ],
};

export default function Dietplan() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showBmiForm, setShowBmiForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiFeedback, setBmiFeedback] = useState('');

  const handleCardClick = (category) => {
    setSelectedCategory(category);
  };

  const closeModal = () => {
    setSelectedCategory(null);
  };

  const calculateBmi = () => {
    if (weight && height) {
      const heightInMeters = height / 100; // Convert height to meters
      const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(calculatedBmi);

      // Provide feedback based on BMI value
      if (calculatedBmi < 18.5) {
        setBmiFeedback("You are underweight. Consider a diet to gain weight.");
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 24.9) {
        setBmiFeedback("You have a normal weight. Maintain your current diet.");
      } else if (calculatedBmi >= 25 && calculatedBmi < 29.9) {
        setBmiFeedback("You are overweight. Consider losing 5-10kg for better health.");
      } else {
        setBmiFeedback("You are in the obese range. Seek advice for a healthier lifestyle.");
      }
    } else {
      alert("Please enter both weight and height.");
    }
  };

  return (
    <div className="dietplan-container">
      <h1>Diet Plan Suggestions</h1>
      <button className="bmi-btn" onClick={() => setShowBmiForm(!showBmiForm)}>
        Calculate Your BMI
      </button>

      {showBmiForm && (
        <div className="bmi-form">
             <button
      className="bmi-close-btn"
      onClick={() => setShowBmiForm(false)}
    >
      &times;
    </button>
          <h2>BMI Calculator</h2>
          <label>
            Weight (kg):
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
            />
          </label>
          <label>
            Height (cm):
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter your height"
            />
          </label>
          <button onClick={calculateBmi}>Calculate</button>
          {bmi && (
           <div className="bmi-result">
           <p>Your BMI: {bmi}</p>
           <p
             style={{
               color: bmi >= 18.5 && bmi <= 24.9 ? 'green' : 'red', // Green for normal, red otherwise
             }}
           >
             {bmiFeedback}
           </p>
         </div>
          )}
        </div>
      )}

      <div className="categories">
        {Object.keys(dietPlans).map((category) => (
          <div
            className="card"
            key={category}
            onClick={() => handleCardClick(category)}
          >
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <p>Click to explore more about {category} health.</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCategory && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)}{" "}
              Diet Plan
            </h2>
            <ul>
              {dietPlans[selectedCategory].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}