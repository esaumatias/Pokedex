export const requestNamePokemon = async () => {
  const URL = `https://pokeapi.co/api/v2/pokemon?limit=1000&offset=200`;
  try {
    const response = await fetch(URL);
    const responseJSON = await response.json();
    return responseJSON.results;
  } catch (error) {
    console.log(error);
  }
};

export const requestAbilityPokemon = async (ability) => {
  const URL = `https://pokeapi.co/api/v2/ability/${ability}`;
  try {
    const response = await fetch(URL);
    const responseJSON = await response.json();
    return responseJSON.results;
  } catch (error) {
    console.log(error);
  }
};

export const requestTypePokemon = async (type) => {
  const URL = `https://pokeapi.co/api/v2/type/${type}`;
  try {
    const response = await fetch(URL);
    const responseJSON = await response.json();
    return responseJSON.results;
  } catch (error) {
    console.log(error);
  }
};

export const requestDetailsPokemon = async (name) => {
  const URL = `https://pokeapi.co/api/v2/pokemon/${name}`;
  try {
    const response = await fetch(URL);
    const responseJSON = await response.json();
    return responseJSON;
  } catch (error) {
    console.log(error);
  }
};

export const locationAreaEncounters = async (URL) => {
  try {
    const response = await fetch(URL);
    const responseJSON = await response.json();
    return responseJSON;
  } catch (error) {
    console.log(error);
  }
};
