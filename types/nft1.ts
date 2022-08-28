export type Trait = "attack" | "health" | "speed";

export type NFTAttribute = {
  trait_type: Trait;
  value: string;
}

export type NFTMeta = {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
}