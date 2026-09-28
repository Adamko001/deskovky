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

// Styl hry: vybrané mechaniky, které se ukazují jako rychlé štítky.
export const STYLE = {
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

// Nejlepší ve dvou / sólo se štítkuje automaticky podle hlasování komunity.

// Překlad všech herních mechanik (pokročilý filtr). Co tu není, zůstane anglicky.
export const MECH_CZ = {
  "Acting": "Předvádění", "Action Drafting": "Draft akcí", "Action Points": "Akční body",
  "Action Queue": "Fronta akcí", "Action Retrieval": "Vracení akcí", "Action Timer": "Časovač akcí",
  "Area Majority / Influence": "Většina v oblastech", "Area Movement": "Pohyb po oblastech",
  "Area-Impulse": "Impulzy v oblastech", "Auction / Bidding": "Aukce", "Bag Building": "Stavba pytlíku",
  "Betting and Bluffing": "Sázky a blafování", "Bias": "Posun", "Bingo": "Bingo",
  "Campaign / Battle Card Driven": "Řízeno kartami", "Card Play Conflict Resolution": "Souboje kartami",
  "Catch the Leader": "Brzda vedoucího", "Chaining": "Řetězení", "Chit-Pull System": "Tahání žetonů",
  "Closed Drafting": "Uzavřený draft", "Closed Economy Auction": "Uzavřená aukce",
  "Command Cards": "Rozkazové karty", "Communication Limits": "Omezená komunikace",
  "Connections": "Propojování", "Constrained Bidding": "Omezené přihazování",
  "Contracts": "Zakázky", "Cooperative Game": "Kooperace", "Crayon Rail System": "Kreslení tratí",
  "Critical Hits and Failures": "Kritické zásahy", "Cube Tower": "Kostková věž",
  "Deck Construction": "Skládání balíčku", "Deck, Bag, and Pool Building": "Stavba balíčku",
  "Deduction": "Dedukce", "Delayed Purchase": "Odložený nákup", "Dice Rolling": "Házení kostkami",
  "Different Dice Movement": "Pohyb různými kostkami", "Drawing": "Kreslení",
  "Elapsed Real Time Ending": "Konec po uplynutí času", "Enclosure": "Uzavírání území",
  "End Game Bonuses": "Bonusy na konci hry", "Events": "Události", "Finale Ending": "Závěrečné finále",
  "Flicking": "Cvrnkání", "Follow": "Následování", "Force Commitment": "Nasazení sil",
  "Grid Coverage": "Pokrývání mřížky", "Grid Movement": "Pohyb po mřížce", "Hand Management": "Správa karet v ruce",
  "Hexagon Grid": "Šestiúhelníková mapa", "Hidden Movement": "Skrytý pohyb", "Hidden Roles": "Skryté role",
  "Hidden Victory Points": "Skryté body", "Highest-Lowest Scoring": "Bodování nejslabšího",
  "Hot Potato": "Horký brambor", "I Cut, You Choose": "Já dělím, ty vybíráš", "Income": "Příjem",
  "Increase Value of Unchosen Resources": "Rostoucí hodnota nevybraného", "Induction": "Indukce",
  "Investment": "Investice", "Kill Steal": "Kradení zásahů", "King of the Hill": "Král kopce",
  "Ladder Climbing": "Přebíjení", "Layering": "Vrstvení", "Legacy Game": "Legacy",
  "Line Drawing": "Kreslení čar", "Line of Sight": "Přímá viditelnost", "Loans": "Půjčky",
  "Lose a Turn": "Ztráta tahu", "Mancala": "Mankala", "Map Addition": "Rozšiřování mapy",
  "Map Deformation": "Proměna mapy", "Map Reduction": "Zmenšování mapy", "Market": "Trh",
  "Matching": "Párování", "Measurement Movement": "Pohyb s metrem", "Melding and Splaying": "Vykládání sestav",
  "Memory": "Paměť", "Minimap Resolution": "Minimapy", "Modular Board": "Modulární plán",
  "Move Through Deck": "Průchod balíčkem", "Movement Points": "Body pohybu", "Movement Template": "Šablona pohybu",
  "Moving Multiple Units": "Pohyb více jednotek", "Multi-Use Cards": "Víceúčelové karty",
  "Multiple Maps": "Více map", "Narrative Choice / Paragraph": "Příběhové volby", "Negotiation": "Vyjednávání",
  "Neighbor Scope": "Vliv na sousedy", "Network and Route Building": "Stavba sítí a tras",
  "Once-Per-Game Abilities": "Jednorázové schopnosti", "Open Drafting": "Otevřený draft",
  "Order Counters": "Rozkazové žetony", "Ownership": "Vlastnictví", "Paper-and-Pencil": "Papír a tužka",
  "Passed Action Token": "Předávaný žeton akce", "Pattern Building": "Skládání vzorů",
  "Pattern Movement": "Pohyb podle vzoru", "Pattern Recognition": "Rozpoznávání vzorů",
  "Physical Removal": "Fyzické odstraňování", "Pick-up and Deliver": "Vyzvednutí a doručení",
  "Pieces as Map": "Figurky jako mapa", "Player Elimination": "Vyřazování hráčů",
  "Player Judge": "Hráč jako soudce", "Point to Point Movement": "Pohyb z bodu do bodu",
  "Points to Spend": "Body k utracení", "Prisoner's Dilemma": "Vězňovo dilema",
  "Programmed Movement": "Programování tahů", "Push Your Luck": "Pokoušení štěstí",
  "Race": "Závod", "Random Production": "Náhodná produkce", "Ratio / Combat Results Table": "Tabulka boje",
  "Re-rolling and Locking": "Přehazování a zamykání", "Real-Time": "V reálném čase",
  "Relative Movement": "Relativní pohyb", "Resource to Move": "Suroviny za pohyb", "Rock-Paper-Scissors": "Kámen-nůžky-papír",
  "Role Playing": "Hraní rolí", "Roles with Asymmetric Information": "Role s nerovnými informacemi",
  "Roll / Spin and Move": "Hoď a táhni", "Rondel": "Rondel", "Scenario / Mission / Campaign Game": "Scénáře a kampaň",
  "Score-and-Reset Game": "Bodování s resetem", "Secret Unit Deployment": "Tajné rozmístění",
  "Selection Order Bid": "Aukce o pořadí", "Semi-Cooperative Game": "Polokooperace", "Set Collection": "Sbírání sad",
  "Simulation": "Simulace", "Simultaneous Action Selection": "Současná volba akcí", "Singing": "Zpěv",
  "Single Loser Game": "Jeden poražený", "Slide/Push": "Posouvání", "Solo / Solitaire Game": "Sólo hra",
  "Speed Matching": "Rychlé párování", "Spelling": "Hláskování", "Square Grid": "Čtvercová mřížka",
  "Stacking and Balancing": "Stavění a balancování", "Stat Check Resolution": "Test vlastností",
  "Static Capture": "Statické zajetí", "Stock Holding": "Akcie", "Storytelling": "Vyprávění",
  "Sudden Death Ending": "Náhlý konec", "Tags": "Štítky", "Take That": "Škodolibé útoky",
  "Targeted Clues": "Cílené nápovědy", "Team-Based Game": "Týmová hra", "Tech Trees / Tech Tracks": "Technologie",
  "Three Dimensional Movement": "Pohyb ve 3D", "Tile Placement": "Kladení dílků", "Track Movement": "Pohyb po stopě",
  "Trading": "Obchodování", "Traitor Game": "Zrádce", "Trick-taking": "Zdvihy", "Tug of War": "Přetahovaná",
  "Turn Order: Auction": "Pořadí aukcí", "Turn Order: Claim Action": "Pořadí zabráním",
  "Turn Order: Pass Order": "Pořadí podle pasu", "Turn Order: Progressive": "Postupné pořadí",
  "Turn Order: Random": "Náhodné pořadí", "Turn Order: Role Order": "Pořadí podle rolí",
  "Turn Order: Stat-Based": "Pořadí podle stavu", "Variable Phase Order": "Proměnlivé fáze",
  "Variable Player Powers": "Asymetrické schopnosti", "Variable Set-up": "Proměnlivá příprava",
  "Victory Points as a Resource": "Body jako surovina", "Voting": "Hlasování", "Worker Placement": "Rozmisťování dělníků",
  "Worker Placement with Dice Workers": "Dělníci z kostek", "Worker Placement, Different Worker Types": "Různé typy dělníků",
  "Zone of Control": "Zóna kontroly",
};
