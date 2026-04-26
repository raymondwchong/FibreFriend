import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#F7F9FC", card: "#FFFFFF", accent: "#3D7EAA", aLight: "#E8F2F8",
  aDark: "#2A5F82", green: "#3A9E6F", gLight: "#E6F5EE",
  text: "#1A2332", muted: "#6B7A8D", border: "#E2E8F0",
  blue: "#2471A3", bLight: "#EBF5FB", bDark: "#1A5276",
  amber: "#C8794A", amberLight: "#FDF2EA",
};

// ── DATA ──────────────────────────────────────────────────────────────────────

const FIBRES = [
  { id: "psyllium", name: "Psyllium Husk", emoji: "🌾", description: "A gentle soluble fibre that forms a gel, supporting regularity and cholesterol.", microbes: ["Lactobacillus", "Bifidobacterium"], startDose: "3–5g", sensitivity: "Low", effects: ["Bulking", "Gel-forming", "Cholesterol support"], waterWarning: true },
  { id: "inulin", name: "Inulin / FOS", emoji: "🧅", description: "A prebiotic from chicory root that selectively feeds beneficial gut bacteria.", microbes: ["Bifidobacterium", "Faecalibacterium prausnitzii"], startDose: "2–4g", sensitivity: "Medium — can cause gas in sensitive people", effects: ["Prebiotic", "Gas production", "Bifidobacterium boost"] },
  { id: "beta_glucan", name: "Beta-Glucan", emoji: "🌿", description: "Found in oats and barley, clinically proven for blood sugar and cholesterol.", microbes: ["Roseburia", "Eubacterium rectale"], startDose: "3g", sensitivity: "Low", effects: ["Blood sugar blunting", "Cholesterol lowering", "Immune modulation"] },
  { id: "resistant_starch", name: "Resistant Starch", emoji: "🍌", description: "Escapes digestion and feeds butyrate-producing bacteria in the colon.", microbes: ["Ruminococcus bromii", "Faecalibacterium prausnitzii"], startDose: "5–10g", sensitivity: "Medium — may cause gas initially", effects: ["Butyrate production", "Colon fuel", "Insulin sensitivity"] },
  { id: "pectin", name: "Pectin", emoji: "🍎", description: "A soluble fibre from fruit peels that feeds a wide range of microbes.", microbes: ["Akkermansia muciniphila", "Bacteroides"], startDose: "5g", sensitivity: "Low", effects: ["Gel-forming", "Microbiome diversity", "Gut lining support"] },
  { id: "arabinogalactan", name: "Arabinogalactan", emoji: "🌲", description: "From larch trees, particularly good for immune function.", microbes: ["Lactobacillus", "Bifidobacterium", "Bacteroides"], startDose: "3–5g", sensitivity: "Low", effects: ["Immune modulation", "Prebiotic", "NK cell activity"] },
];

// ── Extended fibre list for experience quiz (kit fibres + research fibres) ────
const ALL_FIBRES_EXP = [
  { id: "psyllium",         name: "Psyllium Husk",            emoji: "🌾", kit: true,  desc: "Gel-forming, soluble — from Plantago ovata" },
  { id: "inulin",           name: "Inulin / FOS",             emoji: "🧅", kit: true,  desc: "Prebiotic fructan — chicory root" },
  { id: "beta_glucan",      name: "Beta-Glucan",              emoji: "🌿", kit: true,  desc: "Viscous soluble — oats and barley" },
  { id: "resistant_starch", name: "Resistant Starch",         emoji: "🍌", kit: true,  desc: "Fermentable — cooked-cooled starchy foods" },
  { id: "pectin",           name: "Pectin",                   emoji: "🍎", kit: true,  desc: "Soluble — fruit peels and cell walls" },
  { id: "arabinogalactan",  name: "Arabinogalactan",          emoji: "🌲", kit: true,  desc: "Prebiotic — larch tree extract" },
  { id: "arabinoxylan",     name: "Arabinoxylan",             emoji: "🌾", kit: false, desc: "Hemicellulose — wheat and cereal bran" },
  { id: "guar_gum",         name: "Guar Gum / PHGG",          emoji: "🫘", kit: false, desc: "Viscous galactomannan — guar beans" },
  { id: "wheat_bran",       name: "Wheat Bran",               emoji: "🍞", kit: false, desc: "Insoluble — wheat outer husk" },
  { id: "oat_bran",         name: "Oat Bran",                 emoji: "🥣", kit: false, desc: "Mixed soluble/insoluble — oat outer layer" },
  { id: "cellulose",        name: "Cellulose",                emoji: "🌿", kit: false, desc: "Insoluble structural — plant cell walls" },
  { id: "gos",              name: "Galacto-oligosaccharides", emoji: "🥛", kit: false, desc: "Prebiotic oligosaccharide — dairy derived" },
  { id: "xos",              name: "Xylo-oligosaccharides",    emoji: "🌽", kit: false, desc: "Prebiotic — corn cobs, sugarcane bagasse" },
  { id: "lactulose",        name: "Lactulose",                emoji: "🍯", kit: false, desc: "Synthetic disaccharide — laxative/prebiotic" },
  { id: "pea_fibre",        name: "Pea Fibre",                emoji: "🫛", kit: false, desc: "Mixed soluble/insoluble — yellow split peas" },
  { id: "flaxseed",         name: "Flaxseed / Linseed",       emoji: "🌻", kit: false, desc: "Mucilaginous soluble — flaxseed husk" },
  { id: "chicory",          name: "Chicory Root Fibre",       emoji: "☕", kit: false, desc: "Inulin-rich whole food — chicory root" },
  { id: "acacia",           name: "Acacia / Gum Arabic",      emoji: "🌵", kit: false, desc: "Highly soluble, low-viscosity — acacia tree" },
  { id: "apple_fibre",      name: "Apple Fibre",              emoji: "🍏", kit: false, desc: "Pectin-rich — apple pomace" },
  { id: "barley_fibre",     name: "Barley / Barley Bran",     emoji: "🌾", kit: false, desc: "Beta-glucan rich — whole barley grain" },
  { id: "legume_fibre",     name: "Legume / Bean Fibre",      emoji: "🫘", kit: false, desc: "Mixed — lentils, chickpeas, black beans" },
  { id: "chia",             name: "Chia Seeds",               emoji: "🌱", kit: false, desc: "Mucilaginous soluble — chia seed husk" },
  { id: "konjac",           name: "Konjac / Glucomannan",     emoji: "🧊", kit: false, desc: "Highly viscous soluble — konjac root" },
];

const EXP_POSITIVE = [
  { id: "regularity",   label: "Improved regularity",      emoji: "✅" },
  { id: "less_bloating",label: "Reduced bloating",         emoji: "🎈" },
  { id: "energy",       label: "More energy",              emoji: "⚡" },
  { id: "stool_form",   label: "Better stool consistency", emoji: "💩" },
  { id: "less_gas",     label: "Less gas",                 emoji: "💨" },
  { id: "satiety",      label: "Improved satiety",         emoji: "😌" },
  { id: "glucose",      label: "More stable blood sugar",  emoji: "📊" },
  { id: "less_cramps",  label: "Fewer cramps",             emoji: "🛡️" },
  { id: "mood",         label: "Better mood / cognition",  emoji: "🧠" },
  { id: "microbiome",   label: "Noticed microbiome shift", emoji: "🦠" },
];

const EXP_NEGATIVE = [
  { id: "bloating",     label: "Bloating",                     emoji: "🫧" },
  { id: "gas",          label: "Excessive gas",                emoji: "💨" },
  { id: "cramps",       label: "Cramps / pain",                emoji: "⚡" },
  { id: "loose_stools", label: "Loose stools",                 emoji: "💧" },
  { id: "constipation", label: "Constipation",                 emoji: "🐢" },
  { id: "nausea",       label: "Nausea",                       emoji: "🤢" },
  { id: "reflux",       label: "Reflux / heartburn",           emoji: "🌋" },
  { id: "urgency",      label: "Urgency / unpredictability",   emoji: "🚨" },
  { id: "headache",     label: "Headache",                     emoji: "🤕" },
  { id: "fatigue",      label: "Fatigue / malaise",            emoji: "😴" },
];

const EXP_SCALE = [
  { value:  2, label: "Very Favourable",   colour: "#27AE60", bg: "#E9F7EF",  boost:  4 },
  { value:  1, label: "Favourable",        colour: "#5DADE2", bg: "#EBF5FB",  boost:  2 },
  { value:  0, label: "No Effect",         colour: "#8C7B6E", bg: "#F5F5F0",  boost:  0 },
  { value: -1, label: "Unfavourable",      colour: "#E67E22", bg: "#FEF0E6",  boost: -2 },
  { value: -2, label: "Very Unfavourable", colour: "#C0392B", bg: "#FDECEA",  boost: -4 },
];

const SYMPTOMS = [
  { id: "flatulence",   label: "Flatulence",         emoji: "💨", colour: "#8B6914", bg: "#FFF8DC" },
  { id: "bloating",     label: "Bloating",            emoji: "🫧", colour: "#6B5B95", bg: "#F0EBF8" },
  { id: "cramps",       label: "Cramps",              emoji: "⚡", colour: "#C0392B", bg: "#FDECEA" },
  { id: "constipation", label: "Constipation",        emoji: "🐢", colour: "#7D5A3C", bg: "#F5EDE4" },
  { id: "diarrhoea",    label: "Diarrhoea",           emoji: "💧", colour: "#2980B9", bg: "#EBF5FB" },
  { id: "pain",         label: "Abdominal pain",      emoji: "🔥", colour: "#C0392B", bg: "#FDECEA" },
  { id: "nausea",       label: "Nausea",              emoji: "🤢", colour: "#1E8449", bg: "#E9F7EF" },
  { id: "headache",     label: "Headache",            emoji: "🤕", colour: "#7B7D7D", bg: "#F2F3F4" },
  { id: "malaise",      label: "Malaise",             emoji: "😔", colour: "#6C3483", bg: "#F5EEF8" },
  { id: "fatigue",      label: "Fatigue",             emoji: "😴", colour: "#5D6D7E", bg: "#EAF0F6" },
  { id: "reflux",       label: "Reflux / heartburn",  emoji: "🌋", colour: "#D35400", bg: "#FEF0E6" },
  { id: "appetite",     label: "Poor appetite",       emoji: "🍽️", colour: "#839192", bg: "#F2F3F4" },
  { id: "brain_fog",    label: "Brain fog",           emoji: "🌫️", colour: "#5D6D7E", bg: "#EAF0F6" },
  { id: "skin",         label: "Skin reaction",       emoji: "🔴", colour: "#CB4335", bg: "#FDECEA" },
  { id: "mood",         label: "Low mood",            emoji: "🌧️", colour: "#6C3483", bg: "#F5EEF8" },
];

const SEVERITY = [
  { v: 1, label: "Mild",     colour: "#27AE60" },
  { v: 2, label: "Moderate", colour: "#E67E22" },
  { v: 3, label: "Severe",   colour: "#C0392B" },
];

const BRISTOL_TYPES = [
  { type: 1, desc: "Separate hard lumps",  shape: "⚫⚫⚫", health: "Constipation",     healthColour: "#C0392B", healthBg: "#FDECEA" },
  { type: 2, desc: "Lumpy sausage",        shape: "🟤🟤",  health: "Mild constipation", healthColour: "#E67E22", healthBg: "#FEF0E6" },
  { type: 3, desc: "Sausage with cracks",  shape: "🟫",    health: "Normal",            healthColour: "#27AE60", healthBg: "#E9F7EF" },
  { type: 4, desc: "Smooth & soft",        shape: "🟤",    health: "Ideal ✓",           healthColour: "#27AE60", healthBg: "#E9F7EF" },
  { type: 5, desc: "Soft blobs",           shape: "🟡🟡",  health: "Lacking fibre",     healthColour: "#E67E22", healthBg: "#FEF0E6" },
  { type: 6, desc: "Fluffy & mushy",       shape: "🟡🟡🟡",health: "Mild diarrhoea",    healthColour: "#C0392B", healthBg: "#FDECEA" },
  { type: 7, desc: "Entirely liquid",      shape: "💧💧💧", health: "Diarrhoea",         healthColour: "#C0392B", healthBg: "#FDECEA" },
];

const STOOL_COLOURS = [
  { value: "brown",      label: "Brown",       hex: "#7B4A2B", note: "Normal" },
  { value: "dark_brown", label: "Dark brown",  hex: "#3E1F0B", note: "Normal" },
  { value: "yellow",     label: "Yellow",      hex: "#D4A017", note: "May indicate fast transit" },
  { value: "green",      label: "Green",       hex: "#4A7C3F", note: "Fast transit or diet" },
  { value: "pale",       label: "Pale / Clay", hex: "#C8B89A", note: "Could indicate bile issues" },
  { value: "black",      label: "Black",       hex: "#1A1A1A", note: "May need medical attention" },
  { value: "red",        label: "Red-tinged",  hex: "#8B1A1A", note: "Consult a doctor" },
];

// ── Glossary terms ────────────────────────────────────────────────────────────
const GLOSSARY = {
  monosaccharide: { term: "Monosaccharide", def: "The simplest unit of carbohydrate — a single sugar molecule. Examples include glucose, fructose, galactose, arabinose, and xylose. Dietary fibres are made of chains of monosaccharides, and which sugars are in that chain determines which bacteria can ferment them." },
  disaccharide: { term: "Disaccharide", def: "Two monosaccharides joined by a glycosidic bond. Sucrose (glucose + fructose), lactose (glucose + galactose), and lactulose are disaccharides. Some act as prebiotic substrates when they resist digestion." },
  polysaccharide: { term: "Polysaccharide", def: "A long chain of monosaccharides. Dietary fibres are polysaccharides — cellulose, pectin, inulin, beta-glucan, and resistant starch are all examples. The chain length (degree of polymerisation) affects fermentation rate and location in the gut." },
  prebiotic: { term: "Prebiotic", def: "A substrate selectively utilised by beneficial host microorganisms to confer a health benefit. Not all fibres are prebiotics — a prebiotic must selectively enrich specific beneficial bacteria rather than broadly feeding all microbes." },
  microbiome: { term: "Microbiome", def: "The collective genome of all microorganisms living in and on the body. The gut microbiome contains ~38 trillion bacteria, plus archaea, fungi, viruses, and protozoa. It encodes ~150× more genes than the human genome and is sometimes called a 'second genome'." },
  scfa: { term: "SCFAs (Short-Chain Fatty Acids)", def: "Organic acids with fewer than 6 carbons produced by bacterial fermentation of dietary fibre in the colon. The main SCFAs are acetate, propionate, and butyrate. They fuel colonocytes, regulate immune function, lower colonic pH, and signal through G-protein coupled receptors (GPR41, GPR43)." },
  butyrate: { term: "Butyrate", def: "A 4-carbon SCFA that is the primary energy source for colonocytes (colon lining cells). Butyrate strengthens tight junctions, promotes regulatory T-cell differentiation, inhibits inflammatory cytokines, and suppresses colorectal cancer cell proliferation. Produced primarily by Faecalibacterium prausnitzii, Roseburia, and Eubacterium rectale from resistant starch and certain prebiotics." },
  propionate: { term: "Propionate", def: "A 3-carbon SCFA transported to the liver where it inhibits cholesterol synthesis and gluconeogenesis. Also signals satiety through intestinal epithelial cells. Produced mainly by Bacteroides, Akkermansia, and Veillonella species from pectin, arabinoxylan, and other fibres." },
  acetate: { term: "Acetate", def: "The most abundant SCFA, produced by a wide range of bacteria including Bifidobacterium. Enters the bloodstream and is used as fuel in peripheral tissues. Also acts as a cross-feeding substrate, with other bacteria converting it to butyrate." },
  cazymes: { term: "CAZymes (Carbohydrate-Active enZymes)", def: "Enzymes that break down complex carbohydrates. Gut bacteria encode thousands of CAZymes — glycoside hydrolases, polysaccharide lyases, carbohydrate esterases, and glycosyltransferases. The CAZyme repertoire of a bacterium determines which fibres it can ferment. This is why monosaccharide composition of fibres predicts which bacteria will thrive on them." },
  glycosidicBond: { term: "Glycosidic Bond", def: "The chemical bond linking two sugar molecules together. The type of bond (alpha or beta, and which carbon position) dramatically affects whether human digestive enzymes or gut bacteria can break it. Beta-1,4 glycosidic bonds (cellulose, arabinoxylan) resist human digestion; alpha-1,6 bonds (branched starch) are more accessible." },
  fermentation: { term: "Fermentation", def: "In gut biology, the anaerobic microbial breakdown of dietary fibre into short-chain fatty acids, gases (CO₂, H₂, methane), and other metabolites. Fermentation rate and site depend on fibre structure — rapidly fermented fibres (FOS, short-chain inulin) ferment proximally, causing more gas; slowly fermented fibres (long-chain inulin, RS3) ferment distally with less bloating." },
  gutBarrier: { term: "Gut Barrier / Gut Lining", def: "The single-cell-thick epithelial layer separating the gut lumen from the body. It includes the mucus layer (produced by goblet cells), epithelial tight junctions, and immune cells in the lamina propria. When compromised ('leaky gut' or intestinal hyperpermeability), bacterial products like LPS enter the bloodstream, triggering systemic inflammation." },
  tightJunctions: { term: "Tight Junctions", def: "Protein complexes (including claudins, occludins, and ZO-1) that seal the gaps between adjacent epithelial cells in the gut lining. Butyrate strengthens tight junctions by activating AMP-kinase and upregulating claudin and ZO-1 expression. Compromised tight junctions contribute to leaky gut syndrome." },
  mucin: { term: "Mucin / Mucus Layer", def: "Gel-forming glycoproteins secreted by goblet cells that form the protective mucus layer lining the gut. MUC2 is the dominant colonic mucin. The outer mucus layer hosts beneficial bacteria including Akkermansia muciniphila. When dietary fibre is inadequate, bacteria begin degrading the mucus layer for nutrients, thinning this protective barrier." },
  akkermansia: { term: "Akkermansia muciniphila", def: "A mucus-dwelling bacterium now considered a keystone gut health species. Higher abundance correlates with metabolic health, reduced obesity, and improved gut barrier function. Promoted by fibres including pectin, arabinoxylan, FOS, and oat bran. Reduces with age, antibiotic use, and high-fat diets." },
  bifidobacterium: { term: "Bifidobacterium", def: "A genus of gram-positive bacteria dominant in the infant gut that selectively ferment prebiotic fibres. Species include B. longum, B. adolescentis, B. bifidum, and B. breve. Enriched by inulin, FOS, arabinogalactan, and resistant starch. Produces acetate and lactate, and supports the cross-feeding of butyrate producers. Declines significantly with age and antibiotic use." },
  faecalibacterium: { term: "Faecalibacterium prausnitzii", def: "One of the most abundant and clinically significant bacteria in the healthy human gut. A primary butyrate producer, directly associated with gut barrier integrity and anti-inflammatory effects. Consistently depleted in IBD, IBS, and metabolic disease. Enriched by resistant starch and inulin-type fructans through cross-feeding of acetate." },
  enterotype: { term: "Enterotype", def: "A classification system grouping individuals by dominant gut microbial composition. Three main enterotypes are described: Bacteroides-dominant (type 1, high protein/fat diet), Ruminococcus-dominant (type 2), and Prevotella-dominant (type 3, high fibre/plant diet). Enterotype influences how people respond to different prebiotics." },
  dysbiosis: { term: "Dysbiosis", def: "An imbalance in the composition or function of the gut microbiome, characterised by reduced diversity, loss of beneficial species, and/or overgrowth of pathobionts. Associated with IBD, IBS, obesity, type 2 diabetes, colorectal cancer, and neurological conditions. Dietary fibre is the primary dietary modulator of microbiome balance." },
  phWiki: { term: "Gastrointestinal pH", def: "pH varies significantly along the GI tract: stomach (1.5–3.5), duodenum (6–7), ileum (7–8), proximal colon (5.5–6.5), distal colon (6–7). Colonic fermentation of fibre produces SCFAs that lower pH, creating an environment hostile to pathogens but favourable for Bifidobacterium and Lactobacillus. Faecal pH is a proxy for fermentative activity." },
  colonicTransit: { term: "Colonic Transit Time", def: "The time food residue takes to travel through the colon — typically 12–72 hours. Shorter transit reduces exposure to carcinogens and pathobionts. Longer transit increases fermentation opportunity but also water reabsorption, leading to harder stools. Transit time is influenced by fibre intake, hydration, physical activity, stress, and gut microbiome composition." },
  degreePolymerisation: { term: "Degree of Polymerisation (DP)", def: "The number of monosaccharide units in a fibre chain. Short-chain oligosaccharides have DP 2–9 (e.g. FOS); long-chain inulin has DP 20–60; cellulose can have DP in the thousands. Lower DP = faster fermentation, more proximal, more gas potential. Higher DP = slower fermentation, more distal, often better tolerated." },
  viscosity: { term: "Viscosity", def: "The resistance of a solution to flow — in gut terms, how thick the gel formed by a soluble fibre becomes. High viscosity (psyllium, beta-glucan, konjac) slows gastric emptying, blunts glucose absorption, and traps bile acids — explaining cholesterol-lowering and glycaemic benefits. Viscosity depends on molecular weight and is reduced by food processing." },
};

// ── Toilet reading cards ───────────────────────────────────────────────────────
const TOILET_CARDS = [
  // --- Fibres ---
  { id: "tc_psyllium", category: "🌾 Kit Fibre", title: "Psyllium Husk", colour: "#3D7EAA", bg: "#E8F2F8",
    body: "An arabinoxylan-rich husk from Plantago ovata seeds. Forms a viscous gel in the intestinal lumen — its primary mechanism is physical rather than fermentative. The gel slows gastric emptying, traps bile acids (lowering LDL), and bulks stool. Requires at least 250ml water per dose — without it, the gel can worsen constipation.",
    tags: ["Soluble", "Gel-forming", "Low fermentation"],
    glossaryLinks: ["viscosity", "scfa"] },
  { id: "tc_inulin", category: "🧅 Kit Fibre", title: "Inulin / FOS", colour: "#8E44AD", bg: "#F4ECF7",
    body: "A fructan — chains of fructose molecules with a terminal glucose — sourced from chicory root. Highly selective for Bifidobacterium, Lactobacillus, and F. prausnitzii. Short-chain FOS (DP 2–8) ferments rapidly and proximally, causing more gas. Long-chain inulin (DP 20–60) ferments slowly and distally with better tolerability.",
    tags: ["Prebiotic", "Bifidogenic", "Moderate–high fermentation"],
    glossaryLinks: ["prebiotic", "degreePolymerisation", "bifidobacterium", "faecalibacterium"] },
  { id: "tc_betaglucan", category: "🌿 Kit Fibre", title: "Beta-Glucan", colour: "#3A9E6F", bg: "#E6F5EE",
    body: "A glucose polymer with β(1→3)(1→4) glycosidic bonds from oats and barley. The most clinically evidenced individual fibre — 58+ RCTs confirm it lowers LDL cholesterol at 3–4g/day. Efficacy depends on molecular weight preservation; high-temperature food processing degrades it. Also selectively enriches Bifidobacterium and activates bile salt hydrolase activity.",
    tags: ["Soluble", "Viscous", "Cholesterol-lowering"],
    glossaryLinks: ["viscosity", "glycosidicBond", "bifidobacterium"] },
  { id: "tc_rs", category: "🍌 Kit Fibre", title: "Resistant Starch", colour: "#E67E22", bg: "#FEF0E6",
    body: "Starch that escapes small intestinal digestion and enters the colon intact. RS3 (retrograded starch) forms when cooked starchy foods cool — rice, pasta, potatoes. Selectively feeds a butyrate-producing guild: Ruminococcus bromii acts as primary degrader, releasing fragments for Roseburia, Eubacterium rectale, and F. prausnitzii. Produces the broadest postbiotic spectrum of any common fibre.",
    tags: ["Fermentable", "Butyrate-rich", "Gut-brain axis"],
    glossaryLinks: ["butyrate", "faecalibacterium", "scfa"] },
  { id: "tc_pectin", category: "🍎 Kit Fibre", title: "Pectin", colour: "#C0392B", bg: "#FDECEA",
    body: "A complex polysaccharide from fruit cell walls with a galacturonic acid backbone and arabinose/galactose side chains. One of few fibres that directly promotes Akkermansia muciniphila — the mucus-layer-maintaining keystone species. Also traps bile acids (cholesterol reduction) and supports microbiome diversity through its structural complexity.",
    tags: ["Soluble", "Diversity-promoting", "Akkermansia-boosting"],
    glossaryLinks: ["akkermansia", "mucin", "polysaccharide"] },
  { id: "tc_ag", category: "🌲 Kit Fibre", title: "Arabinogalactan", colour: "#27AE60", bg: "#E9F7EF",
    body: "A polysaccharide from larch trees made of galactose and arabinose. Acts as a bifunctional prebiotic: the galactose component feeds Bifidobacterium while the arabinose component independently targets Gemmiger and Blautia — a rare monosaccharide-level specificity confirmed by 2025 Raman-activated cell sorting studies. Has NK cell immune modulation evidence.",
    tags: ["Dual-target prebiotic", "Immune support", "Low gas"],
    glossaryLinks: ["monosaccharide", "bifidobacterium", "prebiotic"] },
  { id: "tc_arabinoxylan", category: "🌾 Fibre", title: "Arabinoxylan", colour: "#5D6D7E", bg: "#EAF0F6",
    body: "The dominant hemicellulose of cereal bran — a xylose backbone with arabinose side chains. The arabinose-to-xylose ratio determines water solubility. Selectively enriches Bifidobacterium longum, Roseburia inulinivorans, and Akkermansia muciniphila. Particle size matters: finer milling increases surface area and fermentability.",
    tags: ["Hemicellulose", "Cereal bran", "Akkermansia"],
    glossaryLinks: ["monosaccharide", "akkermansia", "cazymes"] },
  { id: "tc_konjac", category: "🧊 Fibre", title: "Konjac Glucomannan", colour: "#2C3E50", bg: "#EAECEE",
    body: "One of the most viscous dietary fibres known — forms gels up to 100× more viscous than beta-glucan at equivalent concentrations. From the konjac root (Amorphophallus konjac). Used clinically for glycaemic control and cholesterol. May cause significant bloating in sensitive individuals due to slow but extensive colonic fermentation.",
    tags: ["Highly viscous", "Glucose regulation", "Sensitive gut caution"],
    glossaryLinks: ["viscosity", "fermentation"] },
  // --- Science concepts ---
  { id: "tc_microbiome", category: "🦠 Science", title: "Your Gut Microbiome", colour: "#3D7EAA", bg: "#E8F2F8",
    body: "~38 trillion bacteria live in your colon, collectively encoding 150× more genes than your human genome. Individual identity accounts for 82% of microbiome variation — your personal microbial ecosystem is as unique as a fingerprint. Diet is the most powerful modifiable factor. Just 3 days on a new diet can shift measurable microbiome changes.",
    tags: ["100 trillion microbes", "Highly personal", "Diet-responsive"],
    glossaryLinks: ["microbiome", "dysbiosis", "enterotype"] },
  { id: "tc_scfa", category: "🧪 Science", title: "Short-Chain Fatty Acids", colour: "#3A9E6F", bg: "#E6F5EE",
    body: "Acetate, propionate, and butyrate are the main products of fibre fermentation. Butyrate feeds your colon lining cells and strengthens tight junctions. Propionate travels to the liver to regulate cholesterol. Acetate fuels peripheral tissues and cross-feeds butyrate producers. Their relative ratios depend on which bacteria are active and which fibres you eat.",
    tags: ["Butyrate", "Propionate", "Acetate"],
    glossaryLinks: ["scfa", "butyrate", "propionate", "acetate", "tightJunctions"] },
  { id: "tc_barrier", category: "🛡️ Science", title: "The Gut Barrier", colour: "#C0392B", bg: "#FDECEA",
    body: "A single layer of epithelial cells separates your gut contents from your bloodstream. Goblet cells secrete mucus; tight junctions seal the gaps between cells. When dietary fibre is absent, bacteria begin consuming the mucus layer itself, thinning this barrier. Butyrate from fibre fermentation directly upregulates tight junction proteins ZO-1 and claudin, restoring barrier integrity.",
    tags: ["Epithelial layer", "Tight junctions", "Mucus protection"],
    glossaryLinks: ["gutBarrier", "tightJunctions", "mucin", "butyrate"] },
  { id: "tc_fermentation", category: "⚗️ Science", title: "Gut Fermentation", colour: "#8E44AD", bg: "#F4ECF7",
    body: "Colonic bacteria ferment fibre anaerobically, producing SCFAs, gases (CO₂, hydrogen, methane), and signalling molecules. Rapidly fermented fibres (short-chain FOS, lactulose) produce gas quickly in the proximal colon — good for prebiotic enrichment but can cause bloating. Slowly fermented fibres (RS3, long-chain inulin) produce gas gradually and distally — better tolerated.",
    tags: ["Anaerobic process", "Gas production", "SCFA output"],
    glossaryLinks: ["fermentation", "scfa", "degreePolymerisation", "phWiki"] },
  { id: "tc_cazymes", category: "🔬 Science", title: "CAZymes", colour: "#E67E22", bg: "#FEF0E6",
    body: "Carbohydrate-Active enZymes are the molecular keys that unlock dietary fibres. Each bacterial species carries a unique set of CAZymes — glycoside hydrolases, polysaccharide lyases, and esterases — that determine exactly which fibres it can ferment. This is why monosaccharide composition predicts microbial ecology: only bacteria with the right CAZyme toolkit can metabolise a given fibre.",
    tags: ["Enzyme diversity", "Fibre specificity", "Microbial niches"],
    glossaryLinks: ["cazymes", "glycosidicBond", "monosaccharide"] },
  { id: "tc_transit", category: "⏱️ Science", title: "Colonic Transit Time", colour: "#5D6D7E", bg: "#EAF0F6",
    body: "How long food residue spends in your colon shapes your microbiome more than almost any other factor. A 2024 Nature Microbiology study found transit time and stool moisture — not dietary intake — were the strongest day-to-day predictors of microbiome variation. Faster transit = more fermentation metabolites, less water reabsorption, softer stool. Slower transit = harder stool, more toxin exposure.",
    tags: ["Transit = 12–72 hrs", "Microbiome driver", "Bristol Score link"],
    glossaryLinks: ["colonicTransit", "phWiki", "microbiome"] },
  { id: "tc_ph", category: "🧫 Science", title: "GI pH & Your Microbiome", colour: "#27AE60", bg: "#E9F7EF",
    body: "pH drops from ~7 in the small intestine to ~5.5–6.5 in the proximal colon as bacteria ferment fibre into SCFAs. This acid environment inhibits pathogens (Salmonella, C. difficile) while Bifidobacterium and Lactobacillus thrive. Measuring faecal pH is a simple proxy for fermentative activity — lower pH = more active fermentation = more SCFAs.",
    tags: ["Stomach pH 1.5–3.5", "Colon pH 5.5–7", "Colonisation resistance"],
    glossaryLinks: ["phWiki", "scfa", "bifidobacterium"] },
  { id: "tc_akkermansia", category: "🦠 Science", title: "Akkermansia muciniphila", colour: "#2471A3", bg: "#EBF5FB",
    body: "A mucin-degrading bacterium that lives in the mucus layer and has become one of the most studied gut bacteria. Higher abundance correlates with metabolic health, reduced obesity risk, lower LDL, and better gut barrier function. Promoted by pectin, arabinoxylan, FOS, and polyphenols. Depleted by antibiotics, high-fat diets, and ageing. Now being trialled as a live biotherapeutic.",
    tags: ["Mucus-layer resident", "Metabolic health", "Gut barrier"],
    glossaryLinks: ["akkermansia", "mucin", "gutBarrier"] },
];

