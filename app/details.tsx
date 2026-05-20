import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

// Optional: If you need type for "flying" (often light blue-gray)
// flying: "#b3e5fc"};

type Pokemon = {
  name: string;
  image: string;
  imageBack: string;
  types: string;
};
export default function Details() {
  const params = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<Pokemon[]>();

  console.log(params.name);

  useEffect(() => {
    fetchPokemon();
  }, []);
  async function fetchPokemon() {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${params.name}`,
      );

      if (response.ok) {
        const data = await response.json();

        // //modified the details and made accessing the key easier when getting a detail from a pokemon
        // const compressed_details = await Promise.all(
        //   data.results.map(async (pokemon: any) => {
        //     const res = await fetch(pokemon.url);
        //     const details = await res.json();

        //     return {
        //       name: pokemon.name,
        //       image: details.sprites.front_default,
        //       imageBack: details.sprites.back_default,
        //       types: details.types,
        //     };
        //   }),
        // );

        // console.log(JSON.stringify(compressed_details[0], null, 2));

        // setPokemon(compressed_details);
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
    ></ScrollView>
  );
}

// const styles = StyleSheet.create([{

// }]);
