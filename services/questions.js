let url = "https://opentdb.com/api.php?";
const axios = require("axios");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function getData(amount, category, difficulty) {
  try {
    let newUrl = url + `amount=${amount}`;

    if (category !== "any") newUrl += `&category=${category}`;
    if (difficulty !== "any") newUrl += `&difficulty=${difficulty}`;

    let res = await axios.get(newUrl + "&type=multiple");

    return res.data.results;
  } catch (err) {
    console.log("error");
  }
}

async function getQuestions(amount, category, difficulty) {
  const data = await getData(amount, category, difficulty);

  if (data && data.length > 0) {
    const questions = data.map((q) => {
      let answers = [...q.incorrect_answers, q.correct_answer];
      q.options = shuffleArray(answers);
      return q;
    });

    return questions;
  } else {
    console.log("No questions returned from API");
    return [];
  }
}

module.exports = { getQuestions };