// Water: quick-add amounts in ml
const WATER_AMOUNTS = [150, 250, 330, 500, 750];
const DEFAULT_GOAL_ML = 2000;

// Trackable biometric metrics (fluctuating — not height/sex/DOB)
const MEASURE_METRICS = [
  { key: "weightKg",         label: "Weight",            unit: "kg",     colour: "#C8794A", emoji: "⚖️",  placeholder: "70",   step: "0.1", hasSecond: false },
  { key: "bloodPressure",    label: "Blood Pressure",    unit: "mmHg",   colour: "#C0392B", emoji: "❤️",  placeholder: "120",  step: "1",   hasSecond: true,  label2: "Diastolic", placeholder2: "80" },
  { key: "fastingGlucose",   label: "Fasting Glucose",   unit: "mmol/L", colour: "#2471A3", emoji: "🩸",  placeholder: "5.0",  step: "0.1", hasSecond: false },
  { key: "hba1c",            label: "HbA1c",             unit: "%",      colour: "#5DADE2", emoji: "💉",  placeholder: "5.4",  step: "0.1", hasSecond: false },
  { key: "totalCholesterol", label: "Total Cholesterol", unit: "mmol/L", colour: "#6B8F71", emoji: "🧪",  placeholder: "5.0",  step: "0.1", hasSecond: false },
  { key: "ldl",              label: "LDL",               unit: "mmol/L", colour: "#E74C3C", emoji: "📉",  placeholder: "3.0",  step: "0.1", hasSecond: false },
  { key: "hdl",              label: "HDL",               unit: "mmol/L", colour: "#27AE60", emoji: "📈",  placeholder: "1.5",  step: "0.1", hasSecond: false },
  { key: "triglycerides",    label: "Triglycerides",     unit: "mmol/L", colour: "#F39C12", emoji: "🔬",  placeholder: "1.5",  step: "0.1", hasSecond: false },
];

// ── Quiz question definitions ─────────────────────────────────────────────
// Each answer generates tags that activate matching research insights.
// No hardcoded fibre opinions — scores emerge from the evidence library.
const QUIZ_STEPS = [
  {
    id: "goal",
    question: "What's your primary goal?",
    subtitle: "Your recommendation is built entirely from research matching this goal.",
    type: "single",
    options: [
      { value: "regularity",  label: "Improve regularity",     icon: "🔄", tags: ["regularity","constipation","transit","bowel","stool"] },
      { value: "microbiome",  label: "Support my microbiome",  icon: "🦠", tags: ["microbiome","diversity","prebiotic","bifidobacterium","bifidogenic","gut flora"] },
      { value: "blood_sugar", label: "Balance blood sugar",    icon: "📊", tags: ["blood sugar","glucose","insulin","glycaemic","hba1c","diabetes","metabolic"] },
      { value: "cholesterol", label: "Lower cholesterol",      icon: "❤️", tags: ["cholesterol","ldl","lipid","cardiovascular","bile acid","bsa"] },
      { value: "immunity",    label: "Boost immunity",         icon: "🛡️", tags: ["immunity","immune","nk cell","inflammation","autoimmune","cytokine"] },
      { value: "gut_health",  label: "General gut health",     icon: "🌿", tags: ["gut barrier","permeability","mucus","akkermansia","tight junction","butyrate","scfa","colonocyte"] },
      { value: "weight",      label: "Weight management",      icon: "⚖️", tags: ["weight","obesity","adiposity","satiety","lipid absorption","bmi"] },
    ],
  },
  {
    id: "digestion",
    question: "How would you describe your digestion?",
    subtitle: "This determines which contraindications apply to you.",
    type: "single",
    options: [
      { value: "loose",       label: "Often loose or urgent",           icon: "💧", tags: ["diarrhoea","loose stool","urgency"] },
      { value: "constipated", label: "Often sluggish or constipated",   icon: "🐢", tags: ["constipation","slow transit","hard stool"] },
      { value: "gassy",       label: "Bloating & gas are my main issue",icon: "💨", tags: ["gas","bloating","flatulence","fermentation"] },
      { value: "mixed",       label: "Unpredictable — varies a lot",    icon: "🔀", tags: ["ibs","alternating","mixed bowel"] },
      { value: "fine",        label: "Pretty normal overall",           icon: "✅", tags: [] },
    ],
  },
  {
    id: "transit",
    question: "How often do you have a bowel movement?",
    subtitle: "Transit time is the strongest single predictor of microbiome composition.",
    type: "single",
    options: [
      { value: "slow",   label: "Less than 3 times per week", icon: "🐌", tags: ["slow transit","constipation","hard stool"] },
      { value: "normal", label: "Once a day or so",           icon: "✅", tags: ["normal transit"] },
      { value: "fast",   label: "Multiple times daily",       icon: "⚡", tags: ["fast transit","loose stool","urgency"] },
    ],
  },
  {
    id: "sensitivity",
    question: "How does your gut react to new foods?",
    subtitle: "Determines safe starting fibres and fermentation tolerance.",
    type: "single",
    options: [
      { value: "very_sensitive", label: "Very sensitive — I react easily",      icon: "⚡", tags: ["sensitive gut","sibo","low tolerance","fermentation intolerance"] },
      { value: "somewhat",       label: "Somewhat sensitive",                   icon: "🌊", tags: ["moderate sensitivity"] },
      { value: "not_sensitive",  label: "Pretty robust, not much bothers me",   icon: "🪨", tags: ["tolerant","robust gut"] },
    ],
  },
  {
    id: "fibre_habit",
    question: "How much fibre do you currently eat?",
    subtitle: "Habitual fibre intake independently predicts tolerance to new fibres.",
    type: "single",
    options: [
      { value: "low_fibre",  label: "Low — mostly processed foods",      icon: "🍔", tags: ["low habitual intake","fibre naive","western diet"] },
      { value: "moderate",   label: "Moderate — some veg & wholegrains", icon: "🥗", tags: ["moderate intake"] },
      { value: "high_fibre", label: "Already very high in fibre",        icon: "🌱", tags: ["high habitual intake","fibre adapted"] },
    ],
  },
  {
    id: "history",
    question: "Any of these apply to you?",
    subtitle: "Select all that apply — these activate specific research insights.",
    type: "multi",
    options: [
      { value: "ibs",        label: "Diagnosed IBS",              icon: "🩺", tags: ["ibs","irritable bowel","gut-brain"] },
      { value: "antibiotics",label: "Antibiotics in last 6 months",icon: "💊", tags: ["post-antibiotic","dysbiosis","low diversity","microbiome depletion"] },
      { value: "metabolic",  label: "Metabolic concerns (T2D, obesity)", icon: "📈", tags: ["metabolic","insulin resistance","obesity","type 2 diabetes"] },
      { value: "immune",     label: "Autoimmune or inflammatory condition", icon: "🛡️", tags: ["autoimmune","inflammation","immune dysregulation"] },
      { value: "elderly",    label: "Over 65",                    icon: "👴", tags: ["ageing","elderly microbiome","reduced diversity"] },
      { value: "none",       label: "None of these",              icon: "✨", tags: [] },
    ],
  },
  {
    id: "model_awareness",
    question: "One last thing — how do you prefer your evidence?",
    subtitle: "This affects how we weight in vitro vs human trial findings.",
    type: "single",
    options: [
      { value: "human_only",   label: "Human trials only — I want proven results", icon: "👥", tags: ["human_evidence_only"] },
      { value: "include_vitro",label: "Include all evidence, noting caveats",       icon: "🔬", tags: ["include_all_evidence"] },
      { value: "no_pref",      label: "No preference — show me everything",         icon: "📚", tags: [] },
    ],
  },
];

// ── Evidence scoring constants ──────────────────────────────────────────────
// Study type base weights — derived from evidence hierarchy
const STUDY_TYPE_WEIGHTS = {
  meta_analysis:          4.0,
  systematic_review:      3.5,
  rct:                    3.0,
  human_cohort:           2.0,
  human_observational:    1.5,
  ex_vivo:                1.2,
  animal:                 0.8,
  in_vitro:               0.5,
  case_study:             0.3,
  expert_opinion:         0.2,
};

const CONFIDENCE_MULTIPLIERS = { high: 1.5, medium: 1.0, low: 0.5 };

// Model caveats that should suppress a finding when user wants human evidence only
const IN_VITRO_MODELS = ["in_vitro", "ex_vivo", "animal"];

// Calculate evidence score from insight metadata
function calcEvidenceScore(insight) {
  const typeWeight = STUDY_TYPE_WEIGHTS[insight.studyType] ?? 1.0;
  const confMult   = CONFIDENCE_MULTIPLIERS[insight.confidence] ?? 1.0;
  // Log-scale sample size: ln(n+1) so n=0→0, n=10→2.4, n=100→4.6, n=4000→8.3
  const sampleFactor = insight.sampleSize > 0
    ? Math.log(insight.sampleSize + 1) / Math.log(10)  // log10 for gentler scaling
    : 1.0;
  return typeWeight * confMult * sampleFactor;
}

// Build the complete set of active quiz tags from answers
function buildQuizTags(answers) {
  const tags = new Set();
  QUIZ_STEPS.forEach(step => {
    const ans = answers[step.id];
    if (!ans) return;
    const values = Array.isArray(ans) ? ans : [ans];
    values.forEach(v => {
      const opt = step.options.find(o => o.value === v);
      (opt?.tags || []).forEach(t => tags.add(t.toLowerCase()));
    });
  });
  return tags;
}

