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
  // Original types (enhanced)
  grass: "#4caf50", // Lively, bright green
  fire: "#ff5722", // Deep orange-red
  water: "#2196f3", // Strong, clear blue
  bug: "#8bc34a", // Fresh light green
  normal: "#9e9e9e", // Clean, neutral gray

  // Additional types
  electric: "#ffeb3b", // Bright, striking yellow
  ground: "#cd853f", // Warm earthy brown
  rock: "#a0522d", // Solid, rocky brown
  poison: "#ab47bc", // Deep purple (toxic vibe)
  fighting: "#d32f2f", // Intense red (combat)
  psychic: "#ff4081", // Vibrant pink (mind power)
  ghost: "#7b1fa2", // Dark purple (spectral)
  ice: "#81d4fa", // Cool, icy light blue
  dragon: "#f57c00", // Gold/orange (mythical)
  dark: "#424242", // Dark gray (sinister)
  steel: "#b0bec5", // Metallic silver-gray
  fairy: "#f48fb1", // Soft pastel pink
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
          <View
            style={{
              //@ts-ignore
              backgroundColor: colorsByType[pokemon.types[0].type.name],
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
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
  },
});
