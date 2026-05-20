import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { Image, ScrollView, Text, View } from "react-native";

//TODO adding now styles based on pokemon type
interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}
const colorsByType = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",

  // Optional extra types from newer games
  stellar: "#40C4FF",
  unknown: "#68A090",
  shadow: "#5A5A5A",
};
// Optional: If you need type for "flying" (often light blue-gray)
// flying: "#b3e5fc"};
export default function HomeScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  //Formats the JSON file
  console.log(JSON.stringify(pokemons[0], null, 2));
  useEffect(() => {
    //fetch pokemons
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=20",
      );
      if (response.ok) {
        const data = await response.json();

        //modified the details and made accessing the key easier when getting a detail from a pokemon
        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();

            return {
              name: pokemon.name,
              image: details.sprites.front_default,
              imageBack: details.sprites.back_default,
              types: details.types,
            };
          }),
        );

        setPokemons(detailedPokemons);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
      }}
    >
      {pokemons &&
        pokemons.map((pokemon) => (
          //Our dynamic route with dynamic parameter
          //Params shall receive an object thats why we wrap the pokemon name here
          <Link
            href={{ pathname: "/details", params: { name: pokemon.name } }}
            style={{
              //@ts-ignore -> ignores the type problem since it is not a future problem in production
              backgroundColor: colorsByType[pokemon.types[0].type.name] + 50,
              padding: 20,
              borderRadius: 20,
            }}
          >
            <View
              style={{
                //@ts-ignore -> ignores the type problem since it is not a future problem in production
                backgroundColor: colorsByType[pokemon.types[0].type.name] + 50,
                padding: 20,
                borderRadius: 20,
              }}
            >
              <Text style={styles.name}>{pokemon.name}</Text>
              <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{ uri: pokemon.image }}
                  style={{ width: 150, height: 150 }}
                />
                <Image
                  source={{ uri: pokemon.imageBack }}
                  style={{ width: 150, height: 150 }}
                />
              </View>
            </View>
          </Link>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
    textAlign: "center",
  },
});
