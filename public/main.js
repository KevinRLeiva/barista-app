document.querySelector("button").addEventListener("click", pickOne);

function pickOne() {
  let pokemon = document.getElementById("pokemon").value;
  let error = document.getElementById('error')

  let apiURL =
    "https://pokeapi.co/api/v2/pokemon/" + pokemon;
  fetch(apiURL)
    .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
    .then(response => {
      console.log(response);

      document.querySelector("#name").innerHTML = response.species.name;
      document.querySelector("#ability").innerHTML = response.abilities[0].ability.name;
      document.querySelector("#sprite").src = response.sprites.front_default;
      document.querySelector("#version").innerHTML = response.game_indices[4].version.name;

      console.log(response.species.name);
      console.log(response.abilities[0].ability.name);
      console.log(response.sprites.front_default);
      console.log(response.game_indices[4].version.name);
    })

    .catch(err => {
      console.log(`error ${err}`);
      error.innerHTML = '';
      let errorMsg = "We're sorry! We can't find the description for this one."
      error.innerHTML = errorMsg;
      alert(errorMsg);
    });
}
