/**
 * AI Weather Recommendations Engine
 * Rule-based expert system providing actionable lifestyle, health, fitness,
 * clothing, and travel recommendations derived from live Open-Meteo metrics.
 */

export function generateWeatherRecommendations(weatherData) {
  if (!weatherData) return null;

  const { current, daily = [], airQuality = {} } = weatherData;
  const temp = current.temp ?? 25;
  const feelsLike = current.feelsLike ?? temp;
  const humidity = current.humidity ?? 50;
  const windSpeed = current.windSpeed ?? 10;
  const condition = (current.condition || '').toLowerCase();
  const uvMax = daily[0]?.uvIndexMax ?? (current.isDay ? 5 : 0);
  const rainProb = daily[0]?.pop ?? 0;
  const aqi = airQuality.value ?? 50;

  // 1. Clothing & Outfit Recommendation
  let clothing = {
    title: 'Comfortable Light Layers',
    badge: 'Pleasant & Mild',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    description: 'Cotton t-shirt, breathable shirt or blouse. Keep a light cardigan or overshirt handy for cooler evening breezes.',
    items: ['Breathable cotton fabrics', 'Comfortable sneakers', 'Light evening layer']
  };

  if (temp >= 33 || feelsLike >= 35) {
    clothing = {
      title: 'Ultra-Light & Breathable',
      badge: 'High Heat',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      description: 'Loose-fitting, light-colored linen or moisture-wicking fabrics. Avoid synthetic or dark materials that trap heat.',
      items: ['Loose linen/cotton', 'Light colors', 'Sunglasses & sunhat', 'Open breathable footwear']
    };
  } else if (temp >= 24) {
    clothing = {
      title: 'Warm Weather Casual',
      badge: 'Warm',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      description: 'Standard warm-weather wear: short-sleeve shirts, shorts or light trousers. Comfortable and airy attire recommended.',
      items: ['Short-sleeve shirts', 'Light trousers or shorts', 'Casual footwear']
    };
  } else if (temp < 12) {
    clothing = {
      title: 'Winter Warmth & Heavy Layers',
      badge: 'Chilly / Cold',
      badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
      description: 'Insulated winter jacket or wool coat, thermal base layer, warm sweater, and closed boots.',
      items: ['Warm thermal innerwear', 'Fleece / wool sweater', 'Heavy jacket', 'Scarf & beanie']
    };
  } else if (temp < 18) {
    clothing = {
      title: 'Mid-Weight Jackets & Sweaters',
      badge: 'Cool Weather',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
      description: 'Denim jacket, light puffer or hoodie over long sleeves. Keeps you warm against brisk winds.',
      items: ['Jacket or hoodie', 'Long trousers / jeans', 'Closed shoes']
    };
  }

  // 2. Rain & Umbrella Advice
  let rainAdvice = {
    needed: false,
    title: 'No Umbrella Required',
    badge: 'Dry Day',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    description: `Very low probability of precipitation (${rainProb}%). Enjoy dry conditions throughout your day.`
  };

  if (condition.includes('thunder') || condition.includes('storm')) {
    rainAdvice = {
      needed: true,
      title: 'Thunderstorm Protection & Shelter',
      badge: 'Severe Storm Alert',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      description: 'Lightning risk and gusty downpours detected. Avoid carrying metallic umbrellas in open spaces; remain sheltered indoors.'
    };
  } else if (condition.includes('rain') || condition.includes('drizzle') || rainProb >= 50) {
    rainAdvice = {
      needed: true,
      title: 'Carry an Umbrella & Waterproof Bag',
      badge: `${rainProb}% Rain Probability`,
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      description: 'Precipitation is actively occurring or likely. Bring a compact umbrella and wear water-resistant shoes to avoid slippery footing.'
    };
  } else if (rainProb >= 25) {
    rainAdvice = {
      needed: false,
      title: 'Isolated Showers Possible',
      badge: 'Unsettled Skies',
      badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300',
      description: 'Occasional light showers or passing clouds possible. Keeping a small folding umbrella in your bag is sensible.'
    };
  }

  // 3. UV & Sun Protection
  let uvAdvice = {
    level: 'Low UV Exposure',
    badge: `UV ${uvMax.toFixed(1)}`,
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    description: 'Safe for extended outdoor exposure without sunburn risk. Standard skin moisturization is sufficient.'
  };

  if (uvMax >= 8) {
    uvAdvice = {
      level: 'Very High / Extreme Solar Radiation',
      badge: `UV ${uvMax.toFixed(1)} (Hazardous)`,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      description: 'Severe risk of skin and eye damage. Apply broad-spectrum SPF 50+ sunscreen every 2 hours, wear UV-blocking sunglasses, and seek shade between 11 AM - 3 PM.'
    };
  } else if (uvMax >= 6) {
    uvAdvice = {
      level: 'High UV Radiation',
      badge: `UV ${uvMax.toFixed(1)} (High)`,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      description: 'Protection essential. Apply SPF 30+ sunscreen, wear a cap or hat, and limit direct unshaded midday sun exposure.'
    };
  } else if (uvMax >= 3) {
    uvAdvice = {
      level: 'Moderate UV Index',
      badge: `UV ${uvMax.toFixed(1)} (Moderate)`,
      badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300',
      description: 'Moderate sun intensity. Wear sunglasses and consider light sunscreen if planning outdoor activities exceeding 45 minutes.'
    };
  }

  // 4. Hydration & Health
  let hydrationAdvice = {
    target: '2.0 - 2.5 Liters',
    title: 'Standard Daily Hydration',
    tips: 'Maintain regular fluid intake throughout the day with clean water and herbal teas.'
  };

  if (temp >= 32 || (temp >= 28 && humidity >= 65)) {
    hydrationAdvice = {
      target: '3.0 - 3.5 Liters',
      title: 'Increased Hydration Required',
      tips: 'High ambient temperature or muggy humidity causes accelerated fluid loss. Drink electrolyte-rich fluids, coconut water, and carry a water bottle.'
    };
  } else if (humidity < 30) {
    hydrationAdvice = {
      target: '2.5 Liters + Moisturizer',
      title: 'Dry Air Compensatory Intake',
      tips: 'Dry atmospheric air increases dehydration and chaps skin. Drink water regularly and use lip balm and skin moisturizer.'
    };
  }

  // 5. Outdoor Exercise & Fitness
  let fitnessAdvice = {
    status: 'Optimal Conditions',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    bestTime: 'Morning or Early Evening',
    description: 'Weather conditions are fantastic for jogging, cycling, yoga, and outdoor sports.'
  };

  if (aqi > 150) {
    fitnessAdvice = {
      status: 'Avoid Outdoor Workouts',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      bestTime: 'Switch to Indoor Gym / Home Workout',
      description: 'Elevated air pollution poses cardiovascular and respiratory strain during vigorous exercise. Exercise indoors today.'
    };
  } else if (temp >= 34) {
    fitnessAdvice = {
      status: 'High Heat Caution',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      bestTime: 'Before 7:30 AM or after 6:30 PM',
      description: 'Midday heat stroke risk is high. Limit strenuous outdoor cardio to early morning hours and maintain abundant hydration.'
    };
  } else if (condition.includes('thunder') || condition.includes('heavy rain')) {
    fitnessAdvice = {
      status: 'Indoors Recommended',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      bestTime: 'Indoor Treadmill / Bodyweight Routine',
      description: 'Heavy rainfall and slippery tracks create hazard. Move fitness sessions indoors.'
    };
  }

  // 6. Travel & Commute Advisory
  let travelAdvice = {
    status: 'Smooth Commute',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    description: 'Roads and transit routes are clear with normal visibility and dry conditions.'
  };

  if (condition.includes('fog') || condition.includes('mist')) {
    travelAdvice = {
      status: 'Reduced Visibility Caution',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      description: 'Dense fog or haze reduces forward sightlines. Use low-beam fog lamps, slow down, and maintain safe following distances.'
    };
  } else if (windSpeed >= 40) {
    travelAdvice = {
      status: 'High Crosswind Advisory',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      description: 'Strong gusts may destabilize two-wheelers and high-profile vehicles on open highways and flyovers.'
    };
  } else if (condition.includes('rain') || condition.includes('storm')) {
    travelAdvice = {
      status: 'Wet Roads & Congestion',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      description: 'Expect slower traffic speeds, potential puddles or waterlogging in low-lying intersections. Allow 15-20 minutes extra travel time.'
    };
  }

  return {
    clothing,
    rainAdvice,
    uvAdvice,
    hydrationAdvice,
    fitnessAdvice,
    travelAdvice
  };
}
