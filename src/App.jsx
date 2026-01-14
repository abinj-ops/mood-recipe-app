import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSmile, FaTired, FaGrinStars, FaLeaf, FaMoon, FaSun, FaLanguage, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en'); 
  const [expandedId, setExpandedId] = useState(null);

  // --- 1. LOCAL MALAYALAM DATA (With Accurate Images) ---
  const malayalamRecipes = {
    Happy: [
      {
        idMeal: "m1",
        strMeal: "സേമിയ പായസം",
        strMealThumb: "http://googleusercontent.com/image_collection/image_retrieval/4977577685159482343_0",
        strYoutube: "https://www.youtube.com/results?search_query=semiya+payasam+malayalam",
        ingredients: ["സേമിയ - 1 കപ്പ്", "പാൽ - 1 ലിറ്റർ", "പഞ്ചസാര - ആവശ്യത്തിന്", "ഏലയ്ക്ക - 2 എണ്ണം", "അണ്ടിപരിപ്പ് - 10 എണ്ണം"],
        strInstructions: "1. ഒരു പാത്രത്തിൽ നെയ്യ് ചൂടാക്കി അണ്ടിപരിപ്പും മുന്തിരിയും വറുക്കുക.\n2. അതേ നെയ്യിൽ സേമിയ വറുത്തെടുക്കുക.\n3. പാൽ തിളപ്പിച്ച് അതിലേക്ക് വറുത്ത സേമിയ ഇടുക.\n4. സേമിയ വെന്തു വരുമ്പോൾ പഞ്ചസാരയും ഏലയ്ക്കയും ചേർക്കുക.\n5. കുറുകി വരുമ്പോൾ ഇറക്കി വെയ്ക്കുക."
      },
      {
        idMeal: "m2",
        strMeal: "ഉണ്ണിയപ്പം",
        strMealThumb: "http://googleusercontent.com/image_collection/image_retrieval/6226213277873028949_0",
        strYoutube: "https://www.youtube.com/results?search_query=unniyappam+malayalam",
        ingredients: ["അരിപ്പൊടി - 2 കപ്പ്", "ശർക്കര - 250 ഗ്രാം", "പാളയംകോടൻ പഴം - 2", "നെയ്യ് - ആവശ്യത്തിന്"],
        strInstructions: "1. ശർക്കര പാനി ആക്കി അരിച്ചെടുക്കുക.\n2. അരിപ്പൊടി, പഴം, ശർക്കര പാനി എന്നിവ മിക്സിയിൽ അടിക്കുക.\n3. മാവ് 4 മണിക്കൂർ വയ്ക്കുക.\n4. ഉണ്ണിയപ്പ ചട്ടിയിൽ എണ്ണ ഒഴിച്ച് ചൂടാകുമ്പോൾ മാവ് ഒഴിക്കുക.\n5. മറിച്ചിട്ടു വേവിക്കുക."
      }
    ],
    Tired: [
      {
        idMeal: "m3",
        strMeal: "പുട്ടും കടലയും",
        strMealThumb: "http://googleusercontent.com/image_collection/image_retrieval/168589079549031526_0",
        strYoutube: "https://www.youtube.com/results?search_query=puttu+kadala+malayalam",
        ingredients: ["പുട്ടുപൊടി - 2 കപ്പ്", "തേങ്ങ - 1 കപ്പ്", "കടല - 1 കപ്പ്", "സവാള - 2 എണ്ണം"],
        strInstructions: "1. പുട്ടുപൊടി ഉപ്പും വെള്ളവും ചേർത്ത് നനയ്ക്കുക.\n2. പുട്ടുകുറ്റിയിൽ തേങ്ങയും പൊടിയും മാറി മാറി നിറയ്ക്കുക.\n3. ആവിയിൽ വേവിക്കുക.\n4. കടല മസാല ചേർത്ത് കറി വെക്കുക."
      },
      {
        idMeal: "m4",
        strMeal: "കഞ്ഞിയും പയറും",
        strMealThumb: "http://googleusercontent.com/image_collection/image_retrieval/4929655197432382201_0",
        strYoutube: "https://www.youtube.com/results?search_query=kanji+payar+malayalam",
        ingredients: ["കുത്തരി - 1 കപ്പ്", "ചെറുപയർ - 1/2 കപ്പ്", "തേങ്ങ - 1/2 കപ്പ്", "കാന്താരി - 4 എണ്ണം"],
        strInstructions: "1. അരി നന്നായി കഴുകി കുക്കറിൽ വേവിക്കുക.\n2. ചെറുപയർ തോരൻ വെക്കുക.\n3. ചുട്ട പപ്പടവും അച്ചാറും കൂട്ടി കഴിക്കുക. ക്ഷീണം മാറാൻ ഉത്തമം."
      }
    ],
    Stressed: [
      {
        idMeal: "m5",
        strMeal: "കപ്പയും മീൻ കറിയും",
        strMealThumb: "http://googleusercontent.com/image_collection/image_retrieval/13225396059902310761_0",
        strYoutube: "https://www.youtube.com/results?search_query=kappa+meen+curry+malayalam",
        ingredients: ["കപ്പ - 1 കിലോ", "മീൻ - 500 ഗ്രാം", "മുളകുപൊടി - 2 ടീസ്പൂൺ", "കുടംപുളി - 3 എണ്ണം"],
        strInstructions: "1. കപ്പ ഉപ്പും മഞ്ഞളും ചേർത്ത് വേവിക്കുക.\n2. മീൻ മുളകും പുളിയും ചേർത്ത് മൺചട്ടിയിൽ വറ്റിച്ചെടുക്കുക.\n3. കപ്പയുടെ കൂടെ നല്ല എരിവുള്ള മീൻ കറി കഴിക്കുക."
      }
    ],
    Healthy: [
      {
        idMeal: "m6",
        strMeal: "അവിയൽ",
        strMealThumb: "http://googleusercontent.com/image_collection/image_retrieval/4453510179568555944_0",
        strYoutube: "https://www.youtube.com/results?search_query=avial+kerala+style",
        ingredients: ["പച്ചക്കറികൾ - 500 ഗ്രാം", "തേങ്ങ - 1 കപ്പ്", "ജീരകം - 1 നുള്ള്", "തൈര് - 1/2 കപ്പ്", "വെളിച്ചെണ്ണ - 2 ടീസ്പൂൺ"],
        strInstructions: "1. പച്ചക്കറികൾ നീളത്തിൽ അരിയുക.\n2. ഉപ്പും മഞ്ഞളും ചേർത്ത് വേവിക്കുക.\n3. തേങ്ങയും ജീരകവും ചതച്ച് ചേർക്കുക.\n4. അവസാനം തൈരും പച്ച വെളിച്ചെണ്ണയും ഒഴിക്കുക."
      }
    ]
  };

  const content = {
    en: {
      title: "Mood Recipe Finder 😋",
      subtitle: "How are you feeling right now?",
      loading: "Finding the perfect meal...",
      btnVideo: "Watch Video ▶",
      btnRead: "Read Recipe 📜",
      ingredients: "Ingredients",
      instructions: "Instructions",
      moods: { Happy: "Happy", Tired: "Tired", Stressed: "Stressed", Healthy: "Healthy" }
    },
    ml: {
      title: "മൂഡ് റെസിപ്പി ഫൈൻഡർ 😋",
      subtitle: "നിങ്ങൾക്ക് ഇപ്പോൾ എങ്ങനെയുണ്ട്?",
      loading: "മികച്ച ഭക്ഷണം തിരയുന്നു...",
      btnVideo: "വീഡിയോ കാണുക ▶",
      btnRead: "പാചകക്കുറിപ്പ് 📜",
      ingredients: "ചേരുവകൾ",
      instructions: "പാചകരീതി",
      moods: { Happy: "സന്തോഷം", Tired: "ക്ഷീണം", Stressed: "സമ്മർദ്ദം", Healthy: "ആരോഗ്യം" }
    }
  };

  const t = content[language]; 
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'en' ? 'ml' : 'en';
      setRecipes([]); 
      setSelectedMood(''); 
      return newLang;
    });
  };
  
  const toggleRecipe = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : '';
  }, [isDarkMode]);

  const moodMap = [
    { mood: "Happy", icon: <FaGrinStars />, category: "Dessert" },
    { mood: "Tired", icon: <FaTired />, category: "Breakfast" },
    { mood: "Stressed", icon: <FaSmile />, category: "Pasta" },
    { mood: "Healthy", icon: <FaLeaf />, category: "Vegetarian" },
  ];

  const fetchRecipes = async (category, mood) => {
    setLoading(true);
    setSelectedMood(mood);
    setExpandedId(null);

    if (language === 'ml') {
      const localData = malayalamRecipes[mood] || malayalamRecipes['Happy'];
      setTimeout(() => {
        setRecipes(localData);
        setLoading(false);
      }, 500);
    } else {
      try {
        const { data } = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const topMeals = data.meals.slice(0, 3);
        const detailedMeals = await Promise.all(
          topMeals.map(async (meal) => {
            const details = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            return details.data.meals[0];
          })
        );
        setRecipes(detailedMeals);
      } catch (error) {
        console.error("Error fetching data", error);
      }
      setLoading(false);
    }
  };

  const getIngredients = (meal) => {
    if (meal.ingredients) return meal.ingredients;
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
      } else {
        break;
      }
    }
    return ingredients;
  };

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="app-container">
        <div className="header-controls">
           <button onClick={toggleLanguage} className="icon-btn" title="Switch Language">
             <FaLanguage /> {language === 'en' ? 'MAL' : 'ENG'}
           </button>
           <button onClick={toggleTheme} className="icon-btn" title="Toggle Theme">
             {isDarkMode ? <FaSun /> : <FaMoon />}
           </button>
        </div>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <div className="button-container">
          {moodMap.map((item) => (
            <button 
              key={item.mood} 
              onClick={() => fetchRecipes(item.category, item.mood)}
              className={`mood-btn ${selectedMood === item.mood ? 'active' : ''}`}
            >
              {item.icon} {t.moods[item.mood]}
            </button>
          ))}
        </div>
        <div className="recipe-grid">
          {loading && <p>{t.loading}</p>}
          {recipes.map((recipe) => (
            <div key={recipe.idMeal} className={`recipe-card ${expandedId === recipe.idMeal ? 'expanded' : ''}`}>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              <h3>{recipe.strMeal}</h3>
              <div className="card-actions">
                <button className="text-btn" onClick={() => toggleRecipe(recipe.idMeal)}>
                  {t.btnRead} {expandedId === recipe.idMeal ? <FaChevronUp/> : <FaChevronDown/>}
                </button>
                <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className="video-btn">
                  {t.btnVideo}
                </a>
              </div>
              {expandedId === recipe.idMeal && (
                <div className="recipe-details">
                  <h4>{t.ingredients}:</h4>
                  <ul>
                    {getIngredients(recipe).map((ing, index) => (
                      <li key={index}>{ing}</li>
                    ))}
                  </ul>
                  <h4>{t.instructions}:</h4>
                  <p>{recipe.strInstructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;