// Nastavení Herní police. Tady můžeš cokoli upravit bez sahání do zbytku kódu.

// Uživatel na BoardGameGeek, jehož kolekce se zobrazuje.
// (Lze přepsat proměnnou BGG_USER v GitHubu.)
export const BGG_USER = "JakSeRodi";

// Které hry z kolekce brát: jen ty označené „Own“ (vlastním).
export const ONLY_OWNED = true;

// Hry, které se označí jako „české“ (filtr Jen české hry).
export const CZ_PUBLISHERS = ["Czech Games Edition"];
export const CZ_DESIGNERS = [
  "Vlaada Chvátil", "Vladimír Suchý", "Michaela Štachová", "Michal Štach", "Petr Mikša",
  "Jindřich Pavlásek", "Tomáš Holek", "Filip Neduk", "Adam Španěl", "Ondřej Bystroň",
  "Petr Čáslava", "Jiří Bauma", "Jan Zach", "Michal Požárek", "Petr Vojtěch",
];
// Sem můžeš doplnit BGG ID her, které chceš označit jako české ručně.
export const CZ_EXTRA_IDS = [];

// Překlad kategorií z BGG do češtiny.
export const CATEGORIES = {
  "Abstract Strategy": "Abstraktní", "Action / Dexterity": "Obratnost", "Adventure": "Dobrodružná",
  "Age of Reason": "Osvícenství", "American Civil War": "Americká občanská válka",
  "American Indian Wars": "Indiánské války", "American Revolutionary War": "Americká revoluce",
  "American West": "Divoký západ", "Ancient": "Starověk", "Animals": "Zvířata", "Arabian": "Orient",
  "Aviation / Flight": "Letectví", "Bluffing": "Blafování", "Book": "Kniha", "Card Game": "Karetní",
  "Children's Game": "Pro děti", "City Building": "Stavba měst", "Civil War": "Občanská válka",
  "Civilization": "Civilizace", "Collectible Components": "Sběratelská", "Comic Book / Strip": "Komiks",
  "Deduction": "Dedukce", "Dice": "Kostky", "Economic": "Ekonomická", "Educational": "Vzdělávací",
  "Electronic": "Elektronická", "Environmental": "Životní prostředí", "Exploration": "Průzkum",
  "Fan Expansion": "Fanouškovské rozšíření", "Fantasy": "Fantasy", "Farming": "Farmaření",
  "Fighting": "Souboje", "Game System": "Herní systém", "Horror": "Horor", "Humor": "Humor",
  "Industry / Manufacturing": "Průmysl", "Korean War": "Korejská válka", "Mafia": "Mafie",
  "Math": "Matematika", "Mature / Adult": "Pro dospělé", "Maze": "Bludiště", "Medical": "Medicína",
  "Medieval": "Středověk", "Memory": "Paměťová", "Miniatures": "Figurky", "Modern Warfare": "Moderní válka",
  "Movies / TV / Radio theme": "Film a TV", "Murder / Mystery": "Vražda a záhada", "Music": "Hudba",
  "Mythology": "Mytologie", "Napoleonic": "Napoleonské války", "Nautical": "Námořní",
  "Negotiation": "Vyjednávání", "Novel-based": "Podle knihy", "Number": "Čísla", "Party Game": "Party",
  "Pike and Shot": "Raný novověk", "Pirates": "Piráti", "Political": "Politická",
  "Post-Napoleonic": "19. století", "Prehistoric": "Pravěk", "Print & Play": "Print & Play",
  "Puzzle": "Hádanka", "Racing": "Závodní", "Real-time": "V reálném čase", "Religious": "Náboženství",
  "Renaissance": "Renesance", "Science Fiction": "Sci-fi", "Space Exploration": "Vesmír",
  "Spies / Secret Agents": "Špioni", "Sports": "Sport", "Territory Building": "Budování území",
  "Trains": "Vlaky", "Transportation": "Doprava", "Travel": "Cestování", "Trivia": "Kvízová",
  "Video Game Theme": "Podle videohry", "Vietnam War": "Válka ve Vietnamu", "Wargame": "Válečná",
  "Word Game": "Slovní", "World War I": "1. světová válka", "World War II": "2. světová válka",
  "Zombies": "Zombie",
};

// Vybrané herní mechaniky, které se přidají mezi kategorie (styl hry).
export const MECHANICS = {
  "Cooperative Game": "Kooperativní", "Semi-Cooperative Game": "Polokooperativní",
  "Team-Based Game": "Týmová", "Deck, Bag, and Pool Building": "Stavba balíčku",
  "Worker Placement": "Rozmisťování dělníků", "Legacy Game": "Legacy",
  "Scenario / Mission / Campaign Game": "Kampaň", "Solo / Solitaire Game": "Sólo",
  "Tile Placement": "Kladení dílků", "Open Drafting": "Draft", "Closed Drafting": "Draft",
  "Area Majority / Influence": "Ovládání území", "Hidden Roles": "Skryté role", "Traitor Game": "Zrádce",
  "Trick-taking": "Zdvihová", "Push Your Luck": "Pokoušení štěstí", "Paper-and-Pencil": "Kreslení",
  "Real-Time": "V reálném čase", "Engine Building": "Budování motoru",
};

// Kategorie, které se nezobrazují (nic neříkají o hře).
export const HIDE_CATEGORIES = ["Expansion for Base-game", "Print & Play", "Fan Expansion", "Game System"];
