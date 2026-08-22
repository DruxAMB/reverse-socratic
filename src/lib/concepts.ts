export type Misconception = {
  id: string;
  label: string;
  wrongBelief: string;
  correctUnderstanding: string;
};

export type Concept = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  misconceptions: Misconception[];
  openingLine: string;
};

export const concepts: Concept[] = [
  {
    id: "electricity",
    title: "How Electricity Works",
    subtitle: "Electrons, current, and voltage — what's actually moving?",
    category: "Physics",
    icon: "bolt",
    misconceptions: [
      {
        id: "planetary-orbit",
        label: "Planetary orbit model",
        wrongBelief: "Electrons orbit the nucleus like planets orbit the sun, in fixed circular paths.",
        correctUnderstanding:
          "Electrons exist in probability clouds called orbitals. There is no fixed path — only regions where electrons are likely to be found.",
      },
      {
        id: "speed-equals-current",
        label: "Speed = current",
        wrongBelief: "Electric current means electrons are moving very fast through the wire.",
        correctUnderstanding:
          "Individual electrons drift slowly (mm/s). Current is the flow rate of charge. The electric signal propagates fast, but the electrons themselves do not.",
      },
      {
        id: "nucleus-is-source",
        label: "Nucleus is the source",
        wrongBelief: "The nucleus of an atom is what produces or sources electrical energy.",
        correctUnderstanding:
          "Electrical energy comes from the movement of charge (current) driven by a potential difference (voltage). The nucleus holds the atom together; it is not the source of electrical energy in a circuit.",
      },
    ],
    openingLine:
      "OK so — electrons orbit the nucleus like planets orbit the sun, right? And electricity is just electrons moving really fast through a wire?",
  },
  {
    id: "photosynthesis",
    title: "Photosynthesis",
    subtitle: "How plants turn light into food — and what they actually produce",
    category: "Biology",
    icon: "leaf",
    misconceptions: [
      {
        id: "soil-is-food",
        label: "Plants eat soil",
        wrongBelief: "Plants get their food (mass/energy) from the soil through their roots.",
        correctUnderstanding:
          "Plants build their mass from CO2 in the air. The soil provides water and minerals, but the carbon that makes up the plant's body comes from the atmosphere, not the dirt.",
      },
      {
        id: "oxygen-from-co2",
        label: "Oxygen comes from CO2",
        wrongBelief: "The oxygen plants release during photosynthesis comes from the CO2 they absorb.",
        correctUnderstanding:
          "The oxygen released comes from water (H2O), not CO2. The Calvin cycle uses CO2 to build sugars, while the light reactions split water molecules, releasing O2 as a byproduct.",
      },
      {
        id: "plants-breathe-co2",
        label: "Plants don't respire",
        wrongBelief: "Plants only take in CO2 and release oxygen — they don't need oxygen themselves.",
        correctUnderstanding:
          "Plants respire just like animals: they take in oxygen and release CO2 all the time, including at night. Photosynthesis and respiration are separate processes that happen simultaneously during the day.",
      },
    ],
    openingLine:
      "So plants get their food from the soil through their roots, right? And they take in CO2 and release oxygen — the oxygen comes from that CO2?",
  },
  {
    id: "natural-selection",
    title: "Natural Selection",
    subtitle: "Evolution isn't about what organisms 'want' or 'need'",
    category: "Biology",
    icon: "dna",
    misconceptions: [
      {
        id: "organisms-want",
        label: "Organisms evolve what they want",
        wrongBelief: "Organisms develop traits because they want or need them to survive.",
        correctUnderstanding:
          "Traits arise from random genetic mutations. Natural selection favors traits that improve survival and reproduction, but the organism doesn't choose or will them into existence.",
      },
      {
        id: "survival-of-strongest",
        label: "Survival of the strongest",
        wrongBelief: "Natural selection means only the physically strongest survive.",
        correctUnderstanding:
          "Fitness means reproductive success, not physical strength. A small, camouflaged organism that reproduces more is 'fitter' than a large, strong one that doesn't.",
      },
      {
        id: "evolution-toward-goal",
        label: "Evolution has a goal",
        wrongBelief: "Evolution is working toward a goal, like making organisms more advanced or complex.",
        correctUnderstanding:
          "Evolution has no goal or direction. It is a blind process: mutations happen randomly, and selection filters them based on current environmental conditions. 'More evolved' doesn't mean 'better' or 'more complex.'",
      },
    ],
    openingLine:
      "So in natural selection, organisms develop the traits they need to survive, right? Like giraffes grew long necks because they needed to reach high leaves — and the strongest ones are the ones that survive?",
  },
  {
    id: "sky-blue",
    title: "Why the Sky Is Blue",
    subtitle: "Scattering, not absorption — and the sky isn't actually blue",
    category: "Physics",
    icon: "sky",
    misconceptions: [
      {
        id: "reflects-ocean",
        label: "Sky reflects the ocean",
        wrongBelief: "The sky is blue because it reflects the color of the oceans.",
        correctUnderstanding:
          "The sky is blue due to Rayleigh scattering: shorter wavelengths (blue) of sunlight are scattered more by air molecules than longer wavelengths. The ocean has nothing to do with it.",
      },
      {
        id: "absorbs-other-colors",
        label: "Air absorbs other colors",
        wrongBelief: "The atmosphere absorbs all colors except blue, which is why we see blue.",
        correctUnderstanding:
          "The atmosphere doesn't absorb other colors — it scatters them. Blue is scattered more strongly, so we see it coming from all directions. At sunset, the light passes through more atmosphere, scattering away the blue and leaving red/orange.",
      },
      {
        id: "sky-is-actually-blue",
        label: "The sky is inherently blue",
        wrongBelief: "The sky itself is blue — it's a thing with a blue color.",
        correctUnderstanding:
          "The sky is not an object with a color. It's air that scatters sunlight. The 'blue' is an optical effect of scattered light reaching your eyes from all directions. In space (no atmosphere), the sky is black.",
      },
    ],
    openingLine:
      "The sky is blue because it reflects the ocean, right? Like the atmosphere just absorbs all the other colors and only lets blue through?",
  },
  {
    id: "seasons",
    title: "Why We Have Seasons",
    subtitle: "It's about tilt, not distance from the sun",
    category: "Astronomy",
    icon: "sun",
    misconceptions: [
      {
        id: "distance-causes-seasons",
        label: "Distance from the sun",
        wrongBelief: "Seasons happen because Earth gets closer to the sun in summer and farther in winter.",
        correctUnderstanding:
          "Seasons are caused by Earth's axial tilt (23.5°), not distance. In fact, Earth is closest to the sun in January (northern winter) and farthest in July. The tilt changes the angle and duration of sunlight hitting each hemisphere.",
      },
      {
        id: "hemispheres-same-season",
        label: "Whole Earth has same season",
        wrongBelief: "When it's summer in the Northern Hemisphere, it's summer everywhere.",
        correctUnderstanding:
          "Seasons are opposite in the Northern and Southern Hemispheres because of the tilt. When the Northern Hemisphere tilts toward the sun (summer), the Southern tilts away (winter).",
      },
      {
        id: "tilt-toward-is-closer",
        label: "Tilt means closer to sun",
        wrongBelief: "A hemisphere's summer happens because tilting toward the sun brings it physically closer.",
        correctUnderstanding:
          "The tilt doesn't meaningfully change distance to the sun — it changes the angle of incidence and day length. More direct sunlight (higher angle) and longer days mean more energy absorbed, which causes summer.",
      },
    ],
    openingLine:
      "Seasons happen because Earth gets closer to the sun in summer and farther away in winter, right? That's why it's hotter in summer?",
  },
];

export function getConcept(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}