// ── Core scoring function — research-driven, no hardcoded opinions ──────────
function scoreAndRank(answers, insights = [], profileTags = [], expData = {}) {
  const scores    = Object.fromEntries(FIBRES.map(f => [f.id, 0]));
  const evidence  = Object.fromEntries(FIBRES.map(f => [f.id, []])); // trail
  const penalties = Object.fromEntries(FIBRES.map(f => [f.id, []])); // contraindications

  const quizTags  = buildQuizTags(answers);
  const allTags   = new Set([...quizTags, ...profileTags.map(t => t.toLowerCase())]);

  const humanOnly = answers.model_awareness === "human_only";

  insights.filter(i => i.active && i.fibreId && scores.hasOwnProperty(i.fibreId)).forEach(insight => {
    const fid = insight.fibreId;

    // ── CONTRAINDICATION CHECK ──────────────────────────────────────────────
    // If any of the user's tags match the insight's contraindications → penalty
    const contraMatched = (insight.contraindicates || []).filter(ct =>
      allTags.has(ct.toLowerCase())
    );
    if (contraMatched.length > 0) {
      const penalty = calcEvidenceScore(insight) * 1.5; // contraindications weighted harder
      scores[fid] -= penalty;
      penalties[fid].push({ insight, matched: contraMatched, penalty });
      return; // skip relevance check — it's a contraindication
    }

    // ── RELEVANCE CHECK ─────────────────────────────────────────────────────
    // Insight is relevant if ANY of its relevantFor tags match the user's tags
    const relevantTags = insight.relevantFor || [];
    const matched = relevantTags.filter(rt => allTags.has(rt.toLowerCase()));

    // Also do keyword fallback for insights without relevantFor tags (legacy)
    let keywordMatch = false;
    if (relevantTags.length === 0) {
      const text = ((insight.condition||"") + " " + (insight.effect||"") + " " + (insight.summary||"")).toLowerCase();
      keywordMatch = [...allTags].some(tag => text.includes(tag));
    }

    if (matched.length === 0 && !keywordMatch) return; // not relevant to this user

    // ── IN VITRO SUPPRESSION ────────────────────────────────────────────────
    if (humanOnly && IN_VITRO_MODELS.includes(insight.studyType)) {
      // Don't add to score, but note in evidence trail as suppressed
      evidence[fid].push({ insight, score: 0, matched, suppressed: true,
        reason: "Suppressed: in vitro finding (user requested human trials only)" });
      return;
    }

    // ── MODEL CAVEAT PENALTY ────────────────────────────────────────────────
    // In vitro findings get reduced weight even when not suppressed
    let evidenceScore = calcEvidenceScore(insight);

    // If insight has a modelCaveat flagging in vivo contradiction, halve the score
    if (insight.modelCaveat && insight.modelCaveat.length > 0) {
      evidenceScore *= 0.5;
    }

    const dirMultiplier = insight.direction === "negative" ? -1 : 1;
    const finalScore = evidenceScore * dirMultiplier;

    // Profile biometric boost: if profile tags overlap relevantFor, 1.3× multiplier
    const profileBoost = profileTags.some(pt =>
      relevantTags.some(rt => rt.toLowerCase().includes(pt.toLowerCase()))
    ) ? 1.3 : 1.0;

    const contribution = finalScore * profileBoost;
    scores[fid] += contribution;
    evidence[fid].push({
      insight,
      score: contribution,
      matched: matched.length > 0 ? matched : ["keyword"],
      evidenceScore,
      suppressed: false,
    });
  });

  // ── PERSONAL EXPERIENCE (highest weight override) ───────────────────────
  Object.entries(expData).forEach(([fid, exp]) => {
    if (!scores.hasOwnProperty(fid)) return;
    const scaleEntry = EXP_SCALE.find(e => e.value === exp.overall);
    if (!scaleEntry) return;
    scores[fid] += scaleEntry.boost * 1.5;
    if (exp.positives?.length) scores[fid] += Math.min(exp.positives.length, 3) * 0.4;
    if (exp.negatives?.length) scores[fid] -= Math.min(exp.negatives.length, 3) * 0.4;
  });

  // Return top 3 with full evidence trail attached
  return FIBRES
    .map(f => ({
      ...f,
      score:      scores[f.id],
      evidence:   evidence[f.id].sort((a, b) => Math.abs(b.score) - Math.abs(a.score)),
      penalties:  penalties[f.id],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// ── Experiment config ─────────────────────────────────────────────────────────
const EXPERIMENT_DURATIONS = [
  { days: 5,  label: "5 Days",  desc: "Quick sensitivity test" },
  { days: 10, label: "10 Days", desc: "Short tolerance trial" },
  { days: 30, label: "30 Days", desc: "Full microbiome shift" },
];
const EXPERIMENT_SCHEDULE = [
  { time: "morning", label: "Morning", icon: "🌅", desc: "Take with breakfast, 30 min before or after eating" },
  { time: "evening", label: "Evening", icon: "🌙", desc: "Take with dinner or 2 hours before bed" },
];

// ── Insight extraction system prompt (shared by all AI extraction modes) ──────
const INSIGHT_EXTRACTION_SYSTEM_PROMPT = `You are a specialist scientific assistant for dietary fibre and gut microbiome research.

Extract a structured insight from the provided text (abstract, full paper, or URL content).
Return ONLY valid JSON with NO markdown, NO explanation, NO preamble. Just the JSON object.

Required schema:
{
  "fibreId": "psyllium|inulin|beta_glucan|resistant_starch|pectin|arabinogalactan",
  "fibreName": "Human-readable fibre name",
  "condition": "Clinical conditions, populations, or contexts studied",
  "effect": "The specific effect or finding observed",
  "direction": "positive|negative|neutral",
  "confidence": "low|medium|high",
  "summary": "2-3 sentence plain-English summary of the finding and its significance",
  "citation": "Authors et al., Journal Name",
  "year": "YYYY",

  "studyType": "meta_analysis|systematic_review|rct|human_cohort|human_observational|ex_vivo|animal|in_vitro|case_study|expert_opinion",
  "sampleSize": 0,
  "modelType": "Specific model used e.g. batch fermentation, simulated digestion, germ-free mouse, crossover RCT",
  "modelCaveat": "If in vitro or animal: state why findings may not translate to humans. Empty string if human study.",
  "contradictedBy": "Note any contradicting evidence mentioned in the paper itself. Empty string if none.",

  "relevantFor": ["array","of","lowercase","tags","that","match","quiz","answers"],
  "contraindicates": ["tags","where","this","fibre","should","be","avoided"]
}

For relevantFor and contraindicates, use tags from this controlled vocabulary:
GOALS: regularity, constipation, transit, bowel, stool, microbiome, diversity, prebiotic, bifidobacterium, bifidogenic, blood sugar, glucose, insulin, glycaemic, hba1c, diabetes, metabolic, cholesterol, ldl, lipid, cardiovascular, bile acid, immunity, immune, nk cell, inflammation, autoimmune, gut barrier, permeability, mucus, akkermansia, tight junction, butyrate, scfa, weight, obesity, satiety
DIGESTIVE STATE: loose stool, diarrhoea, urgency, constipation, slow transit, hard stool, gas, bloating, flatulence, fermentation, ibs, alternating, mixed bowel
SENSITIVITY: sensitive gut, sibo, low tolerance, fermentation intolerance, moderate sensitivity, tolerant, robust gut
HISTORY: low habitual intake, fibre naive, western diet, high habitual intake, fibre adapted, post-antibiotic, dysbiosis, low diversity, insulin resistance, type 2 diabetes, autoimmune, ageing, elderly microbiome
BIOMETRICS: high ldl, elevated glucose, hypertension, high bmi, cardiovascular risk

CRITICAL RULES:
1. studyType MUST reflect the actual study design from the Methods section, not the abstract conclusion
2. If you see phrases like "batch fermentation", "simulated digestion", "germ-free mice", "cell culture" — set studyType to in_vitro, ex_vivo, or animal accordingly
3. modelCaveat is REQUIRED for any non-human study type — explain specifically why findings may not replicate in vivo
4. If the paper itself notes that findings contradict other evidence, capture that in contradictedBy
5. sampleSize should be the number of human subjects (n=) — use 0 for in vitro studies
6. For contraindicates: if this fibre worsens symptoms in certain populations (e.g. FOS in SIBO), list those tags`;

// ── Admin PIN ─────────────────────────────────────────────────────────────────
const ADMIN_PIN = "1234"; // Change this to your preferred PIN

// ── Pre-seeded Research Library ───────────────────────────────────────────────
// 22 insights sourced from peer-reviewed literature 2024–2025
const SEEDED_INSIGHTS = [
  // ── MONOSACCHARIDE COMPOSITION & SELECTIVITY ─────────────────────────────
  {
    id: "seed_1", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "psyllium",
    condition: "monosaccharide composition, fermentation selectivity",
    effect: "Glucose and xylose content in fibre predicts pH reduction and SCFA (lactic acid, propionic acid) production; monosaccharide composition reliably predicts which microbial species survive fermentation",
    direction: "positive", confidence: "high",
    summary: "Fibres with similar monosaccharide building blocks produce consistent microbiome effects. Psyllium's arabinoxylan structure (arabinose + xylose) selectively favours Lactobacillus and propionate-producing taxa.",
    citation: "Jensen et al., Applied & Environmental Microbiology", year: "2024",
  },
  {
    id: "seed_2", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "pectin",
    condition: "gut barrier, Akkermansia muciniphila, inflammation",
    effect: "Pectin and guar gum enhance SCFA production and promote Akkermansia muciniphila; in contrast carrageenan and xanthan may enrich pro-inflammatory Ruminococcus gnavus",
    direction: "positive", confidence: "high",
    summary: "Pectin's galacturonic acid backbone with arabinose and galactose side chains selectively promotes gut barrier-supporting Akkermansia muciniphila and reduces Alistipes putredinis. Fibre chemistry determines inflammatory vs anti-inflammatory microbiome shifts.",
    citation: "Zhang et al., ScienceDirect; Feng et al., Comprehensive Reviews in Food Science", year: "2025",
  },
  {
    id: "seed_3", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "arabinogalactan",
    condition: "prebiotic selectivity, Bifidobacterium, Gemmiger, arabinose, galactose",
    effect: "Arabinogalactan (galactose + arabinose) consistently enriched Bifidobacterium and Gemmiger across 10 donors; galactose drove Bifidobacterium response, arabinose drove Gemmiger and Blautia",
    direction: "positive", confidence: "high",
    summary: "The two monosaccharide components of arabinogalactan recruit distinct bacterial responders — galactose targets Bifidobacterium while arabinose targets Gemmiger and Blautia. This monosaccharide-level specificity makes it a genuinely bifunctional prebiotic.",
    citation: "Evaluating prebiotic activity of arabinogalactan, PMC / MRR journal", year: "2025",
  },
  {
    id: "seed_4", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "inulin",
    condition: "microbiome diversity, Bifidobacterium adolescentis, Bifidobacterium longum, SCFA, individual variability",
    effect: "Inulin supplementation produces highly individualised, time-dependent shifts enriching B. adolescentis, B. longum, Anaerostipes hadrus, Bacteroides xylanisolvens with divergent SCFA profiles across individuals",
    direction: "positive", confidence: "high",
    summary: "Inulin's fructose-glucose β(2→1) chain consistently boosts Bifidobacterium species, but SCFA profiles and tolerability are highly individual. High inter-individual variability is a defining characteristic of FOS/inulin responses.",
    citation: "Wu et al. 2025, cited in ScienceDirect ideal fibre model review", year: "2025",
  },
  {
    id: "seed_5", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "inulin",
    condition: "bile acid metabolism, bile salt hydrolase, cholesterol",
    effect: "Inulin and beta-glucan produced highest taurine-conjugated bile acid levels and reduced intestinal taurine-conjugated BAs, suggesting enhanced bile salt hydrolase (BSH) activity — relevant to cholesterol remodelling",
    direction: "positive", confidence: "medium",
    summary: "Inulin drives significant bile acid remodelling via BSH activity, forming a distinct microbiome cluster. This pathway links inulin's prebiotic effects to cholesterol and lipid metabolism beyond simple SCFA production.",
    citation: "Comparative analysis dietary fiber bile acid metabolism, npj Gut & Liver", year: "2025",
  },
  // ── BETA-GLUCAN ──────────────────────────────────────────────────────────
  {
    id: "seed_6", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "beta_glucan",
    condition: "bile acid metabolism, bile salt hydrolase, cholesterol, microbiome",
    effect: "Beta-glucan clustered with inulin and raffinose for microbiome impact; highest bile salt hydrolase activity alongside inulin, supporting cholesterol-lowering effects through bile acid remodelling",
    direction: "positive", confidence: "high",
    summary: "Beta-glucan's glucose β(1→3)(1→4) structure drives bile acid metabolism and BSH activity comparable to inulin, providing a mechanistic explanation for its clinically proven LDL cholesterol reduction effects.",
    citation: "Comparative analysis dietary fiber bile acid metabolism, npj Gut & Liver", year: "2025",
  },
  {
    id: "seed_7", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "beta_glucan",
    condition: "Bifidobacterium, prebiotic, blood sugar, glycaemic control",
    effect: "Beta-glucan in vitro fermentation significantly increases Bifidobacterium abundance and reduces SMB53 genus; combined with viscosity effects this supports glycaemic blunting",
    direction: "positive", confidence: "high",
    summary: "Beta-glucan increases Bifidobacterium selectively during fermentation while its gel-forming viscosity slows glucose absorption. These dual mechanisms — microbial and physical — explain its consistent glycaemic benefits in clinical trials.",
    citation: "Prebiotic Dietary Fiber in vitro fermentation beta-glucan inulin XOS, PMC", year: "2024",
  },
  // ── RESISTANT STARCH ─────────────────────────────────────────────────────
  {
    id: "seed_8", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "resistant_starch",
    condition: "Bifidobacterium, butyrate, gut microbiome diversity, meta-analysis",
    effect: "Meta-analysis of 24 trials (816 individuals): resistant starch increases Bifidobacterium relative abundance (WMD +1.75) and stimulates butyrate-producing bacteria, though modestly reduces Shannon diversity",
    direction: "positive", confidence: "high",
    summary: "Resistant starch is among the most evidence-backed fibres for butyrate production and Bifidobacterium enrichment. The modest Shannon diversity reduction may reflect niche competition rather than harm.",
    citation: "Xu et al., Food Science and Human Wellness meta-analysis", year: "2025",
  },
  {
    id: "seed_9", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "resistant_starch",
    condition: "gut-brain axis, IBS, GABA, serotonin, postbiotics",
    effect: "RS fermentation generates SCFA, indoles, bile acid derivatives, and neuroactive amines including GABA and serotonin precursors — directly relevant to gut-brain signalling and IBS symptom management",
    direction: "positive", confidence: "medium",
    summary: "Resistant starch is unique among common fibres in its spectrum of neuroactive postbiotic production. This makes it particularly relevant for patients with IBS, where gut-brain axis dysregulation is central to symptom experience.",
    citation: "Resistant Starch and Microbiota-Derived Secondary Metabolites, MDPI IJMS", year: "2025",
  },
  {
    id: "seed_10", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "resistant_starch",
    condition: "individual variability, baseline microbiome, habitual fibre intake, response prediction",
    effect: "Baseline microbiome composition, habitual dietary fibre intake, and treatment order all predicted response to RS2 and RS4 supplementation; AMY1 gene copy number was not predictive",
    direction: "positive", confidence: "high",
    summary: "Response to resistant starch is strongly shaped by pre-existing microbiome state and habitual diet — not by salivary amylase genetics. This supports using baseline diet and symptom history to guide RS recommendations.",
    citation: "Devarakonda et al., Gut Microbes", year: "2024",
  },
  {
    id: "seed_11", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "resistant_starch",
    condition: "Bifidobacterium adolescentis, plant-based diet, competitive exclusion, Clostridium",
    effect: "High-fibre plant-based diets with resistant starch induce strain-level specialisation in Bifidobacterium adolescentis, enhancing amylolytic activity while competitively excluding Clostridium perfringens",
    direction: "positive", confidence: "medium",
    summary: "Resistant starch selectively cultivates amylolytic Bifidobacterium strains while crowding out pathogenic Clostridium — suggesting it functions as both a prebiotic and a competitive exclusion agent when dietary fibre intake is already high.",
    citation: "Frontiers in Microbiology, human gut microbiota and lifestyle review", year: "2025",
  },
  // ── PECTIN ───────────────────────────────────────────────────────────────
  {
    id: "seed_12", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "pectin",
    condition: "Akkermansia muciniphila, gut barrier, microbiome diversity",
    effect: "Pectin and resistant starch both consistently promote Akkermansia muciniphila and reduce Alistipes putredinis; pectin's moderately fermentable structure also supports Bifidobacterium and Lactobacillus",
    direction: "positive", confidence: "high",
    summary: "Pectin's rhamnose-galacturonic acid backbone with arabinose and galactose branches creates a broad fermentation substrate that supports multiple beneficial genera simultaneously, making it one of the more diversity-preserving fibres.",
    citation: "Feng et al., Comprehensive Reviews in Food Science and Food Safety", year: "2025",
  },
  // ── PSYLLIUM ─────────────────────────────────────────────────────────────
  {
    id: "seed_13", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "psyllium",
    condition: "gut physiology, gel formation, transit time, constipation, water intake",
    effect: "Psyllium's gel-forming arabinoxylan structure clusters with cellulose and chitin for microbiome impact; its primary mechanism is physical — slowing transit, bulking stool, requiring adequate hydration",
    direction: "positive", confidence: "high",
    summary: "Psyllium is primarily a physiological rather than fermentative fibre. Its moderate microbiome effects are secondary to its physical gel-forming properties. Adequate water intake is essential — without it, the gel can worsen constipation by forming a dry mass.",
    citation: "Comparative analysis dietary fiber, npj Gut & Liver; Jensen et al. AEM", year: "2024-2025",
  },
  // ── INDIVIDUAL TOLERANCE FACTORS ─────────────────────────────────────────
  {
    id: "seed_14", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "inulin",
    condition: "individual tolerance, fructan, body weight, habitual fibre intake, microbiome composition",
    effect: "Individuals with higher body weight and higher habitual fibre intake showed best tolerance to fructan supplementation; gut microbiome composition independently predicted tolerance",
    direction: "positive", confidence: "high",
    summary: "Tolerance to FOS/inulin is strongly predicted by existing gut microbial capacity. Low habitual fibre intake and leaner body composition are associated with worse tolerance — supporting a gradual dose-escalation approach for new users.",
    citation: "Letourneau et al., Int J Food Sci Nutr, Duke University", year: "2024",
  },
  {
    id: "seed_15", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "psyllium",
    condition: "individual variability, baseline microbiome dominance, intervention response",
    effect: "Across 21 fibre intervention studies (538 subjects), individual identity accounted for 82% of microbiome compositional variation vs only 1.5% from fibre intake — confirming personal microbiome baseline dominates response",
    direction: "neutral", confidence: "high",
    summary: "The most important determinant of how someone responds to any fibre is their pre-existing microbiome — not the fibre itself. This strongly supports personalised, symptom-monitored introduction of fibres rather than uniform protocols.",
    citation: "Short-term dietary fiber interventions, mSystems, ASM Journals", year: "2024",
  },
  {
    id: "seed_16", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "resistant_starch",
    condition: "gut transit time, stool pH, fermentation environment, individual variability",
    effect: "Gut transit time and faecal pH — not dietary macronutrients — were strongest day-to-day predictors of microbiome variation in 61 adults; carbohydrate fermentation metabolites correlated negatively with passage time and pH",
    direction: "neutral", confidence: "high",
    summary: "Slow gut transit amplifies fermentation exposure, increasing both beneficial SCFA production and potential gas/bloating from rapidly fermentable fibres like RS and inulin. Individuals with slow transit may need lower starting doses.",
    citation: "Gut physiology and environment explain microbiome variation, Nature Microbiology", year: "2024",
  },
  {
    id: "seed_17", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "inulin",
    condition: "SIBO, rapid fermentation, gas, bloating, sensitive gut, caution",
    effect: "Highly fermentable short-chain FOS/inulin is contraindicated or requires extreme caution in SIBO and low-diversity microbiomes where rapid fermentation produces excess gas before colonic clearance",
    direction: "negative", confidence: "high",
    summary: "Inulin and short-chain FOS are rapidly fermented in the proximal colon. In individuals with SIBO, dysbiosis, or low microbial diversity, this speed of fermentation produces disproportionate gas and bloating. Slower-fermenting alternatives (psyllium, pectin) are preferred for sensitive guts.",
    citation: "Clinical consensus and multiple 2024-2025 intervention studies",  year: "2024",
  },
  {
    id: "seed_18", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "arabinogalactan",
    condition: "immune function, NK cells, respiratory health, microbiome diversity",
    effect: "Arabinogalactan stimulates NK cell activity and immune modulation through microbiome-mediated pathways; enrichment of Gemmiger and Blautia alongside Bifidobacterium supports broad immune benefits",
    direction: "positive", confidence: "medium",
    summary: "Arabinogalactan's dual-sugar structure enables it to enrich multiple beneficial genera simultaneously, including immunologically relevant Gemmiger. This broader microbiome enrichment may underpin its observed immune and respiratory health effects.",
    citation: "Arabinogalactan prebiotic activity study, PMC/MRR", year: "2025",
  },
  {
    id: "seed_19", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "pectin",
    condition: "ageing microbiome, dietary modulation, responsiveness, age-related dysbiosis",
    effect: "Ageing gut microbiota shows greater responsiveness to dietary fibre modulation due to reduced ecological stability — suggesting fibre interventions may be particularly effective in older adults",
    direction: "positive", confidence: "medium",
    summary: "Older adults may benefit more from targeted fibre supplementation than younger individuals. Reduced microbiome stability means the ageing gut is more susceptible to dietary influence — a therapeutic opportunity when using diverse fibres like pectin that support broad microbial engagement.",
    citation: "Citizen science high-fiber vs fermented food RCT, medRxiv", year: "2025",
  },
  {
    id: "seed_20", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "beta_glucan",
    condition: "intrinsic vs extracted fibre, whole food, supplement, microbiome engagement",
    effect: "Unprocessed intrinsic fibre structures release more gradually in the colon than extracted equivalents, potentially enhancing microbiome and immune effects — relevant when comparing whole oat beta-glucan vs isolated beta-glucan powder",
    direction: "positive", confidence: "medium",
    summary: "Whole-food sources of beta-glucan (oats, barley) may engage the microbiome more effectively than isolated powder due to gradual colonic release. However, isolated forms are more practical for controlled dosing experiments.",
    citation: "Intrinsic chicory root fibre study referenced in medRxiv citizen science RCT", year: "2025",
  },
  {
    id: "seed_21", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "resistant_starch",
    condition: "intervention order, fibre rotation, microbiome priming, sequential supplementation",
    effect: "Treatment order — the sequence in which RS2 and RS4 were consumed — predicted SCFA changes, suggesting the microbiome primed by one fibre type affects response to the subsequent one",
    direction: "neutral", confidence: "medium",
    summary: "The order in which fibres are introduced matters. Priming the microbiome with one substrate may increase or decrease responsiveness to the next. This supports a structured sequential introduction protocol rather than concurrent introduction of multiple fibres.",
    citation: "Devarakonda et al., Gut Microbes", year: "2024",
  },
  {
    id: "seed_22", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "inulin",
    condition: "cross-feeding, butyrate, Roseburia, Faecalibacterium prausnitzii, SCFA network",
    effect: "Acetate produced by Bifidobacterium from inulin fermentation feeds cross-feeding interactions with butyrate-producing microbes including Roseburia and Faecalibacterium prausnitzii",
    direction: "positive", confidence: "high",
    summary: "Inulin's value extends beyond direct Bifidobacterium enrichment. The acetate it generates fuels a cross-feeding network producing butyrate via Roseburia and F. prausnitzii — explaining why inulin supplementation can raise butyrate even though Bifidobacterium don't produce it directly.",
    citation: "Nireeksha et al. 2025, cited in Frontiers Microbiology in vitro translation study", year: "2025",
  },

  // ── 26-YEAR LITERATURE REVIEW INSIGHTS (added 2025) ──────────────────────

  // Beta-glucan — 26 years of evidence
  {
    id: "seed_23", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "beta_glucan",
    condition: "LDL cholesterol, cardiovascular disease, meta-analysis, dose-response",
    effect: "Meta-analysis of 58 RCTs (n=3,974): median dose 3.5g/day oat beta-glucan lowered LDL by −0.19 mmol/L, non-HDL by −0.20 mmol/L, apoB by −0.03 g/L — all p<0.00001. FDA health claim granted 1997.",
    direction: "positive", confidence: "high",
    summary: "Beta-glucan is the most robustly evidenced individual dietary fibre in human clinical research. 58 RCTs confirm it lowers LDL at 3.5g/day. Efficacy depends critically on molecular weight — high-temperature processing that degrades beta-glucan chains significantly reduces cholesterol-lowering effect.",
    citation: "Ho et al., British Journal of Nutrition meta-analysis; FDA health claim 1997", year: "2016",
  },
  {
    id: "seed_24", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "beta_glucan",
    condition: "LDL cholesterol, blood pressure, molecular weight, food matrix, processing",
    effect: "High-molecular-weight oat beta-glucan at 3g/day in beverage form reduced LDL by 0.207 mmol/L vs control (p=0.0003) and significantly reduced Framingham CVD risk score at 4 weeks",
    direction: "positive", confidence: "high",
    summary: "Beta-glucan efficacy is strongly dependent on molecular weight preservation. High-temperature, high-shear food processing degrades beta-glucan chains, reducing viscosity and clinical effect. Minimally processed forms (whole oats, minimally processed concentrates) outperform highly processed products.",
    citation: "Wolever et al., Journal of Nutrition RCT", year: "2021",
  },
  {
    id: "seed_25", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "beta_glucan",
    condition: "glycaemic control, type 2 diabetes, insulin sensitivity, viscosity",
    effect: "Oat beta-glucan lowers postprandial glucose and insulin responses through viscosity-mediated slowing of gastric emptying and glucose absorption; benefits are dose and molecular weight dependent",
    direction: "positive", confidence: "high",
    summary: "Beta-glucan's glycaemic benefits operate through a physical mechanism — luminal viscosity slows nutrient absorption — rather than solely through fermentation. This means the food matrix matters enormously: intact oat kernel outperforms extracted beta-glucan in cookies or crackers.",
    citation: "Springer European Journal of Nutrition systematic review on oat supplementation", year: "2022",
  },

  // Psyllium — 26 years of evidence
  {
    id: "seed_26", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "psyllium",
    condition: "LDL cholesterol, non-HDL, apolipoprotein B, cardiovascular",
    effect: "Psyllium significantly reduces LDL cholesterol, non-HDL cholesterol, and apoB. Meta-analysis confirms effect persisting across hypercholesterolaemic and normocholesterolaemic populations.",
    direction: "positive", confidence: "high",
    summary: "Psyllium is the second most evidenced individual fibre after beta-glucan. Its cholesterol-lowering mechanism is primarily bile acid sequestration — the viscous gel traps bile acids in the intestinal lumen, forcing hepatic conversion of LDL to replace them. This works independently of fermentation.",
    citation: "Jovanovski et al., American Journal of Clinical Nutrition systematic review", year: "2018",
  },
  {
    id: "seed_27", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "psyllium",
    condition: "blood pressure, hypertension, systolic, dose-response",
    effect: "Psyllium significantly decreases systolic blood pressure in a dose-response manner. 2024 meta-analysis confirms antihypertensive effect independent of cholesterol-lowering pathway.",
    direction: "positive", confidence: "high",
    summary: "Psyllium's cardiovascular effects extend beyond cholesterol to blood pressure regulation, likely via improved insulin sensitivity and reduced vascular inflammation. This makes it one of the few fibres with evidence across multiple cardiovascular risk factors simultaneously.",
    citation: "Gholami et al., Food Science & Nutrition dose-response meta-analysis", year: "2024",
  },
  {
    id: "seed_28", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "psyllium",
    condition: "HbA1c, fasting blood glucose, insulin resistance, HOMA-IR, type 2 diabetes",
    effect: "Psyllium significantly decreased HOMA-IR (WMD −1.17), HbA1c (WMD −0.75%), and fasting blood sugar (WMD −6.89 mg/dL) in dose-response meta-analysis across multiple RCTs",
    direction: "positive", confidence: "high",
    summary: "Psyllium has significant, consistent evidence for improving glycaemic control across multiple markers. Its physical gel-forming action in the small intestine slows glucose absorption, reducing postprandial spikes and improving HbA1c over weeks-to-months supplementation.",
    citation: "Cardiovascular diseases meta-analysis, ScienceDirect", year: "2023",
  },
  {
    id: "seed_29", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "psyllium",
    condition: "statin adjunct, cholesterol lowering, combination therapy",
    effect: "Three RCTs showed psyllium as adjunct to statins produced additional LDL reduction beyond statin monotherapy, with no adverse interactions",
    direction: "positive", confidence: "medium",
    summary: "Psyllium can function as an adjuvant to statin therapy, providing complementary LDL reduction through a completely different mechanism (bile acid sequestration vs. HMG-CoA reductase inhibition). This makes it a low-risk add-on for patients already on statins who need further LDL reduction.",
    citation: "Wei et al., American Journal of Cardiology meta-analysis", year: "2018",
  },

  // Inulin/FOS — 26 years of evidence
  {
    id: "seed_30", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "inulin",
    condition: "Bifidobacterium, Lactobacillus, Faecalibacterium prausnitzii, prebiotic, chain length",
    effect: "Systematic review of human RCTs confirms ITF promote Bifidobacterium, Lactobacillus, and F. prausnitzii; chain length affects site and rate of fermentation — scFOS ferments proximally/rapidly, long-chain inulin ferments distally/slowly",
    direction: "positive", confidence: "high",
    summary: "Chain length is the most clinically important structural determinant for inulin tolerance and microbiome targeting. Short-chain FOS (DP 2–8) ferments rapidly in the proximal colon causing gas; long-chain inulin (DP 20–60) ferments slowly and distally, reaching deeper colonic sections and enriching broader taxa with less bloating.",
    citation: "Dahl & Zhu, Advances in Nutrition systematic review", year: "2022",
  },
  {
    id: "seed_31", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "inulin",
    condition: "calcium absorption, bone health, mineral absorption, magnesium",
    effect: "ITF increase calcium and magnesium absorption in human trials, likely through colonic pH reduction and increased solubility of minerals in the lower GI tract",
    direction: "positive", confidence: "medium",
    summary: "Inulin has evidence for improved calcium and magnesium absorption as a secondary benefit beyond its prebiotic effects. This is particularly relevant for post-menopausal women and older adults where calcium absorption efficiency declines. The mechanism is pH-mediated mineral solubilisation in the colon.",
    citation: "Dahl & Zhu, Advances in Nutrition systematic review on ITF", year: "2022",
  },
  {
    id: "seed_32", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "inulin",
    condition: "intestinal barrier, tight junctions, gut permeability, laxation",
    effect: "ITF supplementation improves intestinal barrier function and laxation in human trials; reduced intestinal permeability may mediate broader anti-inflammatory effects",
    direction: "positive", confidence: "medium",
    summary: "Beyond bifidogenic effects, inulin/FOS improve gut barrier integrity — reducing permeability markers and supporting tight junction protein expression. This barrier improvement may underpin the anti-inflammatory systemic effects observed in some inulin supplementation studies.",
    citation: "Dahl & Zhu, Advances in Nutrition systematic review on ITF", year: "2022",
  },

  // Resistant Starch — 26 years of evidence
  {
    id: "seed_33", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "resistant_starch",
    condition: "butyrate, Faecalibacterium prausnitzii, Roseburia, Ruminococcus bromii, colonic fermentation",
    effect: "16 clinical microbiome studies consistently showed RS enriches F. prausnitzii, Roseburia, Ruminococcus bromii, and E. rectale — primary and secondary butyrate-producing specialists with cross-feeding relationships",
    direction: "positive", confidence: "high",
    summary: "Resistant starch activates a coordinated guild of butyrate-producing bacteria: Ruminococcus bromii acts as the primary degrader, releasing starch fragments that E. rectale, Roseburia, and F. prausnitzii ferment to butyrate. This guild structure is why RS is the most reliable butyrate-boosting dietary intervention.",
    citation: "Baxter et al. PMC; resistant starch microbiome precision modulation review", year: "2021",
  },
  {
    id: "seed_34", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "resistant_starch",
    condition: "weight loss, obesity, insulin resistance, Bifidobacterium adolescentis, bile acid",
    effect: "8-week RS supplementation produced mean −2.8 kg weight loss and improved insulin resistance in 37 overweight/obese participants. Mechanistically linked to B. adolescentis-mediated bile acid profile changes, reduced inflammation, and inhibited lipid absorption.",
    direction: "positive", confidence: "high",
    summary: "RS-induced weight loss is microbiome-mediated — specifically through Bifidobacterium adolescentis. This species remodels bile acid profiles, reduces intestinal inflammation, and inhibits lipid absorption. Supplementing B. adolescentis alone in mice replicated the protective effect against diet-induced obesity.",
    citation: "Zhao et al., Nature Metabolism RCT", year: "2024",
  },
  {
    id: "seed_35", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "resistant_starch",
    condition: "RS types, RS1, RS2, RS3, RS4, IBS, clinical dosing",
    effect: "Recommended daily RS intake ranges from 10–45g depending on IBS subtype and individual tolerance. RS2 and RS3 have the strongest microbiota-modulatory evidence; RS3 is most practically relevant through cooking-cooling of starchy foods",
    direction: "positive", confidence: "medium",
    summary: "RS type matters clinically. RS2 (raw potato/banana starch) and RS3 (retrograded starch from cooked-cooled potatoes, rice, legumes) have the strongest human evidence. RS3 is most practical for everyday diet — simply cooking and cooling starchy foods increases RS content significantly.",
    citation: "MDPI International Journal of Molecular Sciences RS and IBS review", year: "2025",
  },

  // Pectin — 26 years of evidence
  {
    id: "seed_36", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "pectin",
    condition: "Akkermansia muciniphila, gut barrier, arabinoxylan, specialist degraders, Crohn's disease",
    effect: "Akkermansia muciniphila, Barnesiella viscericola, and Paraprevotella xylaniphila are specialist primary degraders of both pectin and arabinoxylan, with unique enzyme profiles including pectin acetylesterases, rhamnosidases and rhamnogalacturonan lyases not found in other gut microbes",
    direction: "positive", confidence: "high",
    summary: "Pectin requires a specific enzymatic toolkit to ferment that only a subset of bacteria possess. This creates highly selective enrichment of specialist degraders including Akkermansia muciniphila — the mucus-layer-maintaining keystone species. Pectin can be thought of as a targeted feeding strategy for gut barrier maintenance.",
    citation: "Arabinoxylan and Pectin Metabolism Crohn's disease in silico study, MDPI IJMS", year: "2022",
  },
  {
    id: "seed_37", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "pectin",
    condition: "cholesterol, LDL, bile acid sequestration, viscosity, soluble fibre",
    effect: "Pectin reduces LDL cholesterol through bile acid trapping — its galacturonic acid backbone binds bile acids in a viscous gel, reducing their reabsorption and increasing hepatic cholesterol conversion",
    direction: "positive", confidence: "high",
    summary: "Pectin shares a bile acid sequestration mechanism with psyllium and beta-glucan for cholesterol reduction, but its structural complexity (galacturonic acid + rhamnose + arabinose + galactose side chains) also enables simultaneous microbiome-modulating effects that psyllium lacks. It operates on both physical and biological pathways.",
    citation: "26-year literature review synthesis; multiple meta-analyses and mechanistic studies", year: "1998-2024",
  },

  // General microbiome and gut physiology
  {
    id: "seed_38", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "psyllium",
    condition: "mucus layer, gut barrier, glycan consumption, fibre deficit, barrier compromise",
    effect: "In the absence of adequate dietary fibre, glycan-consuming microbiota degrade the mucus layer itself for nutrients — thinning the protective mucosal barrier. Adequate fibre provision redirects these bacteria to their dietary substrate, preserving mucus layer integrity.",
    direction: "positive", confidence: "high",
    summary: "When fibre is inadequate, gut bacteria don't simply go dormant — they begin consuming the mucus layer as an alternative substrate. This creates a direct mechanistic link between low fibre intake and gut permeability ('leaky gut'). Regular fibre supplementation is therefore not just beneficial but structurally protective.",
    citation: "Effects of dietary components on intestinal permeability, American Journal of Physiology", year: "2020",
  },
  {
    id: "seed_39", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "resistant_starch",
    condition: "tight junctions, intestinal permeability, butyrate, Treg, immune function",
    effect: "Butyrate from RS fermentation strengthens tight junctions (upregulating ZO-1 and occludin-5), promotes Treg differentiation via HIF-1 modulation, and activates GPR43 to enhance antimicrobial peptide secretion",
    direction: "positive", confidence: "high",
    summary: "Butyrate produced from RS fermentation is a multi-target barrier and immune molecule: it physically tightens epithelial junctions, educates immune cells (Treg), and activates antimicrobial defences. This explains why RS is particularly relevant in IBD, IBS, and conditions of gut barrier dysfunction.",
    citation: "Multiple mechanistic studies: Peng et al. J Gastro Hepatol; Frontiers cellular infection microbiology 2024", year: "2022-2024",
  },
  {
    id: "seed_40", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "beta_glucan",
    condition: "gut-brain axis, BDNF, cognition, mood, inflammation, immune",
    effect: "Viscous fermentable soluble fibres reduce pro-inflammatory cytokines and increase brain-derived neurotrophic factor (BDNF) levels through microbiota modulation, connecting dietary fibre to affective and cognitive processes",
    direction: "positive", confidence: "medium",
    summary: "The gut-brain axis connects fibre fermentation directly to neurological function. Fermentable fibres, including beta-glucan, increase BDNF and reduce neuroinflammatory cytokines. SCFAs produced in the colon cross the blood-brain barrier and modulate central immune responses — establishing a mechanistic pathway from diet to mood and cognition.",
    citation: "Dietary fibre and the gut-brain axis, Gut Microbiome Cambridge University Press", year: "2021",
  },
  {
    id: "seed_41", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "pectin",
    condition: "cardiovascular disease mortality, cancer, all-cause mortality, dose-response, population level",
    effect: "Every 10g/day increment in total dietary fibre intake reduces CVD mortality by 9% (RR 0.91), CHD mortality by 11% (RR 0.89), and all-cancer mortality by 6% (RR 0.94) in dose-response meta-analysis of prospective cohort studies",
    direction: "positive", confidence: "high",
    summary: "Population-level data from multiple large cohorts (including up to 17.2 million individuals) consistently show a dose-response protective relationship between dietary fibre intake and mortality. CVD mortality, pancreatic cancer, and diverticular disease have the highest-grade (Class I) evidence for fibre protection.",
    citation: "Zhang et al. ScienceDirect meta-analysis CVD cancer mortality; umbrella review 17.2M individuals 2025", year: "2015-2025",
  },
  {
    id: "seed_42", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "inulin",
    condition: "low fibre intake population, Western diet, fibre gap, microbiome depletion",
    effect: "Population fibre intake is far below recommended levels across high-income countries: 18.3g/day USA, 14.8g/day UK, 15.0g/day Japan, vs recommended 25–38g/day. This represents a structural microbiome depletion risk at population scale.",
    direction: "negative", confidence: "high",
    summary: "The vast majority of the population consuming a Western diet exists in a chronic state of relative fibre deficiency. This constitutes a systemic under-feeding of the gut microbiome, progressively depleting fermentative capacity. Any fibre supplementation starting from a low-intake baseline is likely to produce measurable microbiome and health effects.",
    citation: "Frontiers Nutrition dose-response review; WHO recommendations", year: "2023",
  },
  {
    id: "seed_43", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "arabinogalactan",
    condition: "colonisation resistance, competitive exclusion, Clostridium, pathogen suppression, pH",
    effect: "SCFA-mediated colonic pH reduction creates colonisation resistance against C. difficile, Salmonella, and enteropathogenic E. coli. Fibre feeding through prebiotic enrichment of Bifidobacterium and Akkermansia competitively excludes pathobionts.",
    direction: "positive", confidence: "high",
    summary: "Fibre supplementation through prebiotic fibres doesn't just add beneficial bacteria — it actively displaces harmful ones. Lower colonic pH from SCFA production inhibits pathogen growth. This colonisation resistance mechanism is one of the most clinically important but underappreciated aspects of prebiotic fibre use.",
    citation: "SCFA intestinal immunity review Frontiers Cellular Infection Microbiology 2024; multiple mechanistic studies", year: "2024",
  },
  {
    id: "seed_44", active: true, addedAt: "2025-01-01T00:00:00.000Z",
    fibreId: "beta_glucan",
    condition: "publication volume, research trends, most studied fibres, evidence hierarchy",
    effect: "Bibliometric analysis of 21,434 dietary fibre articles (2010–2024) shows rapidly accelerating publication volumes, particularly post-2019. Beta-glucan and psyllium have the largest body of human RCT evidence; inulin leads for microbiome-focused trials; resistant starch is the fastest-growing research area.",
    direction: "neutral", confidence: "high",
    summary: "Evidence hierarchy across 26 years: (1) Beta-glucan — regulatory-grade cholesterol/CVD evidence, 58+ RCTs; (2) Psyllium — broad cardiometabolic evidence, 50+ RCTs; (3) Inulin/FOS — strongest prebiotic/microbiome evidence; (4) Resistant starch — fastest growing, strongest butyrate evidence; (5) Pectin — specialised Akkermansia/barrier evidence; (6) Arabinogalactan — most precise monosaccharide-level prebiotic evidence but smallest clinical trial base.",
    citation: "Bibliometric analysis of dietary fiber research, Discover Applied Sciences 2025", year: "2025",
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function fmtDur(sec) {
  if (!sec) return "—";
  const m = Math.floor(sec / 60), s = sec % 60;
  return m > 0 ? (s > 0 ? `${m}m ${s}s` : `${m}m`) : `${s}s`;
}
function fmtTime(d) { return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
function fmtDate(d) { return new Date(d).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }); }
function toKey(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;
}
function today() { return toKey(new Date()); }
function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

const FIBRE_LOG_SYMPTOMS = ["Gas / bloating", "Loose stools", "Constipation", "Cramping", "Nausea", "Improved energy", "Better sleep", "Reduced bloating", "More regular", "No change"];

// ── STYLES ────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#F6F9FC;font-family:'Plus Jakarta Sans',sans-serif;color:#111827;min-height:100vh;}
.app{max-width:480px;margin:0 auto;padding:16px 16px 94px;}
.serif{font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;}
.card{background:#FFFFFF;border:1px solid #E5EAF0;border-radius:20px;padding:18px;margin-bottom:12px;box-shadow:0 1px 6px rgba(17,24,39,.05);}
.chip{display:inline-block;background:#EFF6FF;color:#2563A0;border-radius:20px;padding:3px 10px;font-size:11px;font-weight:600;margin:2px;}
.chip-g{background:#DCFAEE;color:#15774F;}
.chip-a{background:#FEF3C7;color:#92400E;}
.btn{display:block;width:100%;padding:14px;border-radius:14px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:600;transition:all .18s;letter-spacing:.01em;}
.btn-p{background:#3B82C4;color:white;box-shadow:0 2px 10px rgba(59,130,196,.3);} .btn-p:hover{background:#2563A0;}
.btn-s{background:#E8F2FA;color:#2563A0;}
.btn-g{background:#22A06B;color:white;} .btn-g:hover{background:#17835A;}
.btn-b{background:#2563A0;color:white;} .btn-b:hover{background:#1E4D8C;}
.opt{display:flex;align-items:center;gap:12px;width:100%;padding:13px 15px;border-radius:14px;border:1.5px solid #E5EAF0;background:#FFFFFF;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#111827;margin-bottom:8px;transition:all .15s;text-align:left;}
.opt:hover,.opt.sel{border-color:#3B82C4;background:#E8F2FA;} .opt.sel{font-weight:600;}
.pbar{height:3px;background:#E5EAF0;border-radius:4px;margin-bottom:6px;}
.pfill{height:100%;background:linear-gradient(90deg,#3B82C4,#22A06B);border-radius:4px;transition:width .3s;}
.inp{width:100%;padding:12px 14px;border-radius:12px;border:1.5px solid #E5EAF0;background:#F6F9FC;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#111827;outline:none;}
.inp:focus{border-color:#3B82C4;background:#FFFFFF;box-shadow:0 0 0 3px rgba(59,130,196,.12);}
.tog{padding:8px 13px;border-radius:9px;border:1.5px solid #E5EAF0;background:#F6F9FC;cursor:pointer;font-size:13px;font-weight:500;color:#111827;transition:all .15s;font-family:'Plus Jakarta Sans',sans-serif;}
.tog.on{background:#3B82C4;border-color:#3B82C4;color:white;}
.small{font-size:12px;color:#6B7280;}
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;}
.r1{background:#FEF3C7;color:#92400E;} .r2{background:#DCFAEE;color:#15774F;} .r3{background:#EFF6FF;color:#1D4ED8;}
.bnav{position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid #E5EAF0;display:flex;justify-content:center;z-index:100;}
.bnav-in{display:flex;width:100%;max-width:480px;}
.nb{flex:1;padding:9px 2px 14px;border:none;background:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:9px;font-weight:500;color:#9CA3AF;display:flex;flex-direction:column;align-items:center;gap:3px;transition:color .15s;}
.nb.on{color:#3B82C4;} .nb .ico{font-size:20px;}
.timer-num{font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:58px;font-weight:600;text-align:center;color:#111827;letter-spacing:2px;padding:10px 0 6px;line-height:1;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes ripple{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.4);opacity:0}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.pulse{animation:pulse 1.1s ease-in-out infinite;}
.spin{animation:spin 1s linear infinite;display:inline-block;}
/* Bristol Chart */
.bsc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.bsc-card{padding:12px 10px;border-radius:16px;border:2px solid #E5EAF0;background:#FFFFFF;cursor:pointer;transition:all .18s;text-align:center;box-shadow:0 1px 4px rgba(17,24,39,.04);}
.bsc-card:hover{border-color:#3B82C4;transform:translateY(-1px);box-shadow:0 4px 12px rgba(59,130,196,.15);}
.bsc-card.sel{border-color:#3B82C4;background:#E8F2FA;box-shadow:0 4px 12px rgba(59,130,196,.2);}
/* Stool colour swatches */
.swatch-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px;}
.swatch{width:34px;height:34px;border-radius:50%;border:3px solid transparent;cursor:pointer;transition:all .15s;}
.swatch.sel{border-color:#3B82C4;transform:scale(1.2);box-shadow:0 2px 8px rgba(59,130,196,.3);}
/* Poop log cards */
.plog{padding:14px;border-radius:16px;border:1px solid #E5EAF0;background:#FFFFFF;margin-bottom:10px;box-shadow:0 1px 4px rgba(17,24,39,.04);}
.stat-card{background:#FFFFFF;border:1px solid #E5EAF0;border-radius:14px;padding:12px;text-align:center;box-shadow:0 1px 4px rgba(17,24,39,.04);}
/* Symptoms */
.sym-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}
.sym-btn{padding:10px 6px;border-radius:13px;border:2px solid #E5EAF0;background:#FFFFFF;cursor:pointer;text-align:center;transition:all .15s;display:flex;flex-direction:column;align-items:center;gap:4px;}
.sym-btn:hover{border-color:#3B82C4;} .sym-btn.sel{border-width:2px;}
.sev-row{display:flex;gap:8px;}
.sev-btn{flex:1;padding:10px 4px;border-radius:10px;border:2px solid #E5EAF0;background:#FFFFFF;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;text-align:center;font-family:'Plus Jakarta Sans',sans-serif;}
/* Calendar */
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:12px;}
.cal-header{text-align:center;font-size:11px;font-weight:600;color:#9CA3AF;padding:4px 0;}
.cal-day{min-height:52px;border-radius:10px;border:1px solid #E5EAF0;background:#FFFFFF;cursor:pointer;padding:4px;position:relative;transition:background .12s;}
.cal-day:hover{background:#E8F2FA;} .cal-day.today{border-color:#3B82C4;border-width:2px;}
.cal-day.selected{background:#E8F2FA;} .cal-day.empty{background:transparent;border-color:transparent;cursor:default;}
.cal-day-num{font-size:11px;font-weight:600;color:#111827;margin-bottom:2px;}
.cal-dot-row{display:flex;flex-wrap:wrap;gap:2px;margin-top:2px;}
.cal-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.day-detail{background:#FFFFFF;border:1px solid #E5EAF0;border-radius:16px;padding:16px;margin-bottom:12px;}
.day-section-title{font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px;}
/* Water */
.water-glass{position:relative;width:48px;height:68px;border:2.5px solid #3B82C4;border-radius:5px 5px 9px 9px;overflow:hidden;background:#EFF6FF;cursor:pointer;flex-shrink:0;}
.water-fill{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(180deg,#60A5FA,#2563A0);transition:height .5s cubic-bezier(.4,0,.2,1);}
.water-ripple{position:absolute;bottom:50%;left:50%;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.6);transform:translate(-50%,50%);}
.water-ripple.active{animation:ripple .6s ease-out forwards;}
.quick-add-btn{padding:10px 0;border-radius:10px;border:1.5px solid #BFDBFE;background:#EFF6FF;cursor:pointer;font-size:13px;font-weight:600;color:#2563A0;transition:all .15s;flex:1;text-align:center;font-family:'Plus Jakarta Sans',sans-serif;}
.quick-add-btn:hover,.quick-add-btn.flash{background:#2563A0;color:white;border-color:#2563A0;}
.water-log-item{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:10px;border:1px solid #BFDBFE;background:#EFF6FF;margin-bottom:6px;}
/* Profile */
.bio-metric-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #E5EAF0;}
.bio-metric-row:last-child{border-bottom:none;}
.bio-input-group{display:flex;align-items:center;gap:6px;}
.bio-input{width:80px;padding:8px 10px;border-radius:8px;border:1.5px solid #E5EAF0;background:#F6F9FC;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#111827;outline:none;text-align:right;}
.bio-input:focus{border-color:#3B82C4;}
.bio-unit{font-size:12px;color:#6B7280;min-width:24px;}
.metric-tag{display:inline-flex;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;}
.profile-avatar{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#3B82C4,#2563A0);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.section-label{font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:1.2px;margin:18px 0 10px;}
/* Measurement modal */
.modal-overlay{position:fixed;inset:0;background:rgba(17,24,39,.5);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.modal-sheet{background:#FFFFFF;border-radius:26px 26px 0 0;width:100%;max-width:480px;padding:24px 20px 40px;max-height:88vh;overflow-y:auto;}
.modal-sheet{animation:slideUp .22s ease-out;}
.metric-pick-btn{display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;border-radius:12px;border:1.5px solid #E5EAF0;background:#FFFFFF;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#111827;margin-bottom:8px;transition:all .15s;text-align:left;}
.metric-pick-btn:hover,.metric-pick-btn.sel{border-color:#3B82C4;background:#E8F2FA;}
.metric-pick-btn.sel{font-weight:600;}
/* Experience Quiz */
.fibre-pick{display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;border-radius:13px;border:2px solid #E5EAF0;background:#FFFFFF;cursor:pointer;transition:all .15s;margin-bottom:8px;text-align:left;font-family:'Plus Jakarta Sans',sans-serif;}
.fibre-pick:hover{border-color:#3B82C4;}
.fibre-pick.sel{border-color:#3B82C4;background:#E8F2FA;}
.kit-badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;background:#DCFAEE;color:#15774F;white-space:nowrap;flex-shrink:0;}
.scale-btn{width:100%;padding:13px 16px;border-radius:13px;border:2px solid;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;margin-bottom:8px;transition:all .15s;text-align:left;display:flex;align-items:center;justify-content:space-between;}
.scale-btn.active{color:white!important;}
.scale-btn:not(.active){background:#FFFFFF;}
.eff-btn{padding:9px 12px;border-radius:10px;border:2px solid #E5EAF0;background:#FFFFFF;cursor:pointer;font-size:12px;font-weight:500;transition:all .15s;display:inline-flex;align-items:center;gap:5px;margin:0 6px 8px 0;font-family:'Plus Jakarta Sans',sans-serif;}
.eff-btn.on-pos{border-color:#22A06B;background:#DCFAEE;color:#15774F;font-weight:600;}
.eff-btn.on-neg{border-color:#DC2626;background:#FEE2E2;color:#DC2626;font-weight:600;}
.exp-bar{height:3px;background:#E5EAF0;border-radius:4px;margin-bottom:20px;}
.exp-fill{height:100%;background:linear-gradient(90deg,#22A06B,#3B82C4);border-radius:4px;transition:width .4s;}
/* Research Library */
.admin-pin-input{width:100%;padding:16px;font-size:28px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;text-align:center;border-radius:14px;border:2px solid #E5EAF0;background:#F6F9FC;letter-spacing:8px;outline:none;color:#111827;}
.admin-pin-input:focus{border-color:#3B82C4;}
.insight-card{background:#FFFFFF;border:1px solid #E5EAF0;border-radius:16px;padding:14px;margin-bottom:10px;position:relative;}
.insight-card.inactive{opacity:.45;}
.direction-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;}
.dir-pos{background:#DCFAEE;color:#15774F;}
.dir-neg{background:#FEE2E2;color:#DC2626;}
.dir-neu{background:#F3F4F6;color:#6B7280;}
.conf-badge{display:inline-flex;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;}
.conf-high{background:#FEF3C7;color:#92400E;}
.conf-med{background:#E8F2FA;color:#2563A0;}
.conf-low{background:#F3F4F6;color:#6B7280;}
.tab-row{display:flex;gap:6px;margin-bottom:16px;}
.tab-btn{flex:1;padding:9px 6px;border-radius:10px;border:1.5px solid #E5EAF0;background:#FFFFFF;cursor:pointer;font-size:12px;font-weight:500;color:#6B7280;transition:all .15s;font-family:'Plus Jakarta Sans',sans-serif;}
.tab-btn.on{background:#111827;border-color:#111827;color:white;}
.toggle-pill{width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;}
.toggle-pill.on{background:#22A06B;} .toggle-pill.off{background:#D1D5DB;}
.toggle-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:white;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.toggle-pill.on .toggle-knob{left:23px;} .toggle-pill.off .toggle-knob{left:3px;}
.ai-thinking{display:flex;align-items:center;gap:8px;padding:12px;border-radius:10px;background:#E8F2FA;color:#2563A0;font-size:13px;}
/* Hamburger Menu */
.hamburger{width:36px;height:36px;border-radius:10px;border:1.5px solid #E5EAF0;background:#FFFFFF;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;flex-shrink:0;}
.hamburger span{display:block;width:16px;height:2px;background:#6B7280;border-radius:2px;transition:all .2s;}
.menu-panel{position:fixed;top:0;right:0;bottom:0;width:min(280px,80vw);background:#FFFFFF;z-index:400;box-shadow:-4px 0 32px rgba(17,24,39,.15);display:flex;flex-direction:column;padding:0;}
.menu-overlay{position:fixed;inset:0;z-index:399;background:rgba(17,24,39,.4);backdrop-filter:blur(3px);}
.menu-item{display:flex;align-items:center;gap:14px;padding:16px 20px;border-bottom:1px solid #F3F4F6;cursor:pointer;transition:background .12s;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:500;color:#111827;background:none;border-left:none;border-right:none;border-top:none;width:100%;text-align:left;}
.menu-item:hover{background:#F6F9FC;}
.menu-item-ico{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
/* Experiment screen */
.exp-setup-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #E5EAF0;}
.exp-setup-row:last-child{border-bottom:none;}
.exp-day-badge{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;font-size:14px;font-weight:700;}
.dose-check-btn{flex:1;padding:16px 10px;border-radius:16px;border:2px solid;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;transition:all .18s;text-align:center;}
/* Tooltip hover */
.tooltip-wrap{position:relative;display:inline-block;}
/* Toilet reading carousel */
.reading-carousel{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding:2px 0 14px;scrollbar-width:none;}
.reading-carousel::-webkit-scrollbar{display:none;}
.reading-card{flex-shrink:0;width:270px;border-radius:20px;padding:18px;scroll-snap-align:start;animation:fadeIn .3s ease;}
.reading-card-cat{font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;opacity:.75;margin-bottom:6px;}
.reading-card-title{font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:17px;font-weight:600;margin-bottom:8px;line-height:1.3;}
.reading-card-body{font-size:12.5px;line-height:1.65;opacity:.9;margin-bottom:10px;}
.reading-card-tags{display:flex;flex-wrap:wrap;gap:5px;}
.reading-card-tag{font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;background:rgba(255,255,255,.3);}
.carousel-dots{display:flex;justify-content:center;gap:5px;margin-top:4px;}
.carousel-dot{width:6px;height:6px;border-radius:50%;background:#E5EAF0;transition:background .2s;}
.carousel-dot.active{background:#3B82C4;width:18px;border-radius:3px;}
/* Glossary popover */
.gloss-link{border-bottom:1.5px dashed currentColor;cursor:pointer;font-weight:600;display:inline;}
.gloss-popover{position:fixed;z-index:300;background:#111827;color:#F9FAFB;border-radius:16px;padding:14px 16px;max-width:min(300px,85vw);box-shadow:0 12px 40px rgba(0,0,0,.35);animation:fadeIn .15s ease;}
.gloss-popover-title{font-size:13px;font-weight:700;color:#93C5FD;margin-bottom:5px;}
.gloss-popover-body{font-size:12px;line-height:1.65;}
.gloss-popover-close{float:right;font-size:16px;cursor:pointer;color:#9CA3AF;margin-left:8px;line-height:1;}
`;

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("home");
  // Glossary popover
  const [glossOpen, setGlossOpen] = useState(null); // key from GLOSSARY
  const [glossPos, setGlossPos] = useState({ x: 0, y: 0 });

  // Quiz
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [curAns, setCurAns] = useState(null);
  const [recs, setRecs] = useState([]);

  // Fibre logs
  const [fibreLogs, setFibreLogs] = useState([]);
  const [lf, setLf] = useState({ fibre: "", dose: "", unit: "g", symptoms: [], notes: "", date: today() });

  // Poop logs
  const [poopLogs, setPoopLogs] = useState([]);
  const [active, setActive] = useState(false);
  const [sessStart, setSessStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [pStep, setPStep] = useState("timer");
  const [pForm, setPForm] = useState({ bristolType: null, colour: null, straining: null, complete: null, notes: "" });
  const timerRef = useRef(null);

  // Symptom logs
  const [symLogs, setSymLogs] = useState([]);
  const [symForm, setSymForm] = useState({ symptoms: [], severity: {}, notes: "", time: fmtTimeNow() });
  const [symSaved, setSymSaved] = useState(false);

  // ── Personal Fibre Experience Quiz ────────────────────────────────────────
  // expData: { [fibreId]: { overall: number, positives: string[], negatives: string[] } }
  const [expData, setExpData] = useState({});
  // Experience quiz flow state
  const [expStep, setExpStep] = useState("select");  // select | rate | effects_pos | effects_neg | done
  const [expSelected, setExpSelected] = useState([]); // fibre IDs selected
  const [expIdx, setExpIdx] = useState(0);            // which selected fibre we're on
  const [expCurrent, setExpCurrent] = useState({});   // answers for current fibre being rated

  // Research Library (admin)
  const [insights, setInsights] = useState(SEEDED_INSIGHTS);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [libTab, setLibTab] = useState("library"); // library | add | search
  const [addMode, setAddMode] = useState("abstract"); // abstract | url | manual
  const [abstractText, setAbstractText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null); // extracted insight awaiting approval
  const [aiSearchResults, setAiSearchResults] = useState([]); // list of papers found
  const [manualForm, setManualForm] = useState({
    fibreId: "", condition: "", effect: "", direction: "positive", confidence: "medium",
    summary: "", citation: "", year: "",
    studyType: "rct", sampleSize: 0, modelType: "", modelCaveat: "", contradictedBy: "",
    relevantFor: [], contraindicates: [],
  });
  const [pdfFile, setPdfFile]           = useState(null);
  const [pdfStatus, setPdfStatus]       = useState(null); // null | reading | extracting
  const [migrating, setMigrating]       = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [libFilter, setLibFilter] = useState("all");

  // Profile / Biometrics
  const [profile, setProfile] = useState({
    name: "", dobYear: "", dobMonth: "", ageGroup: "", sex: "",
    heightCm: "", weightKg: "",
    systolic: "", diastolic: "",
    fastingGlucose: "", hba1c: "",
    totalCholesterol: "", ldl: "", hdl: "", triglycerides: "",
    unitHeight: "cm", unitWeight: "kg",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  // Individual biometric readings (one metric per entry)
  const [bioReadings, setBioReadings] = useState([]);
  // Add Measurement modal
  const [measureModal, setMeasureModal] = useState(false);
  const [measureMetric, setMeasureMetric] = useState(null); // selected metric key
  const [measureValue, setMeasureValue]  = useState("");
  const [measureValue2, setMeasureValue2] = useState(""); // for BP diastolic
  const [measureDate, setMeasureDate]    = useState(today());

  // ── Experiment state ───────────────────────────────────────────────
  const [experiments, setExperiments]   = useState([]);
  const [activeExp, setActiveExp]       = useState(null); // id of running experiment
  const [expScreen, setExpScreen]       = useState("list"); // list | setup | running | report
  const [expSetup, setExpSetup]         = useState({ fibreId: "psyllium", dose: "", unit: "g", time: "morning", water: 2000, days: 14 });

  // ── Menu state ─────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen]         = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseResults, setPurchaseResults] = useState({}); // { [fibreId]: [...links] }
  const [measureSaved, setMeasureSaved]  = useState(false);

  // Water
  const [waterLogs, setWaterLogs] = useState([]); // { id, date, dateKey, ml, time }
  const [waterGoal, setWaterGoal] = useState(DEFAULT_GOAL_ML);
  const [flashBtn, setFlashBtn] = useState(null);
  const [ripple, setRipple] = useState(false);
  const [customMl, setCustomMl] = useState("");

  // Calendar
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  // ── LocalStorage persistence ───────────────────────────────────────
  const STORAGE_KEY = "fibrekit_v1";
  // Load on mount — all state above must be declared before this runs
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const d = JSON.parse(saved);
      if (d.poopLogs)    setPoopLogs(d.poopLogs.map(l => ({ ...l, date: new Date(l.date) })));
      if (d.fibreLogs)   setFibreLogs(d.fibreLogs);
      if (d.symLogs)     setSymLogs(d.symLogs.map(l => ({ ...l, date: l.date ? new Date(l.date) : undefined })));
      if (d.waterLogs)   setWaterLogs(d.waterLogs);
      if (d.waterGoal)   setWaterGoal(d.waterGoal);
      if (d.expData)     setExpData(d.expData);
      if (d.profile)     setProfile(d.profile);
      if (d.bioReadings) setBioReadings(d.bioReadings);
      if (d.recs)        setRecs(d.recs);
      if (d.answers)     setAnswers(d.answers);
      if (d.insights)    setInsights(d.insights);
      if (d.experiments) setExperiments(d.experiments);
      if (d.activeExp !== undefined) setActiveExp(d.activeExp);
    } catch(e) { console.warn("FibreKit: localStorage load error", e); }
  }, []);

  // Save whenever key state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        poopLogs, fibreLogs, symLogs, waterLogs, waterGoal,
        expData, profile, bioReadings, recs, answers, insights,
        experiments, activeExp,
      }));
    } catch(e) { console.warn("FibreKit: localStorage save error", e); }
  }, [poopLogs, fibreLogs, symLogs, waterLogs, waterGoal,
      expData, profile, bioReadings, recs, answers, insights,
      experiments, activeExp]);

  function fmtTimeNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  // Today's water total
  const todayKey = today();
  const todayWaterMl = waterLogs.filter(w => w.dateKey === todayKey).reduce((a, w) => a + w.ml, 0);
  const waterPct = Math.min(todayWaterMl / waterGoal, 1);

  function addWater(ml) {
    const dateObj = new Date();
    setWaterLogs(prev => [{ id: Date.now(), date: dateObj, dateKey: toKey(dateObj), ml, time: fmtTimeNow() }, ...prev]);
    setFlashBtn(ml);
    setRipple(true);
    setTimeout(() => setFlashBtn(null), 400);
    setTimeout(() => setRipple(false), 700);
  }

  function removeLastWater() {
    const todayEntries = waterLogs.filter(w => w.dateKey === todayKey);
    if (todayEntries.length === 0) return;
    const lastId = todayEntries[0].id;
    setWaterLogs(prev => prev.filter(w => w.id !== lastId));
  }

  // Poop session
  useEffect(() => {
    if (active) { timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000); }
    else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [active]);

  function startSession() {
    setSessStart(new Date()); setElapsed(0); setActive(true);
    setPStep("timer"); setPForm({ bristolType: null, colour: null, straining: null, complete: null, notes: "" });
    setScreen("poop");
  }
  function stopTimer() { setActive(false); setPStep("details"); }
  function savePoopLog() {
    setPoopLogs([{ id: Date.now(), date: sessStart, duration: elapsed, ...pForm }, ...poopLogs]);
    setPStep("done");
  }
  function finishSession() { setScreen("home"); setPStep("timer"); setElapsed(0); setActive(false); }

  // Quiz
  const qStep = QUIZ_STEPS[quizStep];
  function handleOpt(v) {
    if (qStep.type === "multi") {
      const cur = curAns || [];
      if (v === "none") setCurAns(["none"]);
      else { const f = cur.filter(x => x !== "none"); setCurAns(f.includes(v) ? f.filter(x => x !== v) : [...f, v]); }
    } else setCurAns(v);
  }
  function nextQ() {
    const na = { ...answers, [qStep.id]: curAns };
    setAnswers(na);
    if (quizStep < QUIZ_STEPS.length - 1) { setQuizStep(quizStep + 1); setCurAns(null); }
    else { setRecs(scoreAndRank(na, insights, profileInsightTags(), expData)); setScreen("results"); }
  }

  // Experience quiz helpers
  function startExpQuiz() {
    setExpStep("select");
    setExpSelected([]);
    setExpIdx(0);
    setExpCurrent({});
    setScreen("exp_quiz");
  }

  function toggleExpFibre(id) {
    setExpSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function beginRating() {
    if (expSelected.length === 0) return;
    setExpIdx(0);
    setExpCurrent({});
    setExpStep("rate");
  }

  function setOverall(val) {
    setExpCurrent(c => ({ ...c, overall: val }));
  }

  function togglePos(id) {
    setExpCurrent(c => ({
      ...c,
      positives: c.positives?.includes(id)
        ? c.positives.filter(x => x !== id)
        : [...(c.positives || []), id]
    }));
  }

  function toggleNeg(id) {
    setExpCurrent(c => ({
      ...c,
      negatives: c.negatives?.includes(id)
        ? c.negatives.filter(x => x !== id)
        : [...(c.negatives || []), id]
    }));
  }

  function advanceExpStep() {
    const fibreId = expSelected[expIdx];
    if (expStep === "rate") {
      setExpStep("effects_pos");
    } else if (expStep === "effects_pos") {
      setExpStep("effects_neg");
    } else if (expStep === "effects_neg") {
      // Save current fibre's data
      setExpData(prev => ({ ...prev, [fibreId]: { ...expCurrent } }));
      if (expIdx < expSelected.length - 1) {
        setExpIdx(i => i + 1);
        setExpCurrent({});
        setExpStep("rate");
      } else {
        // All done — save final and go to done screen
        setExpData(prev => ({ ...prev, [fibreId]: { ...expCurrent } }));
        setExpStep("done");
      }
    }
  }

  function skipCurrentFibre() {
    if (expIdx < expSelected.length - 1) {
      setExpIdx(i => i + 1);
      setExpCurrent({});
      setExpStep("rate");
    } else {
      setExpStep("done");
    }
  }

  // ── Experiment helpers ────────────────────────────────────────────
  function startExperiment() {
    if (!expSetup.dose) return;
    const fibre = ALL_FIBRES_EXP.find(f => f.id === expSetup.fibreId) || FIBRES[0];
    const exp = {
      id: Date.now(),
      fibreId: expSetup.fibreId,
      fibreName: fibre.name,
      fibreEmoji: fibre.emoji,
      dose: expSetup.dose,
      unit: expSetup.unit,
      time: expSetup.time,
      waterGoalMl: expSetup.water,
      days: expSetup.days,
      startDate: today(),
      doseLogs: [], // [{date, taken}]
      status: "running",
    };
    setExperiments(prev => [exp, ...prev]);
    setActiveExp(exp.id);
    setExpScreen("running");
  }

  function logExpDose(taken) {
    const todayStr = today();
    setExperiments(prev => prev.map(e => {
      if (e.id !== activeExp) return e;
      const already = e.doseLogs.find(d => d.date === todayStr);
      if (already) return e;
      return { ...e, doseLogs: [...e.doseLogs, { date: todayStr, taken }] };
    }));
  }

  function finishExperiment() {
    setExperiments(prev => prev.map(e => e.id === activeExp ? { ...e, status: "complete" } : e));
    setActiveExp(null);
    setExpScreen("report");
  }

  function getActiveExp() { return experiments.find(e => e.id === activeExp); }

  function expDayNumber() {
    const exp = getActiveExp();
    if (!exp) return 0;
    const start = new Date(exp.startDate);
    const now = new Date();
    return Math.floor((now - start) / 86400000) + 1;
  }

  function expComplianceRate(exp) {
    if (!exp || !exp.doseLogs.length) return 0;
    const taken = exp.doseLogs.filter(d => d.taken).length;
    return Math.round((taken / exp.doseLogs.length) * 100);
  }

  // ── Black stool warning helper ─────────────────────────────────────
  function BlackStoolWarning({ show, onIron }) {
    if (!show) return null;
    return (
      <div style={{ marginBottom: 12, padding: "14px", borderRadius: 14, background: "#1A1A2E", border: "2px solid #C0392B" }}>
        <div style={{ fontWeight: 700, color: "#FF6B6B", fontSize: 14, marginBottom: 6 }}>⚠️ Medical Advisory</div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.85)", lineHeight: 1.6, marginBottom: 10 }}>
          Black, tar-like stools can indicate bleeding in the upper gastrointestinal tract. 
          We recommend you contact your GP or seek medical advice promptly, especially if 
          accompanied by dizziness, weakness, or abdominal pain.
        </p>
        <button onClick={onIron} style={{ fontSize: 12, color: "#FF6B6B", background: "none", border: "1px solid #FF6B6B", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          I'm taking iron supplements — dismiss
        </button>
      </div>
    );
  }

  // ── PDF Report generator ───────────────────────────────────────────
  async function generateFibreReport() {
    // Build report data
    const fibreHistory = {};
    fibreLogs.forEach(log => {
      const key = log.fibre;
      if (!fibreHistory[key]) fibreHistory[key] = { name: log.fibre, logs: [] };
      fibreHistory[key].logs.push(log);
    });
    const expSummaries = Object.entries(expData).map(([id, data]) => {
      const fibre = ALL_FIBRES_EXP.find(f => f.id === id);
      const scale = EXP_SCALE.find(s => s.value === data.overall);
      return { fibre: fibre?.name || id, overall: scale?.label || "Unknown", positives: data.positives || [], negatives: data.negatives || [] };
    });
    const completedExps = experiments.filter(e => e.status === "complete");

    // Generate HTML report string for printing
    const reportDate = new Date().toLocaleDateString("en-AU", { day:"numeric", month:"long", year:"numeric" });
    const userName = profile.name || "Patient";

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>FibreKit Report — ${userName}</title>
<style>
  body { font-family: Georgia, serif; color: #111; max-width: 800px; margin: 0 auto; padding: 40px; }
  h1 { font-size: 26px; border-bottom: 2px solid #3B82C4; padding-bottom: 10px; color: #1C3249; }
  h2 { font-size: 17px; color: #2563A0; margin-top: 28px; border-left: 4px solid #3B82C4; padding-left: 10px; }
  h3 { font-size: 14px; margin-bottom: 4px; }
  .meta { color: #6B7280; font-size: 13px; margin-bottom: 24px; }
  .card { border: 1px solid #E5EAF0; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
  .badge { display:inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }
  .good { background: #DCFAEE; color: #15774F; }
  .bad  { background: #FEE2E2; color: #DC2626; }
  .neutral { background: #F3F4F6; color: #6B7280; }
  .tag { display:inline-block; background: #EFF6FF; color: #2563A0; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin: 2px; }
  .warn { background: #FEE2E2; border: 1px solid #FCA5A5; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #DC2626; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 8px; background: #F6F9FC; font-size: 12px; }
  td { padding: 8px; border-bottom: 1px solid #E5EAF0; }
  footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #E5EAF0; font-size: 11px; color: #9CA3AF; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<h1>🌿 FibreKit — Dietary Fibre Report</h1>
<div class="meta">
  <strong>Patient:</strong> ${userName} &nbsp;|&nbsp;
  ${profile.dob ? `<strong>DOB:</strong> ${profile.dob} &nbsp;|&nbsp;` : ""}
  <strong>Report generated:</strong> ${reportDate}
</div>
${profile.height || profile.weight ? `
<h2>Biometric Summary</h2>
<div class="card">
  ${profile.height ? `<strong>Height:</strong> ${profile.height} cm &nbsp; ` : ""}
  ${profile.weight ? `<strong>Weight:</strong> ${profile.weight} kg &nbsp; ` : ""}
  ${profile.bpSys  ? `<strong>Blood pressure:</strong> ${profile.bpSys}/${profile.bpDia} mmHg &nbsp; ` : ""}
  ${profile.glucose ? `<strong>Fasting glucose:</strong> ${profile.glucose} mmol/L` : ""}
</div>` : ""}

<h2>Fibre Experience Summary</h2>
${expSummaries.length === 0 ? "<p style='color:#6B7280;font-size:13px;'>No fibres rated yet.</p>" : 
  expSummaries.map(e => `
<div class="card">
  <h3>${e.fibre}</h3>
  <span class="badge ${e.overall.includes("Fav")?"good":e.overall.includes("Unfav")?"bad":"neutral"}">${e.overall}</span>
  ${e.positives.length > 0 ? `<div style="margin-top:8px;"><strong style="font-size:12px;">Positive effects:</strong><br>${e.positives.map(p => `<span class="tag">${p}</span>`).join(" ")}</div>` : ""}
  ${e.negatives.length > 0 ? `<div style="margin-top:6px;"><strong style="font-size:12px;">Side effects:</strong><br>${e.negatives.map(n => `<span class="tag" style="background:#FEE2E2;color:#DC2626;">${n}</span>`).join(" ")}</div>` : ""}
</div>`).join("")}

${fibreLogs.length > 0 ? `
<h2>Fibre Log History</h2>
<table>
<tr><th>Date</th><th>Fibre</th><th>Dose</th><th>Symptoms noted</th><th>Notes</th></tr>
${fibreLogs.slice(0, 50).map(l => `<tr>
  <td>${l.date || ""}</td>
  <td>${l.fibre || ""}</td>
  <td>${l.dose || ""}${l.unit || ""}</td>
  <td>${(l.symptoms || []).join(", ") || "—"}</td>
  <td>${l.notes || "—"}</td>
</tr>`).join("")}
</table>` : ""}

${completedExps.length > 0 ? `
<h2>Completed Experiments</h2>
${completedExps.map(e => `
<div class="card">
  <h3>${e.fibreEmoji} ${e.fibreName} — ${e.days}-day experiment</h3>
  <div style="font-size:13px;color:#6B7280;">Started: ${e.startDate} &nbsp;|&nbsp; Dose: ${e.dose}${e.unit} ${e.time} &nbsp;|&nbsp; Water target: ${e.waterGoalMl/1000}L/day</div>
  <div style="margin-top:8px;font-size:13px;"><strong>Compliance:</strong> ${expComplianceRate(e)}% (${e.doseLogs.filter(d=>d.taken).length} of ${e.doseLogs.length} doses taken)</div>
</div>`).join("")}` : ""}

${poopLogs.length > 0 ? `
<h2>Digestive Log Summary (last 20 entries)</h2>
<table>
<tr><th>Date</th><th>Duration</th><th>Bristol Type</th><th>Colour</th><th>Straining</th></tr>
${poopLogs.slice(0,20).map(l => `<tr>
  <td>${l.date ? new Date(l.date).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}) : ""}</td>
  <td>${l.duration ? Math.floor(l.duration/60)+"m "+l.duration%60+"s" : "—"}</td>
  <td>${l.bristolType ? "Type "+l.bristolType : "—"}</td>
  <td>${l.colour || "—"}</td>
  <td>${l.straining || "—"}</td>
</tr>`).join("")}
</table>` : ""}

<footer>
  <p>This report was generated by FibreKit and is intended for personal records and healthcare consultations. 
  It does not constitute medical advice. Please consult your healthcare provider before making significant dietary changes.</p>
</footer>
</body>
</html>`;

    // Open in new window for print/save-as-PDF
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 500);
    }
  }

  // ── Purchase search (calls Claude API with web search) ─────────────
  async function searchPurchaseLinks(fibreId, fibreName) {
    if (purchaseResults[fibreId]) return; // already fetched
    setPurchaseLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{
            role: "user",
            content: `Search for where to buy "${fibreName}" dietary fibre supplement online in Australia. Find 3-4 reputable online stores or products. Return ONLY a JSON array like: [{"store":"Name","url":"https://...","product":"Product name","price":"approx price if found"}]. No other text.`
          }]
        })
      });
      const data = await res.json();
      const textBlock = data.content?.find(b => b.type === "text");
      if (textBlock) {
        const clean = textBlock.text.replace(/```json|```/g, "").trim();
        const links = JSON.parse(clean);
        setPurchaseResults(prev => ({ ...prev, [fibreId]: links }));
      }
    } catch(e) {
      setPurchaseResults(prev => ({ ...prev, [fibreId]: [] }));
    }
    setPurchaseLoading(false);
  }

  const expFibre = expSelected[expIdx] ? ALL_FIBRES_EXP.find(f => f.id === expSelected[expIdx]) : null;
  const expProgress = expSelected.length > 0 ? (expIdx + (expStep === "done" ? 1 : 0)) / expSelected.length : 0;

  // Carousel state for toilet timer reading cards
  const [carouselIdx, setCarouselIdx] = useState(0);

  // GlossaryTerm inline component
  function GlossaryTerm({ termKey, children }) {
    const entry = GLOSSARY[termKey];
    if (!entry) return <span>{children}</span>;
    const isOpen = glossOpen === termKey;
    return (
      <span
        className="gloss-link"
        style={{ color: "inherit" }}
        onClick={e => {
          e.stopPropagation();
          if (isOpen) { setGlossOpen(null); return; }
          const rect = e.target.getBoundingClientRect();
          const x = Math.min(rect.left, window.innerWidth - 310);
          const y = rect.bottom + 8 + window.scrollY;
          setGlossPos({ x, y });
          setGlossOpen(termKey);
        }}
      >{children}</span>
    );
  }

  // Fibre log
  function addFibreLog() {
    if (!lf.fibre || !lf.dose) return;
    setFibreLogs([{ ...lf, id: Date.now(), dateObj: new Date() }, ...fibreLogs]);
    setLf({ fibre: "", dose: "", unit: "g", symptoms: [], notes: "", date: today() });
  }
  function togFibreSym(s) { setLf(f => ({ ...f, symptoms: f.symptoms.includes(s) ? f.symptoms.filter(x => x !== s) : [...f.symptoms, s] })); }

  // Symptom log
  function togSym(id) { setSymForm(f => ({ ...f, symptoms: f.symptoms.includes(id) ? f.symptoms.filter(x => x !== id) : [...f.symptoms, id] })); }
  function setSev(id, v) { setSymForm(f => ({ ...f, severity: { ...f.severity, [id]: v } })); }
  function saveSymLog() {
    if (symForm.symptoms.length === 0) return;
    const dateObj = new Date();
    setSymLogs([{ id: Date.now(), date: dateObj, dateKey: toKey(dateObj), ...symForm }, ...symLogs]);
    setSymForm({ symptoms: [], severity: {}, notes: "", time: fmtTimeNow() });
    setSymSaved(true);
    setTimeout(() => { setSymSaved(false); setScreen("home"); }, 1200);
  }

  // Admin / Research Library
  function tryUnlock() {
    if (pinInput === ADMIN_PIN) { setAdminUnlocked(true); setPinError(false); setPinInput(""); setScreen("admin"); }
    else { setPinError(true); setPinInput(""); }
  }

  function addInsight(insight) {
    setInsights(prev => [{ ...insight, id: Date.now(), active: true, addedAt: new Date().toISOString() }, ...prev]);
  }

  function toggleInsight(id) {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));
  }

  function deleteInsight(id) {
    setInsights(prev => prev.filter(i => i.id !== id));
  }

  async function extractFromAbstract(text) {
    setAiLoading(true); setAiResults(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1800,
          system: INSIGHT_EXTRACTION_SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Extract the research insight from this text. Return ONLY valid JSON matching the schema exactly.\n\nText:\n${text}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      setAiResults(JSON.parse(clean));
    } catch(e) { setAiResults({ error: true }); }
    setAiLoading(false);
  }

  async function extractFromUrl(url) {
    setAiLoading(true); setAiResults(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1800,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: INSIGHT_EXTRACTION_SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Search for and retrieve this paper, then extract the insight. Return ONLY valid JSON matching the schema.\n\nURL/DOI: ${url}` }]
        })
      });
      const data = await res.json();
      const textBlock = data.content?.filter(b => b.type === "text").map(b => b.text).join("");
      const clean = (textBlock || "{}").replace(/```json|```/g, "").trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      setAiResults(jsonMatch ? JSON.parse(jsonMatch[0]) : { error: true });
    } catch(e) { setAiResults({ error: true }); }
    setAiLoading(false);
  }

  // ── PDF extraction ──────────────────────────────────────────────────────
  async function extractFromPdf(file) {
    setAiLoading(true); setAiResults(null);
    setPdfStatus("reading");
    try {
      // Read PDF as base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setPdfStatus("extracting");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: INSIGHT_EXTRACTION_SYSTEM_PROMPT + "\n\nIMPORTANT: This is a FULL TEXT paper, not just an abstract. Read the Methods section carefully to identify the study model (in vitro, in vivo, human RCT etc.). Read the Discussion and Limitations sections for author-stated caveats. The abstract conclusion may not reflect the full nuance of the paper — prioritise what the Methods and Discussion reveal.",
          messages: [{
            role: "user",
            content: [
              { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
              { type: "text", text: "Extract the key research insight from this full-text paper. Pay special attention to: (1) the study model in Methods, (2) any in vitro vs in vivo limitations, (3) author-stated caveats in Discussion. Return ONLY valid JSON matching the schema exactly." }
            ]
          }]
        })
      });
      const data = await res.json();
      const raw = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      setAiResults(jsonMatch ? JSON.parse(jsonMatch[0]) : { error: true });
    } catch(e) { console.error(e); setAiResults({ error: true }); }
    setPdfStatus(null);
    setAiLoading(false);
  }

  // ── AI migration: tag all existing insights with new schema fields ──────
  async function migrateInsight(insight) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: `You are a scientific research assistant. Given an existing research insight summary, infer the missing schema fields. Return ONLY valid JSON with ONLY these fields: { "relevantFor": [], "contraindicates": [], "studyType": "", "sampleSize": 0, "modelType": "", "modelCaveat": "", "contradictedBy": "" }. studyType must be one of: meta_analysis, systematic_review, rct, human_cohort, human_observational, ex_vivo, animal, in_vitro, case_study, expert_opinion. relevantFor and contraindicates are arrays of lowercase tag strings matching what quiz answers produce.`,
          messages: [{ role: "user", content: `Infer missing fields for this insight:\n${JSON.stringify({ fibreId: insight.fibreId, condition: insight.condition, effect: insight.effect, summary: insight.summary, citation: insight.citation, confidence: insight.confidence })}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch(e) { return {}; }
  }

  async function runMigration() {
    setMigrating(true);
    setMigrationProgress(0);
    const updated = [...insights];
    for (let i = 0; i < updated.length; i++) {
      const ins = updated[i];
      if (ins.relevantFor && ins.relevantFor.length > 0) {
        setMigrationProgress(i + 1);
        continue; // already tagged
      }
      const newFields = await migrateInsight(ins);
      updated[i] = { ...ins, ...newFields };
      setMigrationProgress(i + 1);
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    }
    setInsights(updated);
    setMigrating(false);
  }

  async function searchPapers(query) {
    setAiLoading(true); setAiSearchResults([]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: `You are a scientific research assistant specialising in dietary fibre and gut microbiome. Search PubMed and scientific sources for peer-reviewed research. Return ONLY a JSON array of up to 5 papers, no markdown. Each item: { "title": "", "authors": "", "year": "", "journal": "", "fibreId": "", "condition": "", "direction": "positive|negative|neutral", "confidence": "low|medium|high", "summary": "", "citation": "" }. fibreId must be one of: psyllium, inulin, beta_glucan, resistant_starch, pectin, arabinogalactan.`,
          messages: [{ role: "user", content: `Search for peer-reviewed research on: ${query}. Return JSON array of up to 5 relevant papers.` }]
        })
      });
      const data = await res.json();
      const textBlock = data.content?.filter(b => b.type === "text").map(b => b.text).join("");
      const clean = (textBlock || "[]").replace(/```json|```/g, "").trim();
      const arrMatch = clean.match(/\[[\s\S]*\]/);
      setAiSearchResults(arrMatch ? JSON.parse(arrMatch[0]) : []);
    } catch(e) { setAiSearchResults([]); }
    setAiLoading(false);
  }

  const filteredInsights = libFilter === "all" ? insights : insights.filter(i => i.fibreId === libFilter);
  const activeInsightCount = insights.filter(i => i.active).length;

  // ── Profile / Biometric helpers ───────────────────────────────────────────
  function calcBMI() {
    const h = parseFloat(profile.unitHeight === "cm" ? profile.heightCm : profile.heightCm * 2.54);
    const w = parseFloat(profile.unitWeight === "kg" ? profile.weightKg : profile.weightKg * 0.453592);
    if (!h || !w) return null;
    return (w / ((h / 100) ** 2)).toFixed(1);
  }

  function bmiCategory(bmi) {
    if (!bmi) return null;
    const b = parseFloat(bmi);
    if (b < 18.5) return { label: "Underweight", colour: "#2471A3", bg: "#EBF5FB" };
    if (b < 25)   return { label: "Healthy weight", colour: "#27AE60", bg: "#E9F7EF" };
    if (b < 30)   return { label: "Overweight", colour: "#E67E22", bg: "#FEF0E6" };
    return              { label: "Obese", colour: "#C0392B", bg: "#FDECEA" };
  }

  function bpCategory(sys, dia) {
    const s = parseInt(sys), d = parseInt(dia);
    if (!s || !d) return null;
    if (s < 120 && d < 80)  return { label: "Normal", colour: "#27AE60", bg: "#E9F7EF" };
    if (s < 130 && d < 80)  return { label: "Elevated", colour: "#E67E22", bg: "#FEF0E6" };
    if (s < 140 || d < 90)  return { label: "High Stage 1", colour: "#E67E22", bg: "#FEF0E6" };
    return                    { label: "High Stage 2", colour: "#C0392B", bg: "#FDECEA" };
  }

  function glucoseCategory(g) {
    const v = parseFloat(g);
    if (!v) return null;
    if (v < 5.6)  return { label: "Normal", colour: "#27AE60", bg: "#E9F7EF" };
    if (v < 7.0)  return { label: "Pre-diabetic range", colour: "#E67E22", bg: "#FEF0E6" };
    return               { label: "Diabetic range", colour: "#C0392B", bg: "#FDECEA" };
  }

  function cholesterolCategory(tc) {
    const v = parseFloat(tc);
    if (!v) return null;
    if (v < 5.0)  return { label: "Desirable", colour: "#27AE60", bg: "#E9F7EF" };
    if (v < 6.2)  return { label: "Borderline high", colour: "#E67E22", bg: "#FEF0E6" };
    return               { label: "High", colour: "#C0392B", bg: "#FDECEA" };
  }

  // Get latest reading value for a metric key
  function latestReading(key) {
    const r = bioReadings.filter(r => r.metric === key);
    return r.length > 0 ? r[0].value : null;
  }

  // Derive profile-based insight tags used to boost quiz scoring
  function profileInsightTags() {
    const tags = [];
    const bmiVal = parseFloat(calcBMI());
    if (bmiVal && bmiVal >= 25) tags.push("metabolic", "blood sugar", "cholesterol");
    if (bmiVal && bmiVal >= 30) tags.push("obesity", "insulin");
    const latestBP = bioReadings.find(r => r.metric === "bloodPressure");
    const sys = latestBP ? latestBP.value : parseInt(profile.systolic);
    const dia = latestBP ? latestBP.value2 : parseInt(profile.diastolic);
    if (sys >= 130 || dia >= 80) tags.push("cardiovascular", "blood pressure");
    const glu = latestReading("fastingGlucose") ?? parseFloat(profile.fastingGlucose);
    if (glu && glu >= 5.6) tags.push("blood sugar", "glucose", "insulin", "metabolic");
    const tc = latestReading("totalCholesterol") ?? parseFloat(profile.totalCholesterol);
    if (tc && tc >= 5.0) tags.push("cholesterol", "lipid", "cardiovascular");
    const ldlV = latestReading("ldl") ?? parseFloat(profile.ldl);
    if (ldlV && ldlV >= 3.4) tags.push("ldl", "cholesterol");
    return tags;
  }

  function profileComplete() {
    return profile.heightCm && profile.weightKg;
  }

  const bmi = calcBMI();
  const bmiCat = bmiCategory(bmi);
  const bpCat = bpCategory(profile.systolic, profile.diastolic);
  const glucCat = glucoseCategory(profile.fastingGlucose);
  const cholCat = cholesterolCategory(profile.totalCholesterol);

  // DOB-derived age
  function calcAge() {
    const y = parseInt(profile.dobYear), m = parseInt(profile.dobMonth);
    if (!y || y < 1900 || y > new Date().getFullYear()) return null;
    const now = new Date();
    let age = now.getFullYear() - y;
    if (m && now.getMonth() + 1 < m) age--;
    return age;
  }

  function ageGroupFromDOB() {
    const age = calcAge();
    if (age === null) return null;
    if (age < 18) return "Under 18";
    if (age < 25) return "18–24";
    if (age < 35) return "25–34";
    if (age < 45) return "35–44";
    if (age < 55) return "45–54";
    if (age < 65) return "55–64";
    if (age < 75) return "65–74";
    return "75+";
  }

  function openMeasureModal(metricKey = null) {
    setMeasureMetric(metricKey);
    setMeasureValue("");
    setMeasureValue2("");
    setMeasureDate(today());
    setMeasureSaved(false);
    setMeasureModal(true);
  }

  function addReading() {
    if (!measureMetric || !measureValue) return;
    const m = MEASURE_METRICS.find(x => x.key === measureMetric);
    const entry = {
      id: Date.now(),
      date: new Date(measureDate + "T12:00:00").toISOString(),
      dateKey: measureDate,
      metric: measureMetric,
      label: m?.label || measureMetric,
      value: parseFloat(measureValue),
      value2: measureValue2 ? parseFloat(measureValue2) : null,
      unit: m?.unit || "",
      colour: m?.colour || C.accent,
    };
    setBioReadings(prev => [entry, ...prev]);
    // Also update the live profile value so categories reflect latest reading
    if (measureMetric === "weightKg") setProfile(p => ({ ...p, weightKg: measureValue }));
    if (measureMetric === "bloodPressure") setProfile(p => ({ ...p, systolic: measureValue, diastolic: measureValue2 }));
    if (measureMetric === "fastingGlucose") setProfile(p => ({ ...p, fastingGlucose: measureValue }));
    if (measureMetric === "hba1c") setProfile(p => ({ ...p, hba1c: measureValue }));
    if (measureMetric === "totalCholesterol") setProfile(p => ({ ...p, totalCholesterol: measureValue }));
    if (measureMetric === "ldl") setProfile(p => ({ ...p, ldl: measureValue }));
    if (measureMetric === "hdl") setProfile(p => ({ ...p, hdl: measureValue }));
    if (measureMetric === "triglycerides") setProfile(p => ({ ...p, triglycerides: measureValue }));
    setMeasureSaved(true);
    setTimeout(() => { setMeasureModal(false); setMeasureSaved(false); }, 900);
  }

  const derivedAgeGroup = ageGroupFromDOB();
  const displayAge = calcAge();

  const isSel = v => qStep?.type === "multi" ? (curAns || []).includes(v) : curAns === v;

  // Calendar data
  function buildCalendarData() {
    const data = {};
    const addDot = (key, colour) => { if (!data[key]) data[key] = []; data[key].push(colour); };
    poopLogs.forEach(l => addDot(toKey(l.date), "#C8794A"));
    fibreLogs.forEach(l => addDot(l.date || toKey(l.dateObj || new Date()), "#6B8F71"));
    symLogs.forEach(l => addDot(l.dateKey, "#6C3483"));
    waterLogs.forEach(l => {
      if (!data[l.dateKey]) data[l.dateKey] = [];
      // Only add blue dot once per day
      if (!data[l.dateKey].includes("#2471A3")) data[l.dateKey].push("#2471A3");
    });
    return data;
  }

  function getDayData(key) {
    const dayWater = waterLogs.filter(w => w.dateKey === key);
    const dayWaterMl = dayWater.reduce((a, w) => a + w.ml, 0);
    return {
      poop: poopLogs.filter(l => toKey(l.date) === key),
      fibre: fibreLogs.filter(l => (l.date || toKey(l.dateObj)) === key),
      symptoms: symLogs.filter(l => l.dateKey === key),
      water: dayWater,
      waterMl: dayWaterMl,
    };
  }

  const calData = buildCalendarData();
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  // Water status helpers
  function waterStatus(ml, goal) {
    const pct = ml / goal;
    if (pct >= 1)   return { label: "Goal reached! 🎉", colour: "#27AE60", bg: "#E9F7EF" };
    if (pct >= 0.75) return { label: "Almost there",    colour: "#2471A3", bg: "#EBF5FB" };
    if (pct >= 0.5)  return { label: "Halfway",         colour: "#2980B9", bg: "#EBF5FB" };
    if (pct >= 0.25) return { label: "Keep going",      colour: "#E67E22", bg: "#FEF0E6" };
    return                  { label: "Just started",    colour: "#C0392B", bg: "#FDECEA" };
  }

  const wStatus = waterStatus(todayWaterMl, waterGoal);

  // ── RENDER ────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* ═══ HOME ═══════════════════════════════════════════════════════════ */}
        {screen === "home" && <>
          <div style={{ padding: "18px 0 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(145deg,#1C3249,#3B82C4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 3px 10px rgba(59,130,196,.3)" }}>🌿</div>
              <div>
                <h1 className="serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>FibreKit</h1>
                <p style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>Track your gut · Discover your fibres</p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <button onClick={() => setScreen("profile")} style={{ background: "none", border: "1.5px solid #E5EAF0", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: C.muted, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {profile.name ? profile.name.split(" ")[0] : "Profile"} →
                </button>
              </div>
              <button className="hamburger" onClick={() => setMenuOpen(true)}>
                <span /><span /><span />
              </button>
            </div>
          </div>

          {/* ── BIG POOP LOG HERO CARD ── */}
          <div onClick={startSession} style={{ background: "linear-gradient(145deg,#1C3249 0%,#2B5278 60%,#3B82C4 100%)", borderRadius: 22, padding: "18px 20px", marginBottom: 10, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 6px 24px rgba(37,99,160,.3)" }}>
            <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 38, lineHeight: 1, flexShrink: 0 }}>💩</div>
              <div style={{ flex: 1, color: "white" }}>
                <div style={{ fontSize: 9, opacity: .6, letterSpacing: 1.3, textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>Toilet Session</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>Start Timer</div>
                <div style={{ fontSize: 11, opacity: .7 }}>Bristol · colour · symptoms · duration</div>
                {poopLogs.length > 0 && (
                  <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                    <span style={{ padding: "3px 9px", borderRadius: 20, background: "rgba(255,255,255,.15)", fontSize: 10, fontWeight: 700 }}>
                      Last: {fmtDate(poopLogs[0].date)}{poopLogs[0].bristolType ? ` · Type ${poopLogs[0].bristolType}` : ""}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ color: "rgba(255,255,255,.35)", fontSize: 20, flexShrink: 0 }}>›</div>
            </div>
          </div>

          {/* ── WATER + SYMPTOMS TILES (Option C style) ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {/* Water tile */}
            <div onClick={() => setScreen("water")} style={{ background: "linear-gradient(145deg,#1D4ED8,#3B82C4)", borderRadius: 18, padding: "14px", cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 3px 12px rgba(59,130,196,.22)", minHeight: 110, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ position: "absolute", right: -10, bottom: -10, width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
              <div style={{ color: "white" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>💧</div>
                <div style={{ fontSize: 9, opacity: .65, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Water</div>
                <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{(todayWaterMl/1000).toFixed(1).replace(/\.0$/,"")}L</div>
                <div style={{ fontSize: 10, opacity: .65, marginTop: 2 }}>of {waterGoal/1000}L goal</div>
              </div>
              <div>
                <div style={{ height: 3, background: "rgba(255,255,255,.25)", borderRadius: 2, margin: "8px 0 7px" }}>
                  <div style={{ height: "100%", width: `${Math.round(waterPct*100)}%`, background: waterPct >= 1 ? "#22A06B" : "white", borderRadius: 2, transition: "width .4s" }} />
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {[250,500].map(ml => (
                    <button key={ml} onClick={e=>{e.stopPropagation();addWater(ml);}}
                      style={{ flex:1, padding:"5px 0", borderRadius:7, border:"1.5px solid rgba(255,255,255,.3)", background:"rgba(255,255,255,.12)", color:"white", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                      +{ml}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Symptoms tile */}
            <div onClick={() => { setSymForm({ symptoms: [], severity: {}, notes: "", time: fmtTimeNow() }); setScreen("symptoms"); }} style={{ background: "linear-gradient(145deg,#5B21B6,#7C3AED)", borderRadius: 18, padding: "14px", cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 3px 12px rgba(124,58,237,.22)", minHeight: 110, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ position: "absolute", right: -10, bottom: -10, width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
              <div style={{ color: "white" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>🫧</div>
                <div style={{ fontSize: 9, opacity: .65, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Symptoms</div>
                <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{symLogs.filter(l => l.dateKey === today()).length > 0 ? symLogs.filter(l => l.dateKey === today()).length : symLogs.length > 0 ? "—" : "0"}</div>
                <div style={{ fontSize: 10, opacity: .65, marginTop: 2 }}>{symLogs.length > 0 ? `last: ${fmtDate(symLogs[0].date || new Date())}` : "none logged"}</div>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                {symLogs.slice(0,3).flatMap(l => l.symptoms?.slice(0,1) || []).map((sid, i) => {
                  const s = SYMPTOMS.find(x => x.id === sid);
                  return s ? <span key={i} style={{ fontSize: 16 }}>{s.emoji}</span> : null;
                })}
                {symLogs.length === 0 && <span style={{ fontSize: 11, opacity: .6, color: "white" }}>tap to log</span>}
              </div>
            </div>
          </div>

          {/* ── FEATURE LIST ROWS (Option B style) ── */}
          <div style={{ background: "#FFFFFF", borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 10, boxShadow: "0 1px 6px rgba(17,24,39,.04)" }}>
            {[
              {
                ico: "🔍", bg: "#EFF6FF",
                lbl: "Find My Fibre",
                sub: "Evidence-driven · 7 questions",
                act: () => { setScreen("quiz"); setQuizStep(0); setCurAns(null); setAnswers({}); }
              },
              {
                ico: "🧪", bg: "#F0FDF4",
                lbl: "My Experience",
                sub: Object.keys(expData).length > 0
                  ? `${Object.keys(expData).length} fibre${Object.keys(expData).length !== 1 ? "s" : ""} rated ✓`
                  : "Rate fibres you've tried",
                subCol: Object.keys(expData).length > 0 ? C.green : undefined,
                act: startExpQuiz
              },
              {
                ico: "📓", bg: "#FFF7ED",
                lbl: "Fibre Journal",
                sub: fibreLogs.length > 0 ? `${fibreLogs.length} dose${fibreLogs.length !== 1 ? "s" : ""} logged` : "Log doses & effects",
                act: () => setScreen("tracker")
              },
              {
                ico: "📅", bg: "#FFFBEB",
                lbl: "Calendar",
                sub: "All data in one view",
                act: () => setScreen("calendar")
              },
            ].map(({ ico, bg, lbl, sub, subCol, act }, i, arr) => (
              <div key={lbl} onClick={act} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer", transition: "background .12s" }}
                onMouseEnter={e => e.currentTarget.style.background="#F6F9FC"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{ico}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{lbl}</div>
                  <div style={{ fontSize: 11, color: subCol || C.muted, marginTop: 1 }}>{sub}</div>
                </div>
                <div style={{ color: "#D1D5DB", fontSize: 18, fontWeight: 600, flexShrink: 0 }}>›</div>
              </div>
            ))}
          </div>

          {recs.length > 0 && (
            <div className="card" style={{ cursor: "pointer" }} onClick={() => setScreen("results")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div className="small" style={{ marginBottom: 2 }}>Last recommendation</div><div style={{ fontWeight: 600, fontSize: 14 }}>{recs[0].emoji} {recs[0].name}</div></div>
                <div style={{ color: C.accent, fontSize: 18 }}>›</div>
              </div>
            </div>
          )}

          {/* ── PROFILE WIDGET ── */}
          <div className="card" style={{ cursor: "pointer" }} onClick={() => setScreen("profile")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="profile-avatar">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "👤"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>
                      {profile.name || "Your Profile"}
                    </div>
                    <div className="small">
                      {profileComplete()
                        ? <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {bmi && <span style={{ padding: "1px 7px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: bmiCat?.bg, color: bmiCat?.colour }}>BMI {bmi} · {bmiCat?.label}</span>}
                            {bpCat && <span style={{ padding: "1px 7px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: bpCat.bg, color: bpCat.colour }}>BP · {bpCat.label}</span>}
                            {glucCat && <span style={{ padding: "1px 7px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: glucCat.bg, color: glucCat.colour }}>Glucose · {glucCat.label}</span>}
                          </span>
                        : <span style={{ color: C.muted }}>Add biometrics to personalise insights</span>
                      }
                    </div>
                  </div>
                  <div style={{ color: C.accent, fontSize: 16, marginLeft: 8 }}>→</div>
                </div>
              </div>
            </div>
            {profileInsightTags().length > 0 && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted }}>
                🔬 {profileInsightTags().length} biometric signals influencing your quiz results
              </div>
            )}
            {/* Quick-add measurement button */}
            <button
              onClick={e => { e.stopPropagation(); openMeasureModal(); }}
              style={{ marginTop: 10, width: "100%", padding: "9px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bg, cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'DM Sans',sans-serif", transition: "all .15s" }}>
              + Add Measurement
            </button>
          </div>
        </>}

        {/* ═══ WATER TRACKER ══════════════════════════════════════════════════ */}
        {screen === "water" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={() => setScreen("home")}>←</button>
            <h2 className="serif" style={{ fontSize: 22 }}>Water Intake</h2>
          </div>

          {/* Big glass + progress */}
          <div style={{ background: "linear-gradient(160deg,#1A5276,#2980B9)", borderRadius: 20, padding: "24px 20px", marginBottom: 14, textAlign: "center" }}>
            {/* Tall visual glass */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ position: "relative", width: 80, height: 140, border: "4px solid rgba(255,255,255,.7)", borderRadius: "8px 8px 14px 14px", overflow: "hidden", background: "rgba(255,255,255,.1)" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,.2))", height: `${Math.round(waterPct * 100)}%`, transition: "height .6s cubic-bezier(.4,0,.2,1)" }} />
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, transform: "translateY(-50%)", color: "white", fontWeight: 700, fontSize: 13, textAlign: "center", textShadow: "0 1px 3px rgba(0,0,0,.3)" }}>
                  {Math.round(waterPct * 100)}%
                </div>
              </div>
            </div>
            <div style={{ color: "white" }}>
              <div className="serif" style={{ fontSize: 32, marginBottom: 4 }}>
                {todayWaterMl >= 1000 ? `${(todayWaterMl/1000).toFixed(1)}L` : `${todayWaterMl}ml`}
              </div>
              <div style={{ fontSize: 13, opacity: .8, marginBottom: 12 }}>of {waterGoal}ml daily goal</div>
              <div style={{ height: 8, background: "rgba(255,255,255,.25)", borderRadius: 4 }}>
                <div style={{ height: "100%", width: `${Math.round(waterPct*100)}%`, background: "white", borderRadius: 4, transition: "width .5s" }} />
              </div>
              <div style={{ fontSize: 12, opacity: .85, marginTop: 8 }}>{wStatus.label}</div>
            </div>
          </div>

          {/* Quick-add buttons */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 500, marginBottom: 10 }}>Quick Add</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {WATER_AMOUNTS.map(ml => (
                <button key={ml} className={`quick-add-btn${flashBtn === ml ? " flash" : ""}`} onClick={() => addWater(ml)}>
                  +{ml < 1000 ? `${ml}ml` : `${ml/1000}L`}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input className="inp" type="number" min="1" max="2000" placeholder="Custom ml…" value={customMl} onChange={e => setCustomMl(e.target.value)} style={{ flex: 1 }} />
              <button className="btn btn-b" style={{ width: "auto", padding: "11px 18px", whiteSpace: "nowrap" }}
                onClick={() => { const v = parseInt(customMl); if (v > 0) { addWater(v); setCustomMl(""); } }}>
                Add
              </button>
            </div>
            {todayWaterMl > 0 && (
              <button onClick={removeLastWater} style={{ marginTop: 10, background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 12, padding: 0 }}>
                ↩ Undo last entry
              </button>
            )}
          </div>

          {/* Goal setting */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Daily Goal</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[1500,2000,2500,3000].map(g => (
                <button key={g} className={`tog${waterGoal === g ? " on" : ""}`} style={{ flex: 1, fontSize: 12 }} onClick={() => setWaterGoal(g)}>
                  {g/1000}L
                </button>
              ))}
            </div>
            <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 10, background: "#FFF8DC", border: "1px solid #F9E79F" }}>
              <p style={{ fontSize: 12, color: "#8B6914", lineHeight: 1.6 }}>
                💡 <strong>Psyllium husk</strong> and other gel-forming fibres require adequate water to work properly. Without it, they can cause or worsen constipation. Aim for at least 250ml with each dose.
              </p>
            </div>
          </div>

          {/* Today's log */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 8 }}>Today's entries</div>
            {waterLogs.filter(w => w.dateKey === todayKey).length === 0
              ? <div style={{ textAlign: "center", padding: "20px 0", color: C.muted, fontSize: 13 }}>No water logged today yet.</div>
              : waterLogs.filter(w => w.dateKey === todayKey).map(w => (
                <div className="water-log-item" key={w.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>💧</span>
                    <span style={{ fontWeight: 600, fontSize: 14, color: C.blue }}>{w.ml}ml</span>
                  </div>
                  <span className="small">{w.time}</span>
                </div>
              ))
            }
          </div>
        </>}

        {/* ═══ SYMPTOM TRACKER ════════════════════════════════════════════════ */}
        {screen === "symptoms" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={() => setScreen("home")}>←</button>
            <div>
              <h2 className="serif" style={{ fontSize: 20 }}>How are you feeling?</h2>
              <div className="small">Tap everything that applies right now</div>
            </div>
          </div>
          {symSaved && <div style={{ background: "#E9F7EF", border: "1px solid #A9DFBF", borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "center", color: "#1E8449", fontWeight: 500, fontSize: 14 }}>✅ Saved! Returning home…</div>}
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 500, marginBottom: 12 }}>Select symptoms</div>
            <div className="sym-grid">
              {SYMPTOMS.map(s => {
                const sel = symForm.symptoms.includes(s.id);
                return (
                  <button key={s.id} className={`sym-btn${sel ? " sel" : ""}`} style={sel ? { borderColor: s.colour, background: s.bg } : {}} onClick={() => togSym(s.id)}>
                    <span style={{ fontSize: 22 }}>{s.emoji}</span>
                    <span style={{ fontSize: 10, fontWeight: 500, color: sel ? s.colour : C.muted, lineHeight: 1.3, textAlign: "center" }}>{s.label}</span>
                    {sel && <span style={{ fontSize: 9, fontWeight: 700, color: s.colour }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
          {symForm.symptoms.length > 0 && (
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 500, marginBottom: 12 }}>Rate severity</div>
              {symForm.symptoms.map(id => {
                const sym = SYMPTOMS.find(s => s.id === id);
                const curSev = symForm.severity[id];
                return (
                  <div key={id} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{sym.emoji} {sym.label}</div>
                    <div className="sev-row">
                      {SEVERITY.map(sv => (
                        <button key={sv.v} className="sev-btn"
                          style={curSev === sv.v ? { borderColor: sv.colour, background: sv.colour, color: "white" } : { color: sv.colour, borderColor: sv.colour + "55" }}
                          onClick={() => setSev(id, sv.v)}>{sv.label}</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 500, marginBottom: 6 }}>Time of symptoms</div>
              <input className="inp" type="time" value={symForm.time} onChange={e => setSymForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <div>
              <div style={{ fontWeight: 500, marginBottom: 6 }}>Notes</div>
              <textarea className="inp" rows={2} placeholder="Any context — what you ate, what you did…" style={{ resize: "none" }} value={symForm.notes} onChange={e => setSymForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <button className="btn btn-p" onClick={saveSymLog} disabled={symForm.symptoms.length === 0} style={{ opacity: symForm.symptoms.length === 0 ? .4 : 1 }}>Save Symptoms</button>
        </>}

        {/* ═══ POOP TRACKER ═══════════════════════════════════════════════════ */}
        {screen === "poop" && <>
          {pStep === "timer" && <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 22, lineHeight: 1 }} onClick={() => { setActive(false); setScreen("home"); }}>←</button>
              <h2 className="serif" style={{ fontSize: 20 }}>Toilet Session</h2>
              {active && <span style={{ marginLeft: "auto", background: "#DCFAEE", color: "#15774F", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>● Live</span>}
            </div>

            {/* Timer hero card */}
            <div style={{ background: "linear-gradient(145deg,#1C3249,#2B5278)", borderRadius: 24, padding: "24px 20px 20px", marginBottom: 12, textAlign: "center", boxShadow: "0 6px 24px rgba(28,50,73,.35)" }}>
              <div style={{ fontSize: 48, marginBottom: 4 }}>💩</div>
              <div className={`timer-num${active ? " pulse" : ""}`} style={{ color: "white" }}>
                {String(Math.floor(elapsed/60)).padStart(2,"0")}:{String(elapsed%60).padStart(2,"0")}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 18 }}>
                {active ? "Timer running…" : elapsed > 0 ? "Paused" : "Ready when you are"}
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {!active && elapsed === 0 && <button className="btn btn-g" style={{ maxWidth: 200 }} onClick={() => setActive(true)}>▶ Start Timer</button>}
                {active && <>
                  <button style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,.3)", background: "rgba(255,255,255,.12)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }} onClick={() => setActive(false)}>⏸ Pause</button>
                  <button style={{ flex: 1, padding: "11px", borderRadius: 12, background: "#3B82C4", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "'Plus Jakarta Sans',sans-serif" }} onClick={stopTimer}>Done →</button>
                </>}
                {!active && elapsed > 0 && <>
                  <button style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,.3)", background: "rgba(255,255,255,.12)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }} onClick={() => setActive(true)}>▶ Resume</button>
                  <button style={{ flex: 1, padding: "11px", borderRadius: 12, background: "#3B82C4", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "'Plus Jakarta Sans',sans-serif" }} onClick={stopTimer}>Done →</button>
                </>}
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: "rgba(255,255,255,.45)" }}>💡 Healthy range: 1–10 min · over 15 min may indicate constipation</div>
            </div>

            {/* Reading carousel */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>📖 Reading while you wait</div>
              <div className="reading-carousel" onScroll={e => {
                const idx = Math.round(e.target.scrollLeft / 282);
                setCarouselIdx(idx);
              }}>
                {TOILET_CARDS.map((card, ci) => (
                  <div key={card.id} className="reading-card" style={{ background: card.bg, color: "#111827" }}>
                    <div className="reading-card-cat" style={{ color: card.colour }}>{card.category}</div>
                    <div className="reading-card-title" style={{ color: card.colour }}>{card.title}</div>
                    <div className="reading-card-body">{card.body}</div>
                    <div className="reading-card-tags">
                      {card.tags.map(t => (
                        <span key={t} className="reading-card-tag" style={{ background: card.colour + "22", color: card.colour }}>{t}</span>
                      ))}
                    </div>
                    {card.glossaryLinks && card.glossaryLinks.length > 0 && (
                      <div style={{ marginTop: 8, fontSize: 11, color: card.colour, opacity: .8 }}>
                        Tap to learn: {card.glossaryLinks.map((gk, gi) => {
                          const ge = GLOSSARY[gk];
                          return ge ? <span key={gk}><GlossaryTerm termKey={gk}>{ge.term}</GlossaryTerm>{gi < card.glossaryLinks.length - 1 ? " · " : ""}</span> : null;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="carousel-dots">
                {TOILET_CARDS.map((_, i) => (
                  <div key={i} className={`carousel-dot${carouselIdx === i ? " active" : ""}`} />
                ))}
              </div>
            </div>
          </>}
          {pStep === "details" && <>
            <div style={{ marginBottom: 14 }}><h2 className="serif" style={{ fontSize: 20 }}>Log the details</h2><div className="small">Session time: {fmtDur(elapsed)}</div></div>
            <div className="card">
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Bristol Stool Type</div>
              <div className="small" style={{ marginBottom: 14 }}>Optional — what did it look like?</div>
              <div className="bsc-grid">
                {BRISTOL_TYPES.map(b => (
                  <button key={b.type} className={`bsc-card${pForm.bristolType === b.type ? " sel" : ""}`} onClick={() => setPForm({ ...pForm, bristolType: b.type })}>
                    {/* SVG graphic */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 6, height: 40 }}>
                      {b.type === 1 && (
                        <svg viewBox="0 0 60 40" width="60" height="40">
                          {[8,22,36,50].map((x,i) => <circle key={i} cx={x} cy={i%2===0?14:26} r="7" fill="#7B4A2B" />)}
                        </svg>
                      )}
                      {b.type === 2 && (
                        <svg viewBox="0 0 60 40" width="60" height="40">
                          <ellipse cx="30" cy="20" rx="26" ry="13" fill="#7B4A2B"/>
                          <ellipse cx="30" cy="20" rx="26" ry="13" fill="none" stroke="#5C3118" strokeWidth="1.5" strokeDasharray="3 2"/>
                        </svg>
                      )}
                      {b.type === 3 && (
                        <svg viewBox="0 0 60 40" width="60" height="40">
                          <ellipse cx="30" cy="20" rx="26" ry="11" fill="#8B5E3C"/>
                          <line x1="10" y1="20" x2="50" y2="20" stroke="#6B4A2A" strokeWidth="1.5" strokeDasharray="4 3"/>
                        </svg>
                      )}
                      {b.type === 4 && (
                        <svg viewBox="0 0 60 40" width="60" height="40">
                          <ellipse cx="30" cy="20" rx="26" ry="11" fill="#8B5E3C"/>
                          <ellipse cx="30" cy="20" rx="22" ry="7" fill="#A0724F" opacity=".5"/>
                        </svg>
                      )}
                      {b.type === 5 && (
                        <svg viewBox="0 0 70 40" width="70" height="40">
                          {[9,22,35,48,61].map((x,i) => <ellipse key={i} cx={x} cy={i%2===0?18:22} rx="8" ry="6" fill="#C4A050"/>)}
                        </svg>
                      )}
                      {b.type === 6 && (
                        <svg viewBox="0 0 60 40" width="60" height="40">
                          <ellipse cx="30" cy="22" rx="26" ry="13" fill="#D4A050" opacity=".7"/>
                          <ellipse cx="22" cy="17" rx="10" ry="6" fill="#D4A050" opacity=".6"/>
                          <ellipse cx="40" cy="15" rx="8" ry="5" fill="#D4A050" opacity=".5"/>
                        </svg>
                      )}
                      {b.type === 7 && (
                        <svg viewBox="0 0 60 40" width="60" height="40">
                          <path d="M4,20 Q15,8 30,20 Q45,32 56,20" stroke="#A0B4CC" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                          <path d="M4,26 Q15,14 30,26 Q45,38 56,26" stroke="#A0B4CC" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".5"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>Type {b.type}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 5 }}>{b.desc}</div>
                    <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: b.healthBg, color: b.healthColour }}>{b.health}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 500, marginBottom: 2 }}>Colour</div>
              <div className="small" style={{ marginBottom: 10 }}>Optional — tap a swatch</div>
              <div className="swatch-row">
                {STOOL_COLOURS.map(c => (
                  <div key={c.value} style={{ textAlign: "center" }}>
                    <div className={`swatch${pForm.colour === c.value ? " sel" : ""}`} style={{ background: c.hex }} onClick={() => setPForm({ ...pForm, colour: pForm.colour === c.value ? null : c.value, ironDismissed: false })} />
                    <div style={{ fontSize: 9, color: C.muted, marginTop: 3, maxWidth: 36, lineHeight: 1.2 }}>{c.label}</div>
                  </div>
                ))}
              </div>
              {pForm.colour && <div style={{ marginTop: 8, fontSize: 12, color: C.muted, fontStyle: "italic" }}>{STOOL_COLOURS.find(c => c.value === pForm.colour)?.note}</div>}
              <BlackStoolWarning
                show={pForm.colour === "black" && !pForm.ironDismissed}
                onIron={() => setPForm(f => ({ ...f, ironDismissed: true }))}
              />
            </div>
            <div className="card">
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>Any straining?</div>
                <div style={{ display: "flex", gap: 8 }}>{["None","A little","A lot"].map(v => <button key={v} className={`tog${pForm.straining===v?" on":""}`} style={{ flex: 1, fontSize: 12 }} onClick={() => setPForm({ ...pForm, straining: v })}>{v}</button>)}</div>
              </div>
              <div>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>Felt complete afterwards?</div>
                <div style={{ display: "flex", gap: 8 }}>{["Yes","Not really","No"].map(v => <button key={v} className={`tog${pForm.complete===v?" on":""}`} style={{ flex: 1, fontSize: 12 }} onClick={() => setPForm({ ...pForm, complete: v })}>{v}</button>)}</div>
              </div>
            </div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>Notes</div>
              <textarea className="inp" rows={2} placeholder="Anything else to note…" style={{ resize: "none" }} value={pForm.notes} onChange={e => setPForm({ ...pForm, notes: e.target.value })} />
            </div>
            <button className="btn btn-p" style={{ marginBottom: 8 }} onClick={savePoopLog}>Save Entry</button>
            <button className="btn" style={{ background: "none", color: C.muted, border: `1.5px solid ${C.border}` }} onClick={() => { setPoopLogs([{ id: Date.now(), date: sessStart, duration: elapsed }, ...poopLogs]); finishSession(); }}>Skip details &amp; save</button>
          </>}
          {pStep === "done" && (
            <div style={{ textAlign: "center", padding: "52px 20px" }}>
              <div style={{ fontSize: 64, marginBottom: 14 }}>✅</div>
              <h2 className="serif" style={{ fontSize: 26, marginBottom: 6 }}>Logged!</h2>
              <div className="small" style={{ marginBottom: 8, fontSize: 14 }}>Duration: {fmtDur(elapsed)}</div>
              {pForm.bristolType && (() => { const b = BRISTOL_TYPES.find(bt => bt.type === pForm.bristolType); return <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: b.healthBg, color: b.healthColour, marginBottom: 28 }}>Type {b.type} — {b.health}</div>; })()}
              {!pForm.bristolType && <div style={{ marginBottom: 28 }} />}
              <button className="btn btn-p" style={{ maxWidth: 240, margin: "0 auto 10px" }} onClick={finishSession}>Back to Home</button>
            </div>
          )}
        </>}

        {/* ═══ CALENDAR ═══════════════════════════════════════════════════════ */}
        {screen === "calendar" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={() => setScreen("home")}>←</button>
            <h2 className="serif" style={{ fontSize: 22 }}>Unified Calendar</h2>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            {[["#C8794A","💩 Toilet"],["#6B8F71","🌿 Fibre"],["#6C3483","🫧 Symptoms"],["#2471A3","💧 Water"]].map(([col,lbl]) => (
              <span key={lbl} style={{ fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: col, display: "inline-block" }} />{lbl}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.muted }} onClick={() => { if (calMonth===0){setCalYear(y=>y-1);setCalMonth(11);}else setCalMonth(m=>m-1); }}>‹</button>
            <span className="serif" style={{ fontSize: 18 }}>{monthNames[calMonth]} {calYear}</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.muted }} onClick={() => { if (calMonth===11){setCalYear(y=>y+1);setCalMonth(0);}else setCalMonth(m=>m+1); }}>›</button>
          </div>
          <div className="cal-grid">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="cal-header">{d}</div>)}
          </div>
          <div className="cal-grid" style={{ marginBottom: 16 }}>
            {Array.from({ length: firstDay }).map((_,i) => <div key={`e${i}`} className="cal-day empty" />)}
            {Array.from({ length: daysInMonth }).map((_,i) => {
              const day = i+1;
              const key = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const dots = calData[key] || [];
              const isToday = key === todayKey;
              const isSel = selectedDay === key;
              const daySymLogs = symLogs.filter(l => l.dateKey === key);
              const dayWaterMl = waterLogs.filter(w => w.dateKey === key).reduce((a,w)=>a+w.ml,0);
              const dayWPct = Math.min(dayWaterMl / waterGoal, 1);
              const hasPoop = poopLogs.some(l => toKey(l.date) === key);
              const hasFibre = fibreLogs.some(l => (l.date||toKey(l.dateObj||new Date())) === key);
              return (
                <div key={key} className={`cal-day${isToday?" today":""}${isSel?" selected":""}`} onClick={() => setSelectedDay(isSel ? null : key)} style={{ position:"relative", padding:"3px 3px 5px" }}>
                  <div className="cal-day-num" style={{ color: isToday ? C.accent : C.text }}>{day}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:1, minHeight:14 }}>
                    {hasPoop && <span style={{ fontSize:9, lineHeight:1 }}>💩</span>}
                    {hasFibre && <span style={{ fontSize:9, lineHeight:1 }}>🌿</span>}
                    {daySymLogs.slice(0,3).map(sl => {
                      const firstSym = sl.symptoms?.[0];
                      const symDef = firstSym ? SYMPTOMS.find(s => s.id === firstSym) : null;
                      return <span key={sl.id} title={symDef?.label} style={{ fontSize:9, lineHeight:1 }}>{symDef?.emoji || "🫧"}</span>;
                    })}
                  </div>
                  {dayWaterMl > 0 && (
                    <div style={{ position:"absolute", bottom:2, left:3, right:3, height:3, borderRadius:2, background:"#DBEAFE" }}>
                      <div style={{ height:"100%", width:`${Math.round(dayWPct*100)}%`, borderRadius:2, background: dayWPct>=1?"#22A06B":"#3B82C4", transition:"width .3s" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {selectedDay && (() => {
            const dd = getDayData(selectedDay);
            const hasData = dd.poop.length>0||dd.fibre.length>0||dd.symptoms.length>0||dd.water.length>0;
            const [y,m,d] = selectedDay.split("-");
            const label = new Date(+y,+m-1,+d).toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"});
            const dayWStatus = waterStatus(dd.waterMl, waterGoal);
            return (
              <div className="day-detail">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div className="serif" style={{ fontSize: 16 }}>{label}</div>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 18 }} onClick={() => setSelectedDay(null)}>✕</button>
                </div>
                {!hasData && <div style={{ fontSize: 13, color: C.muted, textAlign: "center", padding: "12px 0" }}>No data logged for this day.</div>}

                {dd.water.length > 0 && <>
                  <div className="day-section-title">💧 Water</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ flex: 1, height: 8, background: C.bLight, borderRadius: 4 }}>
                      <div style={{ height: "100%", width: `${Math.min(dd.waterMl/waterGoal,1)*100}%`, background: C.blue, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.blue, whiteSpace: "nowrap" }}>{dd.waterMl >= 1000 ? `${(dd.waterMl/1000).toFixed(1)}L` : `${dd.waterMl}ml`}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: dayWStatus.bg, color: dayWStatus.colour }}>{dayWStatus.label}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {dd.water.map(w => <span key={w.id} style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, background: C.bLight, color: C.blue }}>{w.ml}ml · {w.time}</span>)}
                  </div>
                </>}

                {dd.symptoms.length > 0 && <>
                  <div className="day-section-title">🫧 Symptoms</div>
                  {dd.symptoms.map(log => (
                    <div key={log.id} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 4 }}>
                        {log.symptoms.map(sid => {
                          const s = SYMPTOMS.find(x => x.id === sid);
                          const sev = log.severity?.[sid];
                          const sevInfo = sev ? SEVERITY.find(sv => sv.v === sev) : null;
                          return s ? <span key={sid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.colour }}>{s.emoji} {s.label}{sevInfo ? ` · ${sevInfo.label}` : ""}</span> : null;
                        })}
                      </div>
                      {log.time && <div className="small">{log.time}</div>}
                      {log.notes && <div className="small" style={{ fontStyle: "italic", marginTop: 2 }}>"{log.notes}"</div>}
                    </div>
                  ))}
                </>}

                {dd.poop.length > 0 && <>
                  <div className="day-section-title">💩 Toilet Sessions</div>
                  {dd.poop.map(log => {
                    const b = log.bristolType ? BRISTOL_TYPES.find(bt => bt.type === log.bristolType) : null;
                    return (
                      <div key={log.id} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
                        <span className="small">{fmtTime(log.date)}</span>
                        <span style={{ fontWeight: 500, fontSize: 13 }}>{fmtDur(log.duration)}</span>
                        {b && <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: b.healthBg, color: b.healthColour }}>Type {b.type}</span>}
                        {log.straining && log.straining !== "None" && <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, background: "#FFF3CD", color: "#856404" }}>Strain: {log.straining}</span>}
                      </div>
                    );
                  })}
                </>}

                {dd.fibre.length > 0 && <>
                  <div className="day-section-title">🌿 Fibre Doses</div>
                  {dd.fibre.map(log => (
                    <div key={log.id} style={{ marginBottom: 6 }}>
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{log.fibre}</span>
                      <span style={{ fontSize: 13, color: C.aDark, marginLeft: 8 }}>{log.dose} {log.unit}</span>
                      {log.symptoms.length > 0 && <div style={{ marginTop: 3 }}>{log.symptoms.map(s => <span key={s} className="chip" style={{ fontSize: 10 }}>{s}</span>)}</div>}
                    </div>
                  ))}
                </>}
              </div>
            );
          })()}
        </>}

        {/* ═══ EXPERIMENT ════════════════════════════════════════════════════ */}
        {screen === "experiment" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 22 }} onClick={() => setScreen("home")}>←</button>
            <h2 className="serif" style={{ fontSize: 20 }}>Run Experiment</h2>
          </div>

          {/* LIST of past experiments */}
          {expScreen === "list" && <>
            {experiments.length > 0 && <>
              <div style={{ fontWeight: 600, fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Past Experiments</div>
              {experiments.map(e => {
                const compliance = expComplianceRate(e);
                const statusColour = e.status === "complete" ? C.green : "#F59E0B";
                return (
                  <div key={e.id} className="card" style={{ marginBottom: 8, padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 24 }}>{e.fibreEmoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{e.fibreName}</div>
                        <div className="small">{e.days}-day trial · Started {e.startDate}</div>
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: e.status==="complete"?"#DCFAEE":"#FEF3C7", color: statusColour }}>
                        {e.status === "complete" ? `${compliance}% compliance` : "Running"}
                      </span>
                    </div>
                    {e.status === "running" && e.id === activeExp && (
                      <button className="btn btn-p" style={{ marginTop: 10 }} onClick={() => setExpScreen("running")}>Continue →</button>
                    )}
                    {e.status === "complete" && (
                      <button className="btn btn-s" style={{ marginTop: 10 }} onClick={() => { setActiveExp(e.id); setExpScreen("report"); }}>View Report</button>
                    )}
                  </div>
                );
              })}
            </>}
            <button className="btn btn-g" onClick={() => setExpScreen("setup")}>+ New Experiment</button>
          </>}

          {/* SETUP */}
          {expScreen === "setup" && <>
            <div style={{ marginBottom: 14, padding: "12px 14px", background: C.aLight, borderRadius: 14, fontSize: 13, color: C.aDark, lineHeight: 1.6 }}>
              🧫 An experiment tracks your response to a single fibre over a set period. You'll get daily check-ins and a report at the end.
            </div>
            <div className="card">
              <div className="exp-setup-row">
                <div style={{ fontWeight: 600 }}>Fibre</div>
                <select className="inp" style={{ width: "auto", padding: "6px 10px" }} value={expSetup.fibreId} onChange={e => setExpSetup(p => ({ ...p, fibreId: e.target.value }))}>
                  {ALL_FIBRES_EXP.filter(f => f.kit).map(f => <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>)}
                </select>
              </div>
              <div className="exp-setup-row">
                <div style={{ fontWeight: 600 }}>Daily dose</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input className="inp" style={{ width: 70, textAlign: "right" }} type="number" min="1" max="50" step="0.5" placeholder="e.g. 5" value={expSetup.dose} onChange={e => setExpSetup(p => ({ ...p, dose: e.target.value }))} />
                  <select className="inp" style={{ width: "auto", padding: "6px 10px" }} value={expSetup.unit} onChange={e => setExpSetup(p => ({ ...p, unit: e.target.value }))}>
                    <option>g</option><option>tsp</option><option>tbsp</option>
                  </select>
                </div>
              </div>
              <div className="exp-setup-row">
                <div style={{ fontWeight: 600 }}>Take with</div>
                <div style={{ fontSize: 14, color: "#2563A0", fontWeight: 600 }}>250–500ml water minimum</div>
              </div>
              <div className="exp-setup-row">
                <div style={{ fontWeight: 600 }}>Time of day</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["morning","midday","evening"].map(t => (
                    <button key={t} className={`tog${expSetup.time===t?" on":""}`} style={{ textTransform: "capitalize" }} onClick={() => setExpSetup(p => ({ ...p, time: t }))}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="exp-setup-row">
                <div style={{ fontWeight: 600 }}>Water goal</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1500,2000,2500,3000].map(ml => (
                    <button key={ml} className={`tog${expSetup.water===ml?" on":""}`} style={{ fontSize: 12 }} onClick={() => setExpSetup(p => ({ ...p, water: ml }))}>{ml/1000}L</button>
                  ))}
                </div>
              </div>
              <div className="exp-setup-row">
                <div style={{ fontWeight: 600 }}>Duration</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[5,10,14,30].map(d => (
                    <button key={d} className={`tog${expSetup.days===d?" on":""}`} style={{ fontSize: 12 }} onClick={() => setExpSetup(p => ({ ...p, days: d }))}>{d}d</button>
                  ))}
                </div>
              </div>
            </div>
            <button className="btn btn-p" disabled={!expSetup.dose} style={{ opacity: expSetup.dose ? 1 : .4 }} onClick={startExperiment}>Start Experiment →</button>
            <button className="btn" style={{ marginTop: 8, background: "none", color: C.muted, border: `1.5px solid ${C.border}` }} onClick={() => setExpScreen("list")}>Cancel</button>
          </>}

          {/* RUNNING */}
          {expScreen === "running" && (() => {
            const exp = getActiveExp();
            if (!exp) return <div>No active experiment.</div>;
            const dayN = expDayNumber();
            const todayLogged = exp.doseLogs.find(d => d.date === today());
            const daysLeft = exp.days - dayN + 1;
            const pct = Math.min(dayN / exp.days, 1);
            const compliance = expComplianceRate(exp);
            return <>
              <div style={{ background: "linear-gradient(145deg,#1C3249,#2B5278)", borderRadius: 20, padding: "20px", marginBottom: 14, color: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 36 }}>{exp.fibreEmoji}</span>
                  <div>
                    <div className="serif" style={{ fontSize: 18 }}>{exp.fibreName}</div>
                    <div style={{ fontSize: 12, opacity: .7 }}>{exp.dose}{exp.unit} {exp.time} · {exp.waterGoalMl/1000}L water/day</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>Day {dayN}</div>
                    <div style={{ fontSize: 11, opacity: .7 }}>of {exp.days}</div>
                  </div>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,.2)", borderRadius: 4, marginBottom: 8 }}>
                  <div style={{ height: "100%", width: `${Math.round(pct*100)}%`, background: "#22A06B", borderRadius: 4, transition: "width .4s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: .7 }}>
                  <span>{Math.round(pct*100)}% complete</span>
                  <span>{daysLeft} day{daysLeft!==1?"s":""} remaining</span>
                </div>
              </div>

              {/* Today's dose check-in */}
              <div className="card">
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Today's dose</div>
                <div className="small" style={{ marginBottom: 14 }}>
                  {exp.dose}{exp.unit} of {exp.fibreName} — take {exp.time} with {exp.waterGoalMl >= 2000 ? `${exp.waterGoalMl/1000}L` : `${exp.waterGoalMl}ml`} water
                </div>
                {todayLogged ? (
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: todayLogged.taken ? "#DCFAEE" : "#FEE2E2", textAlign: "center", fontWeight: 700, color: todayLogged.taken ? "#15774F" : "#DC2626" }}>
                    {todayLogged.taken ? "✅ Dose taken today" : "❌ Dose skipped today"}
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="dose-check-btn" style={{ borderColor: "#22A06B", background: "#DCFAEE", color: "#15774F" }} onClick={() => logExpDose(true)}>✅ Yes, I took it</button>
                    <button className="dose-check-btn" style={{ borderColor: "#DC2626", background: "#FEE2E2", color: "#DC2626" }} onClick={() => logExpDose(false)}>❌ No, I skipped</button>
                  </div>
                )}
              </div>

              {/* Compliance meter */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontWeight: 600 }}>Compliance</div>
                  <div style={{ fontWeight: 700, color: compliance >= 80 ? C.green : compliance >= 50 ? "#F59E0B" : "#DC2626" }}>{compliance}%</div>
                </div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {Array.from({ length: exp.days }, (_, i) => {
                    const d = new Date(exp.startDate);
                    d.setDate(d.getDate() + i);
                    const dk = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
                    const logged = exp.doseLogs.find(l => l.date === dk);
                    return (
                      <div key={i} title={`Day ${i+1}`} style={{ width: 20, height: 20, borderRadius: 4, background: !logged ? "#E5EAF0" : logged.taken ? "#22A06B" : "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "white", fontWeight: 700 }}>
                        {i+1}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 11, color: C.muted }}>
                  <span><span style={{ display:"inline-block",width:10,height:10,borderRadius:2,background:"#22A06B",marginRight:4 }} />Taken</span>
                  <span><span style={{ display:"inline-block",width:10,height:10,borderRadius:2,background:"#DC2626",marginRight:4 }} />Skipped</span>
                  <span><span style={{ display:"inline-block",width:10,height:10,borderRadius:2,background:"#E5EAF0",marginRight:4 }} />Future</span>
                </div>
              </div>

              {/* Quick links */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                {[["💩","Log toilet",()=>startSession()],["💧","Log water",()=>setScreen("water")],["🫧","Log symptoms",()=>{setSymForm({symptoms:[],severity:{},notes:"",time:fmtTimeNow()});setScreen("symptoms");}]].map(([ico,lbl,act])=>(
                  <button key={lbl} onClick={act} style={{ padding:"10px 4px", borderRadius:12, border:`1.5px solid ${C.border}`, background:"#FFFFFF", cursor:"pointer", textAlign:"center", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    <div style={{ fontSize:22 }}>{ico}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:3, fontWeight:500 }}>{lbl}</div>
                  </button>
                ))}
              </div>

              {dayN >= exp.days && (
                <button className="btn btn-g" onClick={finishExperiment}>Complete Experiment & View Report →</button>
              )}
              {dayN < exp.days && (
                <button className="btn" style={{ background:"none", color:"#DC2626", border:"1.5px solid #FCA5A5", marginTop:6 }} onClick={() => { if(window.confirm("End this experiment early?")) finishExperiment(); }}>End early</button>
              )}
            </>;
          })()}

          {/* REPORT */}
          {expScreen === "report" && (() => {
            const exp = experiments.find(e => e.id === activeExp) || experiments.find(e => e.status === "complete");
            if (!exp) return null;
            const compliance = expComplianceRate(exp);
            const expPoopLogs = poopLogs.filter(l => {
              const d = toKey(l.date);
              return d >= exp.startDate;
            });
            const expSymLogs = symLogs.filter(l => l.dateKey >= exp.startDate);
            return <>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 52 }}>{exp.fibreEmoji}</div>
                <div className="serif" style={{ fontSize: 22 }}>{exp.fibreName} Experiment</div>
                <div className="small">{exp.days}-day trial · {compliance}% compliance</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[
                  ["Doses taken", `${exp.doseLogs.filter(d=>d.taken).length}/${exp.doseLogs.length}`, compliance >= 80 ? C.green : "#F59E0B"],
                  ["Compliance", `${compliance}%`, compliance >= 80 ? C.green : "#F59E0B"],
                  ["Toilet logs", expPoopLogs.length, C.muted],
                  ["Symptom logs", expSymLogs.length, C.muted],
                ].map(([lbl,val,col])=>(
                  <div key={lbl} className="stat-card">
                    <div style={{ fontSize: 24, fontWeight: 700, color: col }}>{val}</div>
                    <div className="small">{lbl}</div>
                  </div>
                ))}
              </div>
              {expPoopLogs.length > 0 && (
                <div className="card">
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Digestive changes</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {expPoopLogs.map((l,i) => {
                      const b = l.bristolType ? BRISTOL_TYPES.find(bt => bt.type === l.bristolType) : null;
                      return b ? <span key={i} style={{ padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, background:b.healthBg, color:b.healthColour }}>Type {b.type}</span> : null;
                    })}
                  </div>
                </div>
              )}
              <button className="btn btn-p" onClick={generateFibreReport} style={{ marginBottom: 8 }}>📋 Download Full Report</button>
              <button className="btn" style={{ background:"none", color:C.muted, border:`1.5px solid ${C.border}` }} onClick={() => { setExpScreen("list"); setActiveExp(null); }}>Back to experiments</button>
            </>;
          })()}
        </>}

        {/* ═══ EXPERIENCE QUIZ ════════════════════════════════════════════════ */}
        {screen === "exp_quiz" && <>

          {/* ── STEP 1: Select fibres ── */}
          {expStep === "select" && <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={() => setScreen("home")}>←</button>
              <div>
                <h2 className="serif" style={{ fontSize: 20 }}>Your Fibre Experience</h2>
                <div className="small">Select every fibre you've tried — even briefly</div>
              </div>
            </div>

            <div style={{ background: C.aLight, borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <p style={{ fontSize: 12, color: C.aDark, lineHeight: 1.6 }}>Your responses will personalise your fibre recommendations. Only fibres in the kit will affect the quiz — others help us understand your broader tolerance profile.</p>
            </div>

            {/* Kit fibres section */}
            <div style={{ fontWeight: 600, fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🧪 Your Kit</div>
            {ALL_FIBRES_EXP.filter(f => f.kit).map(f => (
              <button key={f.id} className={`fibre-pick${expSelected.includes(f.id) ? " sel" : ""}`} onClick={() => toggleExpFibre(f.id)}>
                <span style={{ fontSize: 22 }}>{f.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{f.name}</span>
                    <span className="kit-badge">Kit</span>
                  </div>
                  <div className="small">{f.desc}</div>
                </div>
                {expSelected.includes(f.id) && <span style={{ color: C.accent, fontSize: 18 }}>✓</span>}
              </button>
            ))}

            {/* Other fibres section */}
            <div style={{ fontWeight: 600, fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: 1, margin: "14px 0 8px" }}>🌐 Other Fibres You've Tried</div>
            {ALL_FIBRES_EXP.filter(f => !f.kit).map(f => (
              <button key={f.id} className={`fibre-pick${expSelected.includes(f.id) ? " sel" : ""}`} onClick={() => toggleExpFibre(f.id)}>
                <span style={{ fontSize: 20 }}>{f.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{f.name}</div>
                  <div className="small">{f.desc}</div>
                </div>
                {expSelected.includes(f.id) && <span style={{ color: C.accent, fontSize: 16 }}>✓</span>}
              </button>
            ))}

            <div style={{ height: 16 }} />
            <button className="btn btn-p" onClick={beginRating}
              disabled={expSelected.length === 0}
              style={{ opacity: expSelected.length === 0 ? .4 : 1 }}>
              Rate {expSelected.length > 0 ? `${expSelected.length} Fibre${expSelected.length !== 1 ? "s" : ""}` : "Selected Fibres"} →
            </button>
            <button className="btn" style={{ marginTop: 8, background: "none", color: C.muted, border: `1.5px solid ${C.border}` }} onClick={() => setScreen("home")}>Skip for now</button>
          </>}

          {/* ── STEPS 2–4: Per-fibre rating ── */}
          {expFibre && (expStep === "rate" || expStep === "effects_pos" || expStep === "effects_neg") && <>

            {/* Progress bar */}
            <div className="exp-bar">
              <div className="exp-fill" style={{ width: `${Math.round(((expIdx + (expStep === "effects_neg" ? 0.8 : expStep === "effects_pos" ? 0.5 : 0.2)) / expSelected.length) * 100)}%` }} />
            </div>

            {/* Fibre header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "14px", borderRadius: 14, background: C.aLight }}>
              <span style={{ fontSize: 36 }}>{expFibre.emoji}</span>
              <div>
                <div className="serif" style={{ fontSize: 18 }}>{expFibre.name}</div>
                <div className="small">{expFibre.desc}</div>
                {expFibre.kit && <span className="kit-badge" style={{ marginTop: 4, display: "inline-block" }}>Kit fibre</span>}
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div className="small">{expIdx + 1} of {expSelected.length}</div>
              </div>
            </div>

            {/* RATE step — sliding scale */}
            {expStep === "rate" && <>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Overall, how did you respond?</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>Think about how this fibre made you feel over the first few weeks of use.</div>
              {EXP_SCALE.map(s => {
                const isActive = expCurrent.overall === s.value;
                return (
                  <button key={s.value} className={`scale-btn${isActive ? " active" : ""}`}
                    style={{ borderColor: s.colour, background: isActive ? s.colour : "#FFFCF7", color: isActive ? "white" : s.colour }}
                    onClick={() => setOverall(s.value)}>
                    <span>{s.label}</span>
                    {isActive && <span style={{ fontSize: 18 }}>✓</span>}
                  </button>
                );
              })}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="btn btn-p" disabled={expCurrent.overall === undefined} style={{ flex: 2, opacity: expCurrent.overall === undefined ? .4 : 1 }} onClick={advanceExpStep}>
                  Next: Positive effects →
                </button>
                <button className="btn" style={{ flex: 1, background: "none", color: C.muted, border: `1.5px solid ${C.border}` }} onClick={skipCurrentFibre}>Skip</button>
              </div>
            </>}

            {/* EFFECTS_POS step */}
            {expStep === "effects_pos" && <>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>✅ Positive effects noticed</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Select any benefits you experienced. Leave blank if none.</div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {EXP_POSITIVE.map(e => {
                  const isOn = expCurrent.positives?.includes(e.id);
                  return (
                    <button key={e.id} className={`eff-btn${isOn ? " on-pos" : ""}`} onClick={() => togglePos(e.id)}>
                      <span>{e.emoji}</span><span>{e.label}</span>
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="btn btn-p" style={{ flex: 2 }} onClick={advanceExpStep}>Next: Side effects →</button>
                <button className="btn" style={{ flex: 1, background: "none", color: C.muted, border: `1.5px solid ${C.border}` }} onClick={advanceExpStep}>None / Skip</button>
              </div>
            </>}

            {/* EFFECTS_NEG step */}
            {expStep === "effects_neg" && <>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>⚠️ Negative side effects</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Select any side effects you experienced. Leave blank if none.</div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {EXP_NEGATIVE.map(e => {
                  const isOn = expCurrent.negatives?.includes(e.id);
                  return (
                    <button key={e.id} className={`eff-btn${isOn ? " on-neg" : ""}`} onClick={() => toggleNeg(e.id)}>
                      <span>{e.emoji}</span><span>{e.label}</span>
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="btn btn-p" style={{ flex: 2 }} onClick={advanceExpStep}>
                  {expIdx < expSelected.length - 1 ? `Next: ${ALL_FIBRES_EXP.find(f => f.id === expSelected[expIdx + 1])?.name || "Next fibre"} →` : "Finish →"}
                </button>
                <button className="btn" style={{ flex: 1, background: "none", color: C.muted, border: `1.5px solid ${C.border}` }} onClick={advanceExpStep}>None / Skip</button>
              </div>
            </>}
          </>}

          {/* ── DONE ── */}
          {expStep === "done" && <>
            <div style={{ textAlign: "center", padding: "32px 0 20px" }}>
              <div style={{ fontSize: 60, marginBottom: 12 }}>🎉</div>
              <h2 className="serif" style={{ fontSize: 24, marginBottom: 6 }}>Experience saved!</h2>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                Your responses are now influencing your fibre recommendations. Run the quiz again to see your updated results.
              </p>
            </div>

            {/* Summary of what was entered */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Your fibre ratings</div>
              {expSelected.map(id => {
                const f = ALL_FIBRES_EXP.find(x => x.id === id);
                const d = expData[id] || {};
                const scale = EXP_SCALE.find(s => s.value === d.overall);
                return (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${scale ? scale.colour + "44" : C.border}`, background: scale ? scale.bg : C.card, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{f?.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{f?.name}</div>
                      {scale && <span style={{ fontSize: 11, fontWeight: 700, color: scale.colour }}>{scale.label}</span>}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                        {d.positives?.slice(0,3).map(pid => {
                          const p = EXP_POSITIVE.find(x => x.id === pid);
                          return p ? <span key={pid} style={{ fontSize: 10, padding: "1px 7px", borderRadius: 20, background: "#E9F7EF", color: "#1E8449" }}>{p.emoji} {p.label}</span> : null;
                        })}
                        {d.negatives?.slice(0,3).map(nid => {
                          const n = EXP_NEGATIVE.find(x => x.id === nid);
                          return n ? <span key={nid} style={{ fontSize: 10, padding: "1px 7px", borderRadius: 20, background: "#FDECEA", color: "#C0392B" }}>{n.emoji} {n.label}</span> : null;
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note about non-kit fibres */}
            {expSelected.some(id => !ALL_FIBRES_EXP.find(f => f.id === id)?.kit) && (
              <div style={{ background: C.bLight, borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: C.bDark, lineHeight: 1.5 }}>
                💡 Non-kit fibre ratings are saved for insight but don't currently affect quiz scoring. They'll be used in future pattern analysis.
              </div>
            )}

            <button className="btn btn-p" style={{ marginBottom: 8 }} onClick={() => { setScreen("quiz"); setQuizStep(0); setCurAns(null); setAnswers({}); }}>
              Run Updated Quiz →
            </button>
            <button className="btn" style={{ background: "none", color: C.muted, border: `1.5px solid ${C.border}` }} onClick={() => setScreen("home")}>
              Back to Home
            </button>
          </>}
        </>}

        {/* ═══ QUIZ ════════════════════════════════════════════════════════════ */}
        {screen === "quiz" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={() => quizStep===0?setScreen("home"):(setQuizStep(quizStep-1),setCurAns(answers[QUIZ_STEPS[quizStep-1].id]||null))}>←</button>
            <div style={{ flex: 1 }}>
              <div className="pbar"><div className="pfill" style={{ width: `${((quizStep+1)/QUIZ_STEPS.length)*100}%` }} /></div>
              <div className="small">{quizStep+1} of {QUIZ_STEPS.length}</div>
            </div>
          </div>
          <h2 className="serif" style={{ fontSize: 22, marginBottom: 6 }}>{qStep.question}</h2>
          {qStep.subtitle && <p style={{ color: C.muted, fontSize: 14, marginBottom: 18 }}>{qStep.subtitle}</p>}
          <div style={{ marginBottom: 22, marginTop: qStep.subtitle ? 0 : 18 }}>
            {qStep.options.map(o => (
              <button key={o.value} className={`opt${isSel(o.value)?" sel":""}`} onClick={() => handleOpt(o.value)}>
                <span style={{ fontSize: 18 }}>{o.icon}</span><span>{o.label}</span>
                {isSel(o.value) && <span style={{ marginLeft: "auto", color: C.accent }}>✓</span>}
              </button>
            ))}
          </div>
          <button className="btn btn-p" onClick={nextQ} disabled={!curAns||(Array.isArray(curAns)&&curAns.length===0)} style={{ opacity: (!curAns||(Array.isArray(curAns)&&curAns.length===0))?.4:1 }}>
            {quizStep===QUIZ_STEPS.length-1?"See My Results":"Next →"}
          </button>
        </>}

        {/* ═══ RESULTS ══════════════════════════════════════════════════════════ */}
        {screen === "results" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={() => setScreen("home")}>←</button>
            <h2 className="serif" style={{ fontSize: 22 }}>Your Recommendations</h2>
          </div>
          <div className="card" style={{ background: C.aLight, border: "none", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: C.aDark, lineHeight: 1.6 }}>Start with one fibre, track your stool logs, water intake and symptoms for 1–2 weeks, then explore the next.</p>
            {profileInsightTags().length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid #E8C4A4`, fontSize: 12, color: C.aDark }}>
                🧬 Personalised using your biometric profile ({profileInsightTags().slice(0,3).join(", ")}{profileInsightTags().length > 3 ? "…" : ""}).
              </div>
            )}
            {Object.keys(expData).length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: C.aDark }}>
                🧪 {Object.keys(expData).filter(id => FIBRES.find(f => f.id === id)).length} personal fibre experience{Object.keys(expData).filter(id => FIBRES.find(f => f.id === id)).length !== 1 ? "s" : ""} influencing these results.
              </div>
            )}
          </div>
          {recs.map((f, i) => {
            const myExp = expData[f.id];
            const myScale = myExp ? EXP_SCALE.find(s => s.value === myExp.overall) : null;
            return (
            <div className="card" key={f.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontSize: 26, marginRight: 10 }}>{f.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 3 }}>
                    <span className={`badge r${i+1}`}>{i===0?"⭐ Top Pick":i===1?"2nd Choice":"3rd Choice"}</span>
                    {myScale && (
                      <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: myScale.bg, color: myScale.colour }}>
                        🧪 You: {myScale.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 10, lineHeight: 1.6 }}>{f.description}</p>
              {myExp && (myExp.positives?.length > 0 || myExp.negatives?.length > 0) && (
                <div style={{ marginBottom: 10, padding: "8px 12px", borderRadius: 10, background: "#F8F8F5", border: `1px solid ${C.border}` }}>
                  <div className="small" style={{ marginBottom: 5 }}>Your reported effects</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {myExp.positives?.map(pid => { const p = EXP_POSITIVE.find(x => x.id === pid); return p ? <span key={pid} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#E9F7EF", color: "#1E8449" }}>{p.emoji} {p.label}</span> : null; })}
                    {myExp.negatives?.map(nid => { const n = EXP_NEGATIVE.find(x => x.id === nid); return n ? <span key={nid} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#FDECEA", color: "#C0392B" }}>{n.emoji} {n.label}</span> : null; })}
                  </div>
                </div>
              )}
              {f.waterWarning && (
                <div style={{ marginBottom: 10, padding: "8px 12px", borderRadius: 10, background: C.bLight, border: `1px solid #AED6F1`, display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16 }}>💧</span>
                  <p style={{ fontSize: 12, color: C.bDark, lineHeight: 1.5 }}>Always take with at least 250ml of water. Psyllium husk without adequate hydration can cause or worsen constipation.</p>
                </div>
              )}
              <div style={{ marginBottom: 5 }}><span className="small">Starting dose: </span><strong style={{ fontSize: 13 }}>{f.startDose}</strong></div>
              <div style={{ marginBottom: 8 }}><span className="small">Sensitivity: </span><span style={{ fontSize: 13 }}>{f.sensitivity}</span></div>
              <div style={{ marginBottom: 6 }}><div className="small" style={{ marginBottom: 4 }}>Microbial families</div><div>{f.microbes.map(m => <span key={m} className="chip chip-g">{m}</span>)}</div></div>
              <div><div className="small" style={{ marginBottom: 4 }}>Effects to track</div><div>{f.effects.map(e => <span key={e} className="chip">{e}</span>)}</div></div>
              {/* Evidence trail — why this fibre was recommended */}
              {f.evidence && f.evidence.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                    📊 Why this was recommended
                  </div>
                  {f.evidence.filter(e => !e.suppressed).slice(0, 3).map((ev, ei) => {
                    const ins = ev.insight;
                    const studyBadge = {
                      meta_analysis: { label: "Meta-analysis", bg: "#FEF3C7", col: "#92400E" },
                      systematic_review: { label: "Sys. Review", bg: "#FEF3C7", col: "#92400E" },
                      rct: { label: "RCT", bg: "#DCFAEE", col: "#15774F" },
                      human_cohort: { label: "Cohort", bg: "#E8F2FA", col: "#2563A0" },
                      human_observational: { label: "Observational", bg: "#E8F2FA", col: "#2563A0" },
                      ex_vivo: { label: "Ex vivo", bg: "#F3F4F6", col: "#6B7280" },
                      animal: { label: "Animal", bg: "#F3F4F6", col: "#6B7280" },
                      in_vitro: { label: "In vitro", bg: "#F3F4F6", col: "#6B7280" },
                    }[ins.studyType] || { label: ins.studyType || "Study", bg: "#F3F4F6", col: "#6B7280" };
                    return (
                      <div key={ei} style={{ marginBottom: 10, padding: "10px 12px", borderRadius: 12, background: "#F8FAFC", border: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
                          <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: studyBadge.bg, color: studyBadge.col }}>{studyBadge.label}</span>
                          <span className={`direction-badge ${ins.direction==="positive"?"dir-pos":ins.direction==="negative"?"dir-neg":"dir-neu"}`}>
                            {ins.direction==="positive"?"▲ Supports":ins.direction==="negative"?"▼ Caution":"● Context"}
                          </span>
                          <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: "#EFF6FF", color: "#2563A0" }}>
                            {ins.confidence} confidence
                          </span>
                          {ins.sampleSize > 0 && <span style={{ fontSize: 10, color: C.muted, padding: "2px 6px" }}>n={ins.sampleSize.toLocaleString()}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, marginBottom: ins.modelCaveat ? 5 : 0 }}>{ins.summary}</div>
                        {ins.modelCaveat && (
                          <div style={{ fontSize: 11, color: "#92400E", background: "#FEF3C7", borderRadius: 8, padding: "4px 8px", marginTop: 4 }}>
                            ⚠️ {ins.modelCaveat}
                          </div>
                        )}
                        {ins.citation && <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontStyle: "italic" }}>{ins.citation}{ins.year ? `, ${ins.year}` : ""}</div>}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
                          {(ev.matched || []).slice(0, 3).map(tag => (
                            <span key={tag} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 10, background: "#E8F2FA", color: "#2563A0" }}>matched: {tag}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {f.evidence.filter(e => !e.suppressed).length > 3 && (
                    <div className="small" style={{ color: C.blue }}>+{f.evidence.filter(e => !e.suppressed).length - 3} more supporting insights in library</div>
                  )}
                  {f.evidence.filter(e => e.suppressed).length > 0 && (
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 6, padding: "6px 10px", background: "#F3F4F6", borderRadius: 8 }}>
                      🔬 {f.evidence.filter(e => e.suppressed).length} in vitro finding{f.evidence.filter(e => e.suppressed).length > 1 ? "s" : ""} suppressed (human trials only mode)
                    </div>
                  )}
                  {f.penalties && f.penalties.length > 0 && (
                    <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 10, background: "#FEE2E2", border: "1px solid #FCA5A5" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", marginBottom: 4 }}>⚠️ Contraindication signals</div>
                      {f.penalties.map((p, pi) => (
                        <div key={pi} style={{ fontSize: 11, color: "#991B1B", lineHeight: 1.5 }}>
                          {p.insight.summary} <span style={{ opacity: .7 }}>— matched: {p.matched.join(", ")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
          })}
          <button className="btn btn-s" style={{ marginTop: 6 }} onClick={() => setScreen("tracker")}>Start Tracking →</button>

          {/* Purchase links section */}
          <div className="card" style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>🛒 Where to Buy</div>
            <div className="small" style={{ marginBottom: 12 }}>Find your recommended fibres online</div>
            {recs.map(f => {
              const links = purchaseResults[f.id];
              return (
                <div key={f.id} style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{f.emoji} {f.name}</div>
                  {!links ? (
                    <button onClick={() => searchPurchaseLinks(f.id, f.name)}
                      style={{ padding:"8px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, background:"#F6F9FC", cursor:"pointer", fontSize:13, fontWeight:600, color:C.accent, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                      {purchaseLoading ? "🔍 Searching…" : "Search online stores →"}
                    </button>
                  ) : links.length === 0 ? (
                    <div className="small">No results found — try searching manually.</div>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {links.map((l, i) => (
                        <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                          style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:12, border:`1.5px solid ${C.border}`, background:"#FFFFFF", textDecoration:"none", color:C.text }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:600, fontSize:13 }}>{l.store}</div>
                            {l.product && <div className="small">{l.product}</div>}
                          </div>
                          {l.price && <div style={{ fontSize:12, fontWeight:700, color:C.green }}>{l.price}</div>}
                          <div style={{ fontSize:16, color:C.muted }}>→</div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button className="btn" style={{ marginTop: 8, background: "none", color: C.muted, border: `1.5px solid ${C.border}` }} onClick={() => setScreen("home")}>Back to Home</button>
        </>}

        {/* ═══ FIBRE TRACKER ════════════════════════════════════════════════════ */}
        {screen === "tracker" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={() => setScreen("home")}>←</button>
            <h2 className="serif" style={{ fontSize: 22 }}>Fibre Journal</h2>
          </div>
          <div className="card" style={{ marginBottom: 14 }}>
            <h3 className="serif" style={{ fontSize: 15, marginBottom: 12 }}>Log an Entry</h3>
            <div style={{ marginBottom: 10 }}><div className="small" style={{ marginBottom: 4 }}>Date</div><input className="inp" type="date" value={lf.date} onChange={e => setLf({ ...lf, date: e.target.value })} /></div>
            <div style={{ marginBottom: 10 }}><div className="small" style={{ marginBottom: 4 }}>Fibre taken</div>
              <select className="inp" value={lf.fibre} onChange={e => setLf({ ...lf, fibre: e.target.value })}>
                <option value="">Select a fibre…</option>
                {FIBRES.map(f => <option key={f.id} value={f.name}>{f.emoji} {f.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 2 }}><div className="small" style={{ marginBottom: 4 }}>Dose</div><input className="inp" type="number" min="0" step="0.5" placeholder="e.g. 5" value={lf.dose} onChange={e => setLf({ ...lf, dose: e.target.value })} /></div>
              <div style={{ flex: 1 }}><div className="small" style={{ marginBottom: 4 }}>Unit</div>
                <select className="inp" value={lf.unit} onChange={e => setLf({ ...lf, unit: e.target.value })}><option>g</option><option>tsp</option><option>tbsp</option><option>capsules</option></select>
              </div>
            </div>
            {lf.fibre === "Psyllium Husk" && (
              <div style={{ marginBottom: 10, padding: "8px 12px", borderRadius: 10, background: C.bLight, border: `1px solid #AED6F1`, display: "flex", gap: 8 }}>
                <span>💧</span><p style={{ fontSize: 12, color: C.bDark, lineHeight: 1.5 }}>Remember to drink at least 250ml of water with this dose.</p>
              </div>
            )}
            <div style={{ marginBottom: 10 }}><div className="small" style={{ marginBottom: 6 }}>Symptoms / effects</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {FIBRE_LOG_SYMPTOMS.map(s => <button key={s} className={`tog${lf.symptoms.includes(s)?" on":""}`} style={{ fontSize: 12 }} onClick={() => togFibreSym(s)}>{s}</button>)}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}><div className="small" style={{ marginBottom: 4 }}>Notes</div><textarea className="inp" rows={2} placeholder="Any other observations…" value={lf.notes} onChange={e => setLf({ ...lf, notes: e.target.value })} style={{ resize: "none" }} /></div>
            <button className="btn btn-p" onClick={addFibreLog} disabled={!lf.fibre||!lf.dose} style={{ opacity: (!lf.fibre||!lf.dose)?.4:1 }}>Save Entry</button>
          </div>
          {fibreLogs.length===0
            ? <div style={{ textAlign: "center", padding: "32px 0", color: C.muted }}><div style={{ fontSize: 32, marginBottom: 8 }}>📓</div><p style={{ fontSize: 14 }}>No entries yet.</p></div>
            : fibreLogs.map(log => (
              <div className="plog" key={log.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontWeight: 500, fontSize: 14 }}>{log.fibre}</span><span className="small">{log.date}</span></div>
                <div style={{ fontSize: 13, color: C.aDark, marginBottom: 5 }}>{log.dose} {log.unit}</div>
                {log.symptoms.length>0 && <div style={{ marginBottom: 4 }}>{log.symptoms.map(s => <span key={s} className="chip" style={{ fontSize: 11 }}>{s}</span>)}</div>}
                {log.notes && <div className="small" style={{ fontStyle: "italic" }}>"{log.notes}"</div>}
              </div>
            ))
          }
        </>}
        {/* ═══ PROFILE ════════════════════════════════════════════════════════ */}
        {screen === "profile" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={() => setScreen("home")}>←</button>
            <h2 className="serif" style={{ fontSize: 22 }}>My Profile</h2>
          </div>

          {/* Privacy note */}
          <div style={{ background: C.gLight, border: `1px solid #A9DFBF`, borderRadius: 12, padding: "12px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
            <p style={{ fontSize: 12, color: "#1E6B3A", lineHeight: 1.6 }}>
              <strong>Everything here is optional.</strong> Your data stays on this device only. It will be used to calculate things like BMI, and — if you share it — can help draw additional insights from the research library. Nothing is sent anywhere.
            </p>
          </div>

          {profileSaved && (
            <div style={{ background: C.gLight, border: "1px solid #A9DFBF", borderRadius: 12, padding: "10px 14px", marginBottom: 12, textAlign: "center", color: "#1E8449", fontWeight: 500, fontSize: 13 }}>
              ✅ Profile saved!
            </div>
          )}

          {/* ── Basic info ── */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-label" style={{ margin: "0 0 10px" }}>About you</div>
            <div style={{ marginBottom: 10 }}>
              <div className="small" style={{ marginBottom: 4 }}>Name (optional)</div>
              <input className="inp" placeholder="e.g. Alex" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
            </div>

            {/* Date of birth */}
            <div style={{ marginBottom: 10 }}>
              <div className="small" style={{ marginBottom: 4 }}>Date of birth <span style={{ color: C.muted }}>(optional — enables age tracking over time)</span></div>
              <div style={{ display: "flex", gap: 8 }}>
                <select className="inp" style={{ flex: 2 }} value={profile.dobMonth} onChange={e => setProfile(p => ({ ...p, dobMonth: e.target.value }))}>
                  <option value="">Month…</option>
                  {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m,i) => (
                    <option key={m} value={i+1}>{m}</option>
                  ))}
                </select>
                <input className="inp" style={{ flex: 1 }} type="number" placeholder="Year" min="1900" max={new Date().getFullYear()} value={profile.dobYear} onChange={e => setProfile(p => ({ ...p, dobYear: e.target.value }))} />
              </div>
              {displayAge !== null && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>{displayAge} years old</span>
                  <span style={{ fontSize: 12, color: C.muted }}>· Age group: {derivedAgeGroup}</span>
                </div>
              )}
            </div>

            {/* Age group fallback (only show if no DOB) */}
            {!profile.dobYear && (
              <div style={{ marginBottom: 10 }}>
                <div className="small" style={{ marginBottom: 4 }}>Age group <span style={{ color: C.muted }}>(if not entering DOB)</span></div>
                <select className="inp" value={profile.ageGroup} onChange={e => setProfile(p => ({ ...p, ageGroup: e.target.value }))}>
                  <option value="">Select…</option>
                  {["Under 18","18–24","25–34","35–44","45–54","55–64","65–74","75+"].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            )}

            <div>
              <div className="small" style={{ marginBottom: 4 }}>Biological sex</div>
              <select className="inp" value={profile.sex} onChange={e => setProfile(p => ({ ...p, sex: e.target.value }))}>
                <option value="">Select…</option>
                <option>Male</option><option>Female</option><option>Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* ── Height & Weight → BMI ── */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-label" style={{ margin: "0 0 4px" }}>Height &amp; Weight</div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>Used to calculate your BMI, which informs fibre recommendations related to metabolic health.</p>

            <div className="bio-metric-row">
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>Height</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  {["cm","ft/in"].map(u => <button key={u} className={`tog${profile.unitHeight===u?" on":""}`} style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => setProfile(p => ({ ...p, unitHeight: u }))}>{u}</button>)}
                </div>
              </div>
              <div className="bio-input-group">
                <input className="bio-input" type="number" placeholder={profile.unitHeight === "cm" ? "175" : "70"} value={profile.heightCm} onChange={e => setProfile(p => ({ ...p, heightCm: e.target.value }))} />
                <span className="bio-unit">{profile.unitHeight === "cm" ? "cm" : "in"}</span>
              </div>
            </div>

            <div className="bio-metric-row">
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>Weight</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  {["kg","lbs"].map(u => <button key={u} className={`tog${profile.unitWeight===u?" on":""}`} style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => setProfile(p => ({ ...p, unitWeight: u }))}>{u}</button>)}
                </div>
              </div>
              <div className="bio-input-group">
                <input className="bio-input" type="number" placeholder={profile.unitWeight === "kg" ? "70" : "154"} value={profile.weightKg} onChange={e => setProfile(p => ({ ...p, weightKg: e.target.value }))} />
                <span className="bio-unit">{profile.unitWeight === "kg" ? "kg" : "lbs"}</span>
              </div>
            </div>

            {bmi && (
              <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 12, background: bmiCat?.bg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: bmiCat?.colour, fontWeight: 600, marginBottom: 2 }}>Your BMI</div>
                  <div style={{ fontSize: 28, fontFamily: "'Playfair Display',serif", color: bmiCat?.colour, fontWeight: 600 }}>{bmi}</div>
                </div>
                <span style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: bmiCat?.colour, color: "white" }}>{bmiCat?.label}</span>
              </div>
            )}
          </div>

          {/* ── Blood Pressure ── */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-label" style={{ margin: "0 0 4px" }}>Blood Pressure</div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>Elevated BP is associated with cardiovascular risk. Fibres like beta-glucan and psyllium have evidence for BP reduction.</p>
            <div className="bio-metric-row">
              <span style={{ fontWeight: 500, fontSize: 14 }}>Systolic</span>
              <div className="bio-input-group">
                <input className="bio-input" type="number" placeholder="120" value={profile.systolic} onChange={e => setProfile(p => ({ ...p, systolic: e.target.value }))} />
                <span className="bio-unit">mmHg</span>
              </div>
            </div>
            <div className="bio-metric-row">
              <span style={{ fontWeight: 500, fontSize: 14 }}>Diastolic</span>
              <div className="bio-input-group">
                <input className="bio-input" type="number" placeholder="80" value={profile.diastolic} onChange={e => setProfile(p => ({ ...p, diastolic: e.target.value }))} />
                <span className="bio-unit">mmHg</span>
              </div>
            </div>
            {bpCat && (
              <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 10, background: bpCat.bg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: bpCat.colour }}>
                  {profile.systolic}/{profile.diastolic} mmHg
                </span>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: bpCat.colour, color: "white" }}>{bpCat.label}</span>
              </div>
            )}
          </div>

          {/* ── Blood Glucose ── */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-label" style={{ margin: "0 0 4px" }}>Blood Glucose</div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>Fasting glucose and HbA1c are key markers for metabolic health. Beta-glucan and resistant starch have strong evidence for glycaemic control.</p>
            <div className="bio-metric-row">
              <span style={{ fontWeight: 500, fontSize: 14 }}>Fasting glucose</span>
              <div className="bio-input-group">
                <input className="bio-input" type="number" step="0.1" placeholder="5.0" value={profile.fastingGlucose} onChange={e => setProfile(p => ({ ...p, fastingGlucose: e.target.value }))} />
                <span className="bio-unit">mmol/L</span>
              </div>
            </div>
            <div className="bio-metric-row">
              <span style={{ fontWeight: 500, fontSize: 14 }}>HbA1c</span>
              <div className="bio-input-group">
                <input className="bio-input" type="number" step="0.1" placeholder="5.4" value={profile.hba1c} onChange={e => setProfile(p => ({ ...p, hba1c: e.target.value }))} />
                <span className="bio-unit">%</span>
              </div>
            </div>
            {glucCat && (
              <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 10, background: glucCat.bg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: glucCat.colour }}>Fasting: {profile.fastingGlucose} mmol/L</span>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: glucCat.colour, color: "white" }}>{glucCat.label}</span>
              </div>
            )}
          </div>

          {/* ── Cholesterol ── */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="section-label" style={{ margin: "0 0 4px" }}>Cholesterol Panel</div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>Cholesterol levels directly influence which fibres may be most beneficial. Beta-glucan, psyllium and pectin all have evidence for LDL reduction.</p>
            {[
              ["Total cholesterol", "totalCholesterol", "5.0", "mmol/L"],
              ["LDL (bad)", "ldl", "3.0", "mmol/L"],
              ["HDL (good)", "hdl", "1.5", "mmol/L"],
              ["Triglycerides", "triglycerides", "1.5", "mmol/L"],
            ].map(([label, key, ph, unit]) => (
              <div className="bio-metric-row" key={key}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>{label}</span>
                <div className="bio-input-group">
                  <input className="bio-input" type="number" step="0.1" placeholder={ph} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                  <span className="bio-unit">{unit}</span>
                </div>
              </div>
            ))}
            {cholCat && (
              <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 10, background: cholCat.bg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: cholCat.colour }}>Total: {profile.totalCholesterol} mmol/L</span>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: cholCat.colour, color: "white" }}>{cholCat.label}</span>
              </div>
            )}
          </div>

          {/* Research library link */}
          {profileInsightTags().length > 0 && (
            <div style={{ background: C.aLight, borderRadius: 12, padding: "12px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>🔬</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>Research Library is aware of your profile</div>
                <div style={{ fontSize: 12, color: C.aDark, lineHeight: 1.5 }}>
                  {profileInsightTags().slice(0, 4).join(", ")} signals are boosting relevant fibre recommendations in your quiz results.
                </div>
              </div>
            </div>
          )}

          <button className="btn btn-p" style={{ marginBottom: 8 }} onClick={() => { setProfileSaved(true); setTimeout(() => { setProfileSaved(false); setScreen("home"); }, 1400); }}>Save Profile</button>
          <button className="btn" style={{ marginBottom: 8, background: "linear-gradient(135deg,#2C2018,#5A3E2B)", color: "white", border: "none" }} onClick={() => openMeasureModal()}>+ Add Measurement</button>
          {bioReadings.length > 0 && (
            <button className="btn btn-s" style={{ marginBottom: 8 }} onClick={() => setScreen("bio_review")}>📈 View Measurement History</button>
          )}
          <button className="btn" style={{ background: "none", color: C.muted, border: `1.5px solid ${C.border}` }} onClick={() => setScreen("home")}>Cancel</button>
        </>}

        {/* ═══ BIOMETRIC REVIEW ════════════════════════════════════════════════ */}
        {screen === "bio_review" && (() => {
          function readingsFor(key) {
            return [...bioReadings].filter(r => r.metric === key).reverse();
          }

          const REVIEW_METRICS = [
            { key: "weightKg",         label: "Weight",            unit: profile.unitWeight === "kg" ? "kg" : "lbs", colour: "#C8794A", emoji: "⚖️",
              category: () => { const b=parseFloat(calcBMI()); if(!b) return null; if(b<18.5) return{l:"Underweight BMI",c:"#2471A3",bg:"#EBF5FB"}; if(b<25) return{l:"Healthy BMI",c:"#27AE60",bg:"#E9F7EF"}; if(b<30) return{l:"Overweight BMI",c:"#E67E22",bg:"#FEF0E6"}; return{l:"Obese BMI",c:"#C0392B",bg:"#FDECEA"}; }
            },
            { key: "bloodPressure",    label: "Blood Pressure",    unit: "mmHg",   colour: "#C0392B", emoji: "❤️",
              category: (_,r) => { const s=r?.value,d=r?.value2; if(!s||!d) return null; if(s<120&&d<80) return{l:"Normal",c:"#27AE60",bg:"#E9F7EF"}; if(s<130&&d<80) return{l:"Elevated",c:"#E67E22",bg:"#FEF0E6"}; if(s<140||d<90) return{l:"High Stage 1",c:"#E67E22",bg:"#FEF0E6"}; return{l:"High Stage 2",c:"#C0392B",bg:"#FDECEA"}; },
              renderVal: (r) => r.value2 ? r.value+"/"+r.value2 : String(r.value)
            },
            { key: "fastingGlucose",   label: "Fasting Glucose",   unit: "mmol/L", colour: "#2471A3", emoji: "🩸",
              category: (v) => { const g=parseFloat(v); if(!g) return null; if(g<5.6) return{l:"Normal",c:"#27AE60",bg:"#E9F7EF"}; if(g<7) return{l:"Pre-diabetic",c:"#E67E22",bg:"#FEF0E6"}; return{l:"Diabetic range",c:"#C0392B",bg:"#FDECEA"}; }
            },
            { key: "hba1c",            label: "HbA1c",             unit: "%",      colour: "#5DADE2", emoji: "💉", category: null },
            { key: "totalCholesterol", label: "Total Cholesterol",  unit: "mmol/L", colour: "#6B8F71", emoji: "🧪",
              category: (v) => { const t=parseFloat(v); if(!t) return null; if(t<5) return{l:"Desirable",c:"#27AE60",bg:"#E9F7EF"}; if(t<6.2) return{l:"Borderline",c:"#E67E22",bg:"#FEF0E6"}; return{l:"High",c:"#C0392B",bg:"#FDECEA"}; }
            },
            { key: "ldl",              label: "LDL",               unit: "mmol/L", colour: "#E74C3C", emoji: "📉", category: null },
            { key: "hdl",              label: "HDL",               unit: "mmol/L", colour: "#27AE60", emoji: "📈", category: null },
            { key: "triglycerides",    label: "Triglycerides",     unit: "mmol/L", colour: "#F39C12", emoji: "🔬", category: null },
          ];

          function Sparkline({ readings, colour, height = 52 }) {
            const nums = readings.map(r => r.value);
            if (nums.length < 2) return (
              <div style={{ textAlign: "center", padding: "10px 0", color: C.muted, fontSize: 12 }}>
                {nums.length === 1 ? "Add another reading to see a trend" : "No data"}
              </div>
            );
            const min = Math.min(...nums), max = Math.max(...nums);
            const range = max - min || 1;
            const W = 260, H = height;
            const pts = nums.map((n, i) => [
              (i / (nums.length - 1)) * W,
              H - ((n - min) / range) * (H - 12) - 6
            ]);
            const polyPts = pts.map(([x,y]) => x+","+y).join(" ");
            const areaPath = "M0,"+H+" "+pts.map(([x,y]) => "L"+x+","+y).join(" ")+" L"+W+","+H+" Z";
            const latest = nums[nums.length-1], prev = nums[nums.length-2];
            const trend = latest > prev ? "▲" : latest < prev ? "▼" : null;
            const trendCol = latest > prev ? "#C0392B" : "#27AE60";
            const gradId = "g"+colour.replace("#","");
            return (
              <div style={{ position: "relative" }}>
                <svg width="100%" viewBox={"0 0 "+W+" "+H} preserveAspectRatio="none" style={{ display: "block" }}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colour} stopOpacity="0.28" />
                      <stop offset="100%" stopColor={colour} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill={"url(#"+gradId+")"} />
                  <polyline points={polyPts} fill="none" stroke={colour} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {pts.map(([x,y], i) => (
                    <circle key={i} cx={x} cy={y} r="3.5" fill={colour} stroke="white" strokeWidth="1.5" />
                  ))}
                </svg>
                {trend && (
                  <div style={{ position: "absolute", top: 2, right: 2, fontSize: 14, fontWeight: 800, color: trendCol }}>
                    {trend}
                  </div>
                )}
              </div>
            );
          }

          const activeMetrics = REVIEW_METRICS.filter(m => readingsFor(m.key).length > 0);

          return <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={() => setScreen("profile")}>←</button>
              <div style={{ flex: 1 }}>
                <h2 className="serif" style={{ fontSize: 22 }}>Measurements</h2>
                <div className="small">{bioReadings.length} reading{bioReadings.length !== 1 ? "s" : ""} · {activeMetrics.length} metric{activeMetrics.length !== 1 ? "s" : ""} tracked</div>
              </div>
              <button
                style={{ background: "linear-gradient(135deg,#2C2018,#5A3E2B)", color: "white", border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}
                onClick={() => openMeasureModal()}>
                + Add
              </button>
            </div>

            {displayAge !== null && (
              <div style={{ background: C.aLight, borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{profile.name || "You"} · {displayAge} years old</div>
                  <div className="small">{derivedAgeGroup}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="small">Born</div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(profile.dobMonth)-1] || ""} {profile.dobYear}
                  </div>
                </div>
              </div>
            )}

            {activeMetrics.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: C.muted }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>No measurements yet.<br/>Tap + Add to log your first one.</p>
                <button className="btn btn-p" style={{ maxWidth: 200, margin: "20px auto 0" }} onClick={() => openMeasureModal()}>+ Add Measurement</button>
              </div>
            ) : activeMetrics.map(metric => {
              const readings = readingsFor(metric.key);
              const latest = readings[readings.length - 1];
              const earliest = readings[0];
              const deltaNum = readings.length > 1 ? (latest.value - earliest.value) : null;
              const deltaStr = deltaNum !== null ? (deltaNum >= 0 ? "+" : "") + deltaNum.toFixed(2) : null;
              const catFn = metric.category;
              const cat = catFn ? catFn(latest.value, latest) : null;
              const displayVal = metric.renderVal ? metric.renderVal(latest) : String(latest.value);

              return (
                <div className="card" key={metric.key} style={{ marginBottom: 12 }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 18 }}>{metric.emoji}</span>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{metric.label}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                        <span style={{ fontSize: 30, fontFamily: "'Playfair Display',serif", fontWeight: 600, color: metric.colour }}>{displayVal}</span>
                        <span className="small">{metric.unit}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {cat && <span style={{ display: "block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: cat.bg, color: cat.c, marginBottom: 4 }}>{cat.l}</span>}
                      {deltaStr !== null && (
                        <>
                          <span style={{ fontSize: 12, fontWeight: 700, color: parseFloat(deltaStr) === 0 ? C.muted : parseFloat(deltaStr) > 0 ? "#C0392B" : "#27AE60" }}>{deltaStr} {metric.unit}</span>
                          <div className="small" style={{ marginTop: 1 }}>overall change</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sparkline */}
                  <Sparkline readings={readings} colour={metric.colour} />

                  {/* Date axis */}
                  {readings.length > 1 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      <span style={{ fontSize: 9, color: C.muted }}>{new Date(readings[0].date).toLocaleDateString([],{month:"short",day:"numeric"})}</span>
                      <span style={{ fontSize: 9, color: C.muted }}>{readings.length} readings</span>
                      <span style={{ fontSize: 9, color: C.muted }}>{new Date(readings[readings.length-1].date).toLocaleDateString([],{month:"short",day:"numeric"})}</span>
                    </div>
                  )}

                  {/* Reading log */}
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid "+C.border }}>
                    <div className="small" style={{ marginBottom: 6 }}>All readings</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {[...readings].reverse().map((r, i) => (
                        <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderRadius: 9, background: i === 0 ? metric.colour+"18" : C.bg, border: i === 0 ? "1.5px solid "+metric.colour+"44" : "1px solid "+C.border }}>
                          <span style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? metric.colour : C.text }}>
                            {metric.renderVal ? metric.renderVal(r) : r.value} {metric.unit}
                            {i === 0 && <span style={{ fontSize: 10, fontWeight: 500, marginLeft: 6, opacity: .7 }}>Latest</span>}
                          </span>
                          <span className="small">{new Date(r.date).toLocaleDateString([],{day:"numeric",month:"short",year:"numeric"})}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openMeasureModal(metric.key)}
                    style={{ marginTop: 10, width: "100%", padding: "8px", borderRadius: 9, border: "1.5px solid "+metric.colour+"66", background: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: metric.colour, fontFamily: "'DM Sans',sans-serif" }}>
                    + New {metric.label} reading
                  </button>
                </div>
              );
            })}
          </>;
        })()}

                {/* ═══ ADMIN PIN GATE ══════════════════════════════════════════════════ */}
        {screen === "admin_pin" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={() => setScreen("home")}>←</button>
            <h2 className="serif" style={{ fontSize: 22 }}>Admin Access</h2>
          </div>
          <div style={{ textAlign: "center", padding: "20px 0 28px" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🔬</div>
            <div className="serif" style={{ fontSize: 20, marginBottom: 6 }}>Research Library</div>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>This area is for admin use only.<br/>Enter your PIN to continue.</p>
            <input
              className="admin-pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="••••"
              value={pinInput}
              onChange={e => { setPinInput(e.target.value); setPinError(false); }}
              onKeyDown={e => e.key === "Enter" && tryUnlock()}
              autoFocus
            />
            {pinError && <div style={{ color: "#C0392B", fontSize: 13, marginTop: 10 }}>Incorrect PIN. Try again.</div>}
            <button className="btn btn-p" style={{ marginTop: 20, maxWidth: 240, margin: "20px auto 0" }} onClick={tryUnlock}>Unlock →</button>
            <div style={{ marginTop: 16, fontSize: 11, color: C.muted }}>Default PIN: 1234 — change ADMIN_PIN in the code</div>
          </div>
        </>}

        {/* ═══ RESEARCH LIBRARY ════════════════════════════════════════════════ */}
        {screen === "admin" && adminUnlocked && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={() => setScreen("home")}>←</button>
            <div style={{ flex: 1 }}>
              <h2 className="serif" style={{ fontSize: 20 }}>Research Library</h2>
              <div className="small">{insights.length} insights · {activeInsightCount} influencing quiz</div>
            </div>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 12, padding: "4px 8px", borderRadius: 8, border: `1px solid ${C.border}` }} onClick={() => { setAdminUnlocked(false); setScreen("home"); }}>🔒 Lock</button>
          </div>

          {/* Tabs */}
          <div className="tab-row">
            {[["library","📚 Library"],["add","➕ Add Insight"],["search","🔍 Search Papers"]].map(([t,l]) => (
              <button key={t} className={`tab-btn${libTab===t?" on":""}`} onClick={() => { setLibTab(t); setAiResults(null); setAiSearchResults([]); }}>{l}</button>
            ))}
          </div>

          {/* ── LIBRARY TAB ── */}
          {libTab === "library" && <>
            {/* AI Migration panel */}
            {insights.filter(i => !i.relevantFor || i.relevantFor.length === 0).length > 0 && !migrating && (
              <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 14, background: "#FEF3C7", border: "1px solid #FCD34D" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#92400E", marginBottom: 4 }}>🔧 {insights.filter(i => !i.relevantFor || i.relevantFor.length === 0).length} insights need tagging</div>
                <div style={{ fontSize: 12, color: "#78350F", lineHeight: 1.5, marginBottom: 10 }}>These insights were added before the new evidence-driven quiz. Auto-tag them to make them influence recommendations.</div>
                <button className="btn" style={{ background: "#92400E", color: "white", fontSize: 13, padding: "10px" }} onClick={runMigration}>
                  🤖 Auto-tag all with AI →
                </button>
              </div>
            )}
            {migrating && (
              <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 14, background: "#E8F2FA", border: "1px solid #BFDBFE" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#2563A0", marginBottom: 6 }}>🤖 Tagging insights with AI…</div>
                <div style={{ height: 6, background: "#DBEAFE", borderRadius: 4, marginBottom: 6 }}>
                  <div style={{ height: "100%", width: `${Math.round((migrationProgress / insights.length) * 100)}%`, background: "#3B82C4", borderRadius: 4, transition: "width .3s" }} />
                </div>
                <div className="small">{migrationProgress} of {insights.length} processed</div>
              </div>
            )}
            {/* Filter by fibre */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              <button className={`tog${libFilter==="all"?" on":""}`} style={{ fontSize: 11 }} onClick={() => setLibFilter("all")}>All</button>
              {FIBRES.map(f => <button key={f.id} className={`tog${libFilter===f.id?" on":""}`} style={{ fontSize: 11 }} onClick={() => setLibFilter(f.id)}>{f.emoji} {f.name.split(" ")[0]}</button>)}
            </div>
            {filteredInsights.length === 0
              ? <div style={{ textAlign: "center", padding: "40px 0", color: C.muted }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                  <p style={{ fontSize: 14 }}>No insights yet. Use the Add tab to get started.</p>
                </div>
              : filteredInsights.map(insight => {
                  const fibre = FIBRES.find(f => f.id === insight.fibreId);
                  return (
                    <div className={`insight-card${insight.active ? "" : " inactive"}`} key={insight.id}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
                            {fibre && <span style={{ fontSize: 13, fontWeight: 600 }}>{fibre.emoji} {fibre.name}</span>}
                            <span className={`direction-badge ${insight.direction === "positive" ? "dir-pos" : insight.direction === "negative" ? "dir-neg" : "dir-neu"}`}>
                              {insight.direction === "positive" ? "▲ Supports" : insight.direction === "negative" ? "▼ Caution" : "● Neutral"}
                            </span>
                            <span className={`conf-badge conf-${insight.confidence}`}>{insight.confidence} confidence</span>
                            {insight.studyType && (
                              <span style={{ padding: "2px 7px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: ["meta_analysis","systematic_review","rct"].includes(insight.studyType) ? "#DCFAEE" : "#F3F4F6", color: ["meta_analysis","systematic_review","rct"].includes(insight.studyType) ? "#15774F" : "#6B7280" }}>
                                {insight.studyType.replace(/_/g," ")}
                              </span>
                            )}
                            {insight.sampleSize > 0 && <span style={{ fontSize: 10, color: C.muted }}>n={insight.sampleSize.toLocaleString()}</span>}
                            {insight.modelCaveat && <span style={{ fontSize: 10, color: "#92400E", background: "#FEF3C7", padding: "2px 6px", borderRadius: 10 }}>⚠️ in vitro</span>}
                            {(!insight.relevantFor || insight.relevantFor.length === 0) && <span style={{ fontSize: 10, color: "#92400E", background: "#FEF3C7", padding: "2px 6px", borderRadius: 10 }}>⚙️ needs tagging</span>}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, color: C.text }}>{insight.condition}</div>
                          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 6 }}>{insight.summary}</div>
                          {insight.citation && <div style={{ fontSize: 11, color: C.blue, fontStyle: "italic" }}>{insight.citation}{insight.year ? ` (${insight.year})` : ""}</div>}
                        </div>
                        {/* Toggle */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                          <button className={`toggle-pill ${insight.active ? "on" : "off"}`} onClick={() => toggleInsight(insight.id)}>
                            <div className="toggle-knob" />
                          </button>
                          <span style={{ fontSize: 9, color: C.muted }}>{insight.active ? "Active" : "Off"}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: C.muted }}>Added {new Date(insight.addedAt).toLocaleDateString()}</span>
                        <button onClick={() => deleteInsight(insight.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C0392B", fontSize: 12, padding: 0 }}>Delete</button>
                      </div>
                    </div>
                  );
                })
            }
          </>}

          {/* ── ADD INSIGHT TAB ── */}
          {libTab === "add" && <>
            {/* Mode selector */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {[["abstract","📄 Abstract"],["pdf","📑 Full PDF"],["url","🔗 URL/DOI"],["manual","✏️ Manual"]].map(([m,l]) => (
                <button key={m} className={`tog${addMode===m?" on":""}`} style={{ flex: 1, fontSize: 11, minWidth: 70 }} onClick={() => { setAddMode(m); setAiResults(null); setPdfFile(null); setPdfStatus(null); }}>{l}</button>
              ))}
            </div>

            {/* Abstract mode */}
            {addMode === "abstract" && <>
              <div className="card" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 500, marginBottom: 6 }}>Paste Abstract</div>
                <div className="small" style={{ marginBottom: 10 }}>Copy the abstract from any research paper and paste it below. AI will extract the key insight for you to review.</div>
                <textarea className="inp" rows={6} placeholder="Paste abstract text here…" style={{ resize: "none" }} value={abstractText} onChange={e => setAbstractText(e.target.value)} />
                <button className="btn btn-p" style={{ marginTop: 10 }} onClick={() => extractFromAbstract(abstractText)} disabled={!abstractText.trim() || aiLoading}>
                  {aiLoading ? "Extracting…" : "Extract Insight →"}
                </button>
              </div>
            </>}

            {/* PDF upload mode */}
            {addMode === "pdf" && <>
              <div className="card" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Upload Full-Text PDF</div>
                <div className="small" style={{ marginBottom: 12, lineHeight: 1.6 }}>
                  Full text gives significantly better insight quality than abstracts alone. 
                  The AI reads Methods (study model), Results (effect sizes), and Discussion (author limitations) — 
                  catching nuances like in vitro caveats that abstracts omit.
                </div>
                <div style={{ border: `2px dashed ${pdfFile ? C.green : C.border}`, borderRadius: 14, padding: "20px 14px", textAlign: "center", marginBottom: 12, background: pdfFile ? "#DCFAEE" : "#F6F9FC", transition: "all .2s" }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") setPdfFile(f); }}>
                  {pdfFile ? (
                    <>
                      <div style={{ fontSize: 32, marginBottom: 6 }}>📑</div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: C.green }}>{pdfFile.name}</div>
                      <div className="small">{(pdfFile.size / 1024).toFixed(0)} KB · Ready to extract</div>
                      <button onClick={() => setPdfFile(null)} style={{ marginTop: 8, fontSize: 11, color: C.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Remove</button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 32, marginBottom: 6 }}>📄</div>
                      <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 4 }}>Drag & drop PDF here</div>
                      <div className="small" style={{ marginBottom: 10 }}>or click to browse</div>
                      <label style={{ padding: "8px 16px", borderRadius: 10, background: "#3B82C4", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        Browse
                        <input type="file" accept=".pdf,application/pdf" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) setPdfFile(f); }} />
                      </label>
                    </>
                  )}
                </div>
                {pdfStatus && (
                  <div className="ai-thinking" style={{ marginBottom: 10 }}>
                    <span className="spin">⚙️</span>
                    <span>{pdfStatus === "reading" ? "Reading PDF…" : "Extracting insight from full text…"}</span>
                  </div>
                )}
                <button className="btn btn-p" onClick={() => pdfFile && extractFromPdf(pdfFile)} disabled={!pdfFile || aiLoading} style={{ opacity: (!pdfFile || aiLoading) ? .4 : 1 }}>
                  {aiLoading ? "Extracting…" : "Extract from Full Paper →"}
                </button>
                <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 10, background: C.aLight, fontSize: 11, color: C.aDark, lineHeight: 1.6 }}>
                  💡 <strong>Why full text matters:</strong> Abstract says "significantly altered microbiome" — full paper Methods says "in vitro batch fermentation model". These are very different claims with different clinical implications.
                </div>
              </div>
            </>}

            {/* URL / DOI mode */}
            {addMode === "url" && <>
              <div className="card" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 500, marginBottom: 6 }}>Paper URL or DOI</div>
                <div className="small" style={{ marginBottom: 10 }}>Paste a PubMed link, DOI, or any paper URL. AI will fetch the abstract and extract the insight.</div>
                <input className="inp" placeholder="e.g. https://pubmed.ncbi.nlm.nih.gov/12345678" value={urlInput} onChange={e => setUrlInput(e.target.value)} />
                <button className="btn btn-p" style={{ marginTop: 10 }} onClick={() => extractFromUrl(urlInput)} disabled={!urlInput.trim() || aiLoading}>
                  {aiLoading ? "Fetching…" : "Fetch & Extract →"}
                </button>
              </div>
            </>}

            {/* Manual mode */}
            {addMode === "manual" && <>
              <div className="card" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 500, marginBottom: 14 }}>Manual Entry</div>
                <div style={{ marginBottom: 10 }}>
                  <div className="small" style={{ marginBottom: 4 }}>Fibre</div>
                  <select className="inp" value={manualForm.fibreId} onChange={e => setManualForm(f => ({ ...f, fibreId: e.target.value }))}>
                    <option value="">Select fibre…</option>
                    {FIBRES.map(f => <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div className="small" style={{ marginBottom: 4 }}>Condition / context</div>
                  <input className="inp" placeholder="e.g. IBS-C, blood glucose, Bifidobacterium…" value={manualForm.condition} onChange={e => setManualForm(f => ({ ...f, condition: e.target.value }))} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div className="small" style={{ marginBottom: 4 }}>Effect observed</div>
                  <input className="inp" placeholder="e.g. Reduced transit time by 18%" value={manualForm.effect} onChange={e => setManualForm(f => ({ ...f, effect: e.target.value }))} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div className="small" style={{ marginBottom: 8 }}>Direction</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["positive","negative","neutral"].map(d => (
                      <button key={d} className={`tog${manualForm.direction===d?" on":""}`} style={{ flex: 1, fontSize: 12 }} onClick={() => setManualForm(f => ({ ...f, direction: d }))}>{d}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div className="small" style={{ marginBottom: 8 }}>Confidence</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["low","medium","high"].map(d => (
                      <button key={d} className={`tog${manualForm.confidence===d?" on":""}`} style={{ flex: 1, fontSize: 12 }} onClick={() => setManualForm(f => ({ ...f, confidence: d }))}>{d}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div className="small" style={{ marginBottom: 4 }}>Summary (your words)</div>
                  <textarea className="inp" rows={3} placeholder="Brief plain-English summary of the finding…" style={{ resize: "none" }} value={manualForm.summary} onChange={e => setManualForm(f => ({ ...f, summary: e.target.value }))} />
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <div style={{ flex: 3 }}>
                    <div className="small" style={{ marginBottom: 4 }}>Citation / authors</div>
                    <input className="inp" placeholder="e.g. Smith et al., Gut, 2023" value={manualForm.citation} onChange={e => setManualForm(f => ({ ...f, citation: e.target.value }))} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="small" style={{ marginBottom: 4 }}>Year</div>
                    <input className="inp" placeholder="2024" value={manualForm.year} onChange={e => setManualForm(f => ({ ...f, year: e.target.value }))} />
                  </div>
                </div>
                {/* New schema fields */}
                <div style={{ marginBottom: 10 }}>
                  <div className="small" style={{ marginBottom: 6 }}>Study type</div>
                  <select className="inp" value={manualForm.studyType} onChange={e => setManualForm(f => ({ ...f, studyType: e.target.value }))}>
                    {[["meta_analysis","Meta-analysis"],["systematic_review","Systematic Review"],["rct","RCT"],["human_cohort","Human Cohort"],["human_observational","Observational"],["ex_vivo","Ex vivo"],["animal","Animal"],["in_vitro","In vitro"],["case_study","Case Study"],["expert_opinion","Expert Opinion"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div className="small" style={{ marginBottom: 4 }}>Sample size (n=)</div>
                    <input className="inp" type="number" min="0" placeholder="0 for in vitro" value={manualForm.sampleSize || ""} onChange={e => setManualForm(f => ({ ...f, sampleSize: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div style={{ flex: 2 }}>
                    <div className="small" style={{ marginBottom: 4 }}>Model type</div>
                    <input className="inp" placeholder="e.g. batch fermentation, crossover RCT" value={manualForm.modelType || ""} onChange={e => setManualForm(f => ({ ...f, modelType: e.target.value }))} />
                  </div>
                </div>
                {["in_vitro","ex_vivo","animal"].includes(manualForm.studyType) && (
                  <div style={{ marginBottom: 10 }}>
                    <div className="small" style={{ marginBottom: 4 }}>⚠️ Model caveat (required for non-human studies)</div>
                    <textarea className="inp" rows={2} placeholder="Why may this finding not translate to humans?" style={{ resize: "none" }} value={manualForm.modelCaveat || ""} onChange={e => setManualForm(f => ({ ...f, modelCaveat: e.target.value }))} />
                  </div>
                )}
                <div style={{ marginBottom: 10 }}>
                  <div className="small" style={{ marginBottom: 4 }}>Relevant for (comma-separated tags)</div>
                  <input className="inp" placeholder="e.g. cholesterol, ldl, cardiovascular" value={(manualForm.relevantFor || []).join(", ")} onChange={e => setManualForm(f => ({ ...f, relevantFor: e.target.value.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) }))} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div className="small" style={{ marginBottom: 4 }}>Contraindicated for (comma-separated tags)</div>
                  <input className="inp" placeholder="e.g. sibo, sensitive gut, fermentation intolerance" value={(manualForm.contraindicates || []).join(", ")} onChange={e => setManualForm(f => ({ ...f, contraindicates: e.target.value.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) }))} />
                </div>
                <button className="btn btn-p" disabled={!manualForm.fibreId || !manualForm.condition || !manualForm.summary} style={{ opacity: (!manualForm.fibreId || !manualForm.condition || !manualForm.summary) ? .4 : 1 }}
                  onClick={() => {
                    addInsight(manualForm);
                    setManualForm({ fibreId: "", condition: "", effect: "", direction: "positive", confidence: "medium", summary: "", citation: "", year: "", studyType: "rct", sampleSize: 0, modelType: "", modelCaveat: "", contradictedBy: "", relevantFor: [], contraindicates: [] });
                    setLibTab("library");
                  }}>
                  Save Insight
                </button>
              </div>
            </>}

            {/* AI loading indicator */}
            {aiLoading && (
              <div className="ai-thinking">
                <span className="spin">⚙️</span>
                <span>AI is reading the paper…</span>
              </div>
            )}

            {/* AI extracted result — awaiting approval */}
            {aiResults && !aiResults.error && !aiLoading && (
              <div className="card" style={{ border: `2px solid ${C.green}`, marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.green }}>✅ Insight Extracted — Review & Approve</div>
                </div>
                {/* Study type + model type badges */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {aiResults.studyType && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: ["meta_analysis","systematic_review","rct"].includes(aiResults.studyType) ? "#DCFAEE" : "#F3F4F6", color: ["meta_analysis","systematic_review","rct"].includes(aiResults.studyType) ? "#15774F" : "#6B7280" }}>{aiResults.studyType?.replace(/_/g," ")}</span>}
                  {aiResults.sampleSize > 0 && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#EFF6FF", color: "#2563A0" }}>n = {aiResults.sampleSize.toLocaleString()}</span>}
                  {aiResults.modelType && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, background: "#F3F4F6", color: "#6B7280" }}>{aiResults.modelType}</span>}
                </div>
                {aiResults.modelCaveat && (
                  <div style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 10, background: "#FEF3C7", border: "1px solid #FCD34D", fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
                    ⚠️ <strong>Model caveat:</strong> {aiResults.modelCaveat}
                  </div>
                )}
                {aiResults.contradictedBy && (
                  <div style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 10, background: "#FEE2E2", border: "1px solid #FCA5A5", fontSize: 12, color: "#991B1B", lineHeight: 1.5 }}>
                    🔄 <strong>Contradicted by:</strong> {aiResults.contradictedBy}
                  </div>
                )}
                {aiResults.relevantFor?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div className="small" style={{ marginBottom: 4 }}>Will activate for quiz tags:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {aiResults.relevantFor.map(t => <span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#E8F2FA", color: "#2563A0" }}>{t}</span>)}
                    </div>
                  </div>
                )}
                {aiResults.contraindicates?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div className="small" style={{ marginBottom: 4 }}>Contraindicated for:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {aiResults.contraindicates.map(t => <span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#FEE2E2", color: "#DC2626" }}>{t}</span>)}
                    </div>
                  </div>
                )}
                {/* Editable preview */}
                {[
                  ["Fibre", <select className="inp" value={aiResults.fibreId||""} onChange={e => setAiResults(r => ({ ...r, fibreId: e.target.value }))}><option value="">Select…</option>{FIBRES.map(f => <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>)}</select>],
                  ["Condition", <input className="inp" value={aiResults.condition||""} onChange={e => setAiResults(r => ({ ...r, condition: e.target.value }))} />],
                  ["Summary", <textarea className="inp" rows={3} style={{ resize: "none" }} value={aiResults.summary||""} onChange={e => setAiResults(r => ({ ...r, summary: e.target.value }))} />],
                  ["Citation", <input className="inp" value={aiResults.citation||""} onChange={e => setAiResults(r => ({ ...r, citation: e.target.value }))} />],
                ].map(([label, input]) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <div className="small" style={{ marginBottom: 4 }}>{label}</div>
                    {input}
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div className="small" style={{ marginBottom: 6 }}>Direction</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["positive","negative","neutral"].map(d => <button key={d} className={`tog${(aiResults.direction||"positive")===d?" on":""}`} style={{ flex: 1, fontSize: 11 }} onClick={() => setAiResults(r => ({ ...r, direction: d }))}>{d}</button>)}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="small" style={{ marginBottom: 6 }}>Confidence</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["low","medium","high"].map(d => <button key={d} className={`tog${(aiResults.confidence||"medium")===d?" on":""}`} style={{ flex: 1, fontSize: 11 }} onClick={() => setAiResults(r => ({ ...r, confidence: d }))}>{d}</button>)}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-g" style={{ flex: 2 }} onClick={() => { addInsight(aiResults); setAiResults(null); setAbstractText(""); setUrlInput(""); setLibTab("library"); }}>✓ Add to Library</button>
                  <button className="btn btn-s" style={{ flex: 1 }} onClick={() => setAiResults(null)}>Discard</button>
                </div>
              </div>
            )}
            {aiResults?.error && !aiLoading && (
              <div style={{ padding: 14, borderRadius: 12, background: "#FDECEA", color: "#C0392B", fontSize: 13, marginTop: 12 }}>
                ⚠️ Couldn't extract an insight from that source. Try a different URL or paste the abstract manually.
              </div>
            )}
          </>}

          {/* ── SEARCH TAB ── */}
          {libTab === "search" && <>
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 500, marginBottom: 6 }}>Search for Evidence</div>
              <div className="small" style={{ marginBottom: 10 }}>Describe what you're looking for. AI will search PubMed and scientific sources and return relevant papers for you to review.</div>
              <input className="inp" placeholder="e.g. psyllium husk IBS constipation RCT…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && searchPapers(searchQuery)} />
              <button className="btn btn-p" style={{ marginTop: 10 }} onClick={() => searchPapers(searchQuery)} disabled={!searchQuery.trim() || aiLoading}>
                {aiLoading ? "Searching…" : "🔍 Search Papers →"}
              </button>
            </div>

            {aiLoading && <div className="ai-thinking"><span className="spin">⚙️</span><span>Searching peer-reviewed literature…</span></div>}

            {aiSearchResults.length > 0 && !aiLoading && <>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: C.muted }}>{aiSearchResults.length} papers found — tap to add any to your library</div>
              {aiSearchResults.map((paper, idx) => {
                const fibre = FIBRES.find(f => f.id === paper.fibreId);
                return (
                  <div className="insight-card" key={idx}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{paper.title || "Untitled"}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{paper.authors}{paper.year ? ` · ${paper.year}` : ""}{paper.journal ? ` · ${paper.journal}` : ""}</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                      {fibre && <span style={{ fontSize: 11, fontWeight: 600, background: C.gLight, color: C.green, padding: "2px 8px", borderRadius: 20 }}>{fibre.emoji} {fibre.name}</span>}
                      <span className={`direction-badge ${paper.direction === "positive" ? "dir-pos" : paper.direction === "negative" ? "dir-neg" : "dir-neu"}`}>
                        {paper.direction === "positive" ? "▲" : paper.direction === "negative" ? "▼" : "●"} {paper.direction}
                      </span>
                      <span className={`conf-badge conf-${paper.confidence}`}>{paper.confidence}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 10 }}>{paper.summary}</div>
                    <button className="btn btn-g" style={{ padding: "9px" }} onClick={() => { addInsight({ fibreId: paper.fibreId, condition: paper.condition, effect: paper.summary, direction: paper.direction, confidence: paper.confidence, summary: paper.summary, citation: paper.citation || paper.authors, year: paper.year }); setAiSearchResults(prev => prev.filter((_, i) => i !== idx)); }}>
                      + Add to Library
                    </button>
                  </div>
                );
              })}
            </>}
          </>}
        </>}
      </div>

      {/* ── Add Measurement Modal ── */}
      {measureModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setMeasureModal(false); }}>
          <div className="modal-sheet">
            {/* Handle bar */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 20px" }} />

            {measureSaved ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 10 }}>✅</div>
                <div className="serif" style={{ fontSize: 20 }}>Saved!</div>
              </div>
            ) : !measureMetric ? (
              <>
                <h3 className="serif" style={{ fontSize: 20, marginBottom: 4 }}>Add Measurement</h3>
                <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Which metric would you like to log?</p>
                {MEASURE_METRICS.map(m => (
                  <button key={m.key} className="metric-pick-btn" onClick={() => setMeasureMetric(m.key)}>
                    <span style={{ fontSize: 22 }}>{m.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{m.label}</div>
                      {bioReadings.filter(r => r.metric === m.key).length > 0 && (
                        <div className="small">
                          {bioReadings.filter(r => r.metric === m.key).length} reading{bioReadings.filter(r => r.metric === m.key).length !== 1 ? "s" : ""} logged
                        </div>
                      )}
                    </div>
                    <span style={{ color: C.accent }}>→</span>
                  </button>
                ))}
              </>
            ) : (() => {
              const m = MEASURE_METRICS.find(x => x.key === measureMetric);
              const recentReadings = bioReadings.filter(r => r.metric === measureMetric).slice(0, 3);
              return (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.muted }} onClick={() => setMeasureMetric(null)}>←</button>
                    <div>
                      <h3 className="serif" style={{ fontSize: 20 }}>{m.emoji} {m.label}</h3>
                      {recentReadings.length > 0 && (
                        <div className="small">
                          Last: {m.hasSecond && recentReadings[0].value2
                            ? recentReadings[0].value+"/"+recentReadings[0].value2
                            : recentReadings[0].value} {m.unit}
                          · {new Date(recentReadings[0].date).toLocaleDateString([],{month:"short",day:"numeric"})}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontWeight: 500, marginBottom: m.hasSecond ? 6 : 8 }}>
                      {m.hasSecond ? "Systolic" : m.label}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input
                        className="inp"
                        type="number"
                        step={m.step}
                        placeholder={m.placeholder}
                        value={measureValue}
                        onChange={e => setMeasureValue(e.target.value)}
                        autoFocus
                        style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", textAlign: "center", flex: 1 }}
                      />
                      <span style={{ fontWeight: 500, color: C.muted, minWidth: 48 }}>{m.unit}</span>
                    </div>
                    {m.hasSecond && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontWeight: 500, marginBottom: 8 }}>{m.label2}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <input
                            className="inp"
                            type="number"
                            step={m.step}
                            placeholder={m.placeholder2}
                            value={measureValue2}
                            onChange={e => setMeasureValue2(e.target.value)}
                            style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", textAlign: "center", flex: 1 }}
                          />
                          <span style={{ fontWeight: 500, color: C.muted, minWidth: 48 }}>{m.unit}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>Date</div>
                    <input className="inp" type="date" value={measureDate} onChange={e => setMeasureDate(e.target.value)} />
                  </div>

                  {/* Recent readings mini-list */}
                  {recentReadings.length > 0 && (
                    <div style={{ marginBottom: 18, padding: "10px 12px", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}` }}>
                      <div className="small" style={{ marginBottom: 6 }}>Recent readings</div>
                      {recentReadings.map(r => (
                        <div key={r.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                          <span style={{ fontWeight: 500, color: m.colour }}>{m.hasSecond && r.value2 ? r.value+"/"+r.value2 : r.value} {m.unit}</span>
                          <span className="small">{new Date(r.date).toLocaleDateString([],{day:"numeric",month:"short",year:"numeric"})}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="btn btn-p"
                    disabled={!measureValue || (m.hasSecond && !measureValue2)}
                    style={{ opacity: (!measureValue || (m.hasSecond && !measureValue2)) ? .4 : 1, marginBottom: 8 }}
                    onClick={addReading}>
                    Save Reading
                  </button>
                  <button className="btn" style={{ background: "none", color: C.muted, border: `1.5px solid ${C.border}` }} onClick={() => setMeasureModal(false)}>Cancel</button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── Hamburger Menu ── */}
      {menuOpen && (
        <>
          <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
          <div className="menu-panel">
            <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(145deg,#1C3249,#3B82C4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌿</div>
              <div>
                <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>FibreKit</div>
                <div className="small">Menu</div>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.muted, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {[
                { ico: "📋", bg: "#EFF6FF", label: "Download Report", sub: "PDF for your doctor", action: () => { setMenuOpen(false); generateFibreReport(); } },
                { ico: "🧫", bg: "#DCFAEE", label: "Run Experiment", sub: "Structured fibre trial", action: () => { setMenuOpen(false); setExpScreen("list"); setScreen("experiment"); } },
                { ico: "📚", bg: "#F3F4F6", label: "Research Library", sub: "Scientific insights", action: () => { setMenuOpen(false); adminUnlocked ? setScreen("admin") : setScreen("admin_pin"); } },
                { ico: "📅", bg: "#FEF3C7", label: "Unified Calendar", sub: "All data in one view", action: () => { setMenuOpen(false); setScreen("calendar"); } },
                { ico: "👤", bg: "#F0EBF8", label: "My Profile", sub: "Biometrics & goals", action: () => { setMenuOpen(false); setScreen("profile"); } },
              ].map(({ ico, bg, label, sub, action }) => (
                <button key={label} className="menu-item" onClick={action}>
                  <div className="menu-item-ico" style={{ background: bg }}>{ico}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{label}</div>
                    <div className="small">{sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ padding: "16px 20px", borderTop: "1px solid #F3F4F6" }}>
              <div className="small" style={{ textAlign: "center" }}>FibreKit · All data stays on your device</div>
              <button onClick={() => {
                if (window.confirm("Clear all data? This cannot be undone.")) {
                  localStorage.removeItem("fibrekit_v1");
                  window.location.reload();
                }
              }} style={{ display: "block", width: "100%", marginTop: 10, padding: "8px", background: "none", border: "1px solid #FCA5A5", borderRadius: 8, color: "#DC2626", fontSize: 12, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                Clear all data
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Glossary Popover ── */}
      {glossOpen && (() => {
        const entry = GLOSSARY[glossOpen];
        if (!entry) return null;
        return (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setGlossOpen(null)} />
            <div className="gloss-popover" style={{ left: glossPos.x, top: glossPos.y }}>
              <span className="gloss-popover-close" onClick={() => setGlossOpen(null)}>×</span>
              <div className="gloss-popover-title">{entry.term}</div>
              <div className="gloss-popover-body">{entry.def}</div>
            </div>
          </>
        );
      })()}

      {/* ── Bottom Nav ── */}
      {screen !== "poop" && (
        <div className="bnav">
          <div className="bnav-in">
            {[
              { id: "home",      ico: "🏠", lbl: "Home",     action: () => setScreen("home") },
              { id: "poop",      ico: "💩", lbl: "Toilet",   action: startSession },
              { id: "water",     ico: "💧", lbl: "Water",    action: () => setScreen("water") },
              { id: "exp_quiz",  ico: "🧪", lbl: "My Exp",   action: startExpQuiz },
              { id: "symptoms",  ico: "🫧", lbl: "Symptoms", action: () => { setSymForm({ symptoms: [], severity: {}, notes: "", time: fmtTimeNow() }); setScreen("symptoms"); } },
              { id: "admin_pin", ico: adminUnlocked ? "🔬" : "🔒", lbl: adminUnlocked ? "Library" : "Admin", action: () => adminUnlocked ? setScreen("admin") : setScreen("admin_pin") },
            ].map(n => (
              <button key={n.id} className={`nb${screen===n.id||(screen==="admin"&&n.id==="admin_pin")?" on":""}`} onClick={n.action}>
                <span className="ico">{n.ico}</span>
                <span>{n.lbl}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
