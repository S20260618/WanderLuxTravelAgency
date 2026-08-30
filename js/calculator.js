/**
 * WanderLux Travel Agency - Trip Cost Calculator Logic
 * Handles dynamic cost calculation based on destination, travellers, days, and style.
 * Unit: ICT502 - Internet and Web Development
 */

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
});

function initCalculator() {
  const form = document.getElementById('trip-calculator-form');
  if (!form) return;

  // Destination Database (Base rates per person per day & base accommodation per night)
  const destinationData = {
    bali: { name: 'Bali, Indonesia', dailyRate: 110, accomRate: 150, flightsAvg: 450 },
    paris: { name: 'Paris, France', dailyRate: 190, accomRate: 280, flightsAvg: 1100 },
    tokyo: { name: 'Tokyo, Japan', dailyRate: 180, accomRate: 240, flightsAvg: 950 },
    newyork: { name: 'New York, USA', dailyRate: 210, accomRate: 320, flightsAvg: 1200 },
    queenstown: { name: 'Queenstown, NZ', dailyRate: 140, accomRate: 200, flightsAvg: 500 },
    maldives: { name: 'Maldives Overwater', dailyRate: 260, accomRate: 450, flightsAvg: 1300 },
    rome: { name: 'Rome, Italy', dailyRate: 160, accomRate: 220, flightsAvg: 1050 },
    goldcoast: { name: 'Gold Coast, Australia', dailyRate: 130, accomRate: 190, flightsAvg: 300 }
  };

  // Travel Style Multipliers
  const styleMultipliers = {
    budget: { multiplier: 0.85, label: 'Budget Travel Package' },
    standard: { multiplier: 1.0, label: 'Standard Travel Package' },
    luxury: { multiplier: 1.65, label: 'Luxury VIP Package' }
  };

  // Input elements
  const destSelect = document.getElementById('calc-destination');
  const travelersInput = document.getElementById('calc-travelers');
  const daysInput = document.getElementById('calc-days');
  const styleInputs = document.querySelectorAll('input[name="calc-style"]');
  const includeFlightsCheckbox = document.getElementById('calc-flights');
  const includeInsuranceCheckbox = document.getElementById('calc-insurance');

  // Output elements
  const displayTotal = document.getElementById('display-total-cost');
  const displaySummaryNote = document.getElementById('display-summary-note');
  const displayDestName = document.getElementById('breakdown-dest');
  const displayTravelers = document.getElementById('breakdown-travelers');
  const displayDays = document.getElementById('breakdown-days');
  const displayStyle = document.getElementById('breakdown-style');
  const displayDailyBase = document.getElementById('breakdown-daily-base');
  const displayAccom = document.getElementById('breakdown-accom');
  const displayAddons = document.getElementById('breakdown-addons');
  const bookBtn = document.getElementById('btn-book-quote');

  function calculateEstimate() {
    const destKey = destSelect.value;
    const dest = destinationData[destKey] || destinationData.bali;
    
    let travelers = parseInt(travelersInput.value, 10);
    if (isNaN(travelers) || travelers < 1) travelers = 1;
    if (travelers > 50) travelers = 50;

    let days = parseInt(daysInput.value, 10);
    if (isNaN(days) || days < 1) days = 1;
    if (days > 90) days = 90;

    // Determine travel style
    let selectedStyle = 'standard';
    styleInputs.forEach(input => {
      if (input.checked) selectedStyle = input.value;
    });

    const styleInfo = styleMultipliers[selectedStyle] || styleMultipliers.standard;
    const styleMultiplier = styleInfo.multiplier;

    // Math:
    // 1. Daily Activities & Food: travelers * days * dailyRate * styleMultiplier
    const dailyCost = travelers * days * dest.dailyRate * styleMultiplier;

    // 2. Accommodation: rooms needed (ceil(travelers / 2)) * days * accomRate * styleMultiplier
    const roomsNeeded = Math.ceil(travelers / 2);
    const accomCost = roomsNeeded * days * dest.accomRate * styleMultiplier;

    // 3. Optional Add-ons
    let addonsCost = 0;
    if (includeFlightsCheckbox && includeFlightsCheckbox.checked) {
      addonsCost += travelers * dest.flightsAvg;
    }
    if (includeInsuranceCheckbox && includeInsuranceCheckbox.checked) {
      addonsCost += travelers * (days * 18); // $18 per person/day insurance
    }

    const grandTotal = Math.round(dailyCost + accomCost + addonsCost);
    const formattedTotal = '$' + grandTotal.toLocaleString('en-US');

    // Update UI elements
    if (displayTotal) displayTotal.textContent = formattedTotal;
    
    // Exact requested format from assignment:
    // "Estimated cost for 2 travellers to Bali for 5 days: $2,450 – Standard Travel Package."
    const summaryText = `Estimated cost for ${travelers} traveller${travelers > 1 ? 's' : ''} to ${dest.name} for ${days} days: ${formattedTotal} – ${styleInfo.label}.`;
    if (displaySummaryNote) displaySummaryNote.textContent = summaryText;

    if (displayDestName) displayDestName.textContent = dest.name;
    if (displayTravelers) displayTravelers.textContent = `${travelers} Person${travelers > 1 ? 's' : ''}`;
    if (displayDays) displayDays.textContent = `${days} Days`;
    if (displayStyle) displayStyle.textContent = styleInfo.label.split(' ')[0];
    if (displayDailyBase) displayDailyBase.textContent = '$' + Math.round(dailyCost).toLocaleString('en-US');
    if (displayAccom) displayAccom.textContent = '$' + Math.round(accomCost).toLocaleString('en-US');
    if (displayAddons) displayAddons.textContent = '$' + Math.round(addonsCost).toLocaleString('en-US');

    // Update Book Button link to pre-fill appointment page
    if (bookBtn) {
      const queryParams = new URLSearchParams({
        dest: dest.name,
        travelers: travelers,
        days: days,
        style: styleInfo.label.split(' ')[0],
        cost: formattedTotal
      });
      bookBtn.href = `appointment.html?${queryParams.toString()}`;
    }
  }

  // Bind event listeners for real-time recalculation
  destSelect.addEventListener('change', calculateEstimate);
  travelersInput.addEventListener('input', calculateEstimate);
  daysInput.addEventListener('input', calculateEstimate);
  styleInputs.forEach(input => input.addEventListener('change', calculateEstimate));
  if (includeFlightsCheckbox) includeFlightsCheckbox.addEventListener('change', calculateEstimate);
  if (includeInsuranceCheckbox) includeInsuranceCheckbox.addEventListener('change', calculateEstimate);

  // Form submit prevention (triggers calculation smoothly)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateEstimate();
  });

  // Initial calculation on page load
  calculateEstimate();
}
