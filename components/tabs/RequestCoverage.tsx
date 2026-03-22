"use client";

import { useState } from "react";

const AIRLINES = [
  "9 Air","Aegean Airlines","Aer Lingus","Aeroflot Russian Airlines","Aerolineas Argentinas",
  "Aeromexico","Air Algerie","Air Arabia","Air Astana","Air Botswana","Air Busan","Air Cambodia",
  "Air Canada","Air Canada rouge","Air Caraibes","Air China","Air Dolomiti","Air Europa",
  "Air France","Air India","Air India Express","Air Macau","Air Madagascar","Air Malta",
  "Air Mauritius","Air Moldova","Air Namibia","Air New Zealand","Air Niugini","Air Nostrum",
  "Air Serbia","Air Seychelles","Air Tahiti Nui","Air Transat","Air Vanuatu","AirAsia",
  "AirAsia X","AirAsia India","airBaltic","airblue","Aircalin","Alaska Airlines","Allegiant Air",
  "American Airlines","ANA All Nippon Airways","AnadoluJet","Arik Air","Asiana Airlines",
  "Austrian Airlines","Avianca","Azerbaijan Airlines","Azul Brazilian Airlines","Bahamasair",
  "Bamboo Airways","Bangkok Airways","Batik Air","Belavia Belarusian Airlines",
  "Biman Bangladesh Airlines","Blue Air","Boliviana de Aviación","British Airways",
  "Brussels Airlines","Bulgaria Air","Cabo Verde Airlines","Capital Airlines","Caribbean Airlines",
  "Cathay Pacific Airways","Cayman Airways","Cebu Pacific","Chengdu Airlines","China Airlines",
  "China Eastern Airlines","China Express Airlines","China Southern Airlines",
  "China United Airlines","Chongqing Airlines","Citilink","Colorful Guizhou Airlines",
  "Condor Airlines","Copa Airlines","Corendon Airlines","Croatia Airlines","CSA Czech Airlines",
  "Dalian Airlines","Delta Air Lines","Discover Airlines","Donghai Airlines","Eastar Jet",
  "Easyfly","easyJet","Edelweiss Air","Egyptair","El Al Israel Airlines","Emirates",
  "Ethiopian Airlines","Etihad Airways","Eurowings","EVA Air","fastjet","Fiji Airways",
  "Finnair","Flair Airlines","Flyadeal","FlyArystan","flydubai","flynas","FlyOne","FlySafair",
  "French Bee","Frontier Airlines","Fuzhou Airlines","Garuda Indonesia","GoAir","GOL Airlines",
  "Gulf Air","GX Airlines (Beibu Gulf Air)","Hainan Airlines","Hawaiian Airlines",
  "Hebei Airlines","Hong Kong Airlines","HK Express","Iberia","Icelandair","IndiGo",
  "Interjet","ITA Airways","Japan Airlines","Jazeera Airways","Jeju Air","Jet2.com",
  "JetBlue Airways","Jetstar Airways","Jetstar Asia Airways","Jiangxi Airlines","Jin Air",
  "Juneyao Airlines","Kenya Airways","KLM Royal Dutch Airlines","Korean Air","Kulula",
  "Kunming Airlines","Kuwait Airways","La Compagnie","LAM Mozambique Airlines","Lao Airlines",
  "LATAM Airlines","Lion Air","LOT Polish Airlines","Loong Air","Lucky Air","Lufthansa",
  "Luxair","Malaysia Airlines","Malindo Air","Mandarin Airlines","Mango",
  "MIAT Mongolian Airlines","Middle East Airlines","Myanmar Airways International",
  "Myanmar National Airlines","Nile Air","Nok Air","Norwegian","Nouvelair","Okay Airways",
  "Oman Air","Onur Air","Peach Aviation","Pegasus Airlines","Philippine Airlines",
  "PIA Pakistan International Airlines","Porter Airlines","Qantas Airways","Qatar Airways",
  "Qingdao Airlines","Royal Air Maroc","Royal Brunei Airlines","Royal Jordanian Airlines",
  "Ruili Airlines","Rwandair","Ryanair","S7 Siberia Airlines","SAS Scandinavian Airlines",
  "SATA Azores Airlines","Saudi Arabian Airlines","Scoot","Shandong Airlines",
  "Shenzhen Airlines","Sichuan Airlines","SilkAir","Silver Airways","Singapore Airlines",
  "SKY Airline","Skymark Airlines","Solaseed Air","South African Airways","Southwest Airlines",
  "SpiceJet","Spirit Airlines","Spring Airlines","SriLankan Airlines","Sriwijaya Air",
  "Star Flyer","STARLUX Airlines","Sun Country Airlines","SunExpress","Sunwing Airlines",
  "Swiss International Air Lines","Swoop","TAP Portugal","TAROM","Thai Airways",
  "Tianjin Airlines","Transavia France","Transavia","TUI Airways","Tunisair",
  "Turkish Airlines","T'way Air","United Airlines","Ural Airlines","Urumqi Air",
  "VietJet Air","Vietnam Airlines","Virgin Atlantic","Virgin Australia","Vistara",
  "Viva Aerobus","Viva Air","Volaris","Volotea","Vueling Airlines","West Air",
  "WestJet Airlines","Wizz Air","Xiamen Airlines",
];

const AIRPORTS = [
  "A Coruña","A.N.R. Robinson International","Aalborg","Aarhus","Abadan International",
  "Abakan International","Abbotsford International","Abdullahi Yusuf",
  "Abeid Amani Karume International","Abel Santamaría","Aberdeen","Abha International",
  "Abruzzo","Abu Dhabi International","Acapulco International","Accra International",
  "Addis Ababa Bole International","Adelaide","Aden Adde International","Aden International",
  "Adisoemarmo International","Adnan Menderes","Aeroparque Jorge Newbery",
  "Afonso Pena International","Agadir–Al Massira","Agostinho-Neto International",
  "Aguascalientes International","Ahvaz International","Ain Arnat",
  "Ajaccio Napoleon Bonaparte","Aji Pangeran Tumenggung Pranoto International",
  "Akanu Ibiam International","Akita","Akron Executive","Aktau","Aktion National",
  "Aktobe International","Akureyri","Al Ain International","Al Jawf International",
  "Al Maktoum International","Al Najaf International","Al Qaisumah International",
  "Al-Ahsa International","Albany International","Albrook \"Marcos A. Gelabert\" International",
  "Albuquerque International Sunport","Alderney","Alejandro Velasco Astete International",
  "Aleppo International","Ålesund","Alexandria International",
  "Alfonso Bonilla Aragón International","Alfonso López Pumarejo",
  "Alfredo Vásquez Cobo International","Alguaire","Alicante–Elche Miguel Hernández",
  "Allama Iqbal International","Almaty International","Almería","Almirante Marcos A. Zar",
  "Almirante Padilla","Alpes–Isère","Al-Ula International","Amborovy",
  "Amílcar Cabral International","Amsterdam","Anapa","Anchorage International","Ancona",
  "Andizhan","Andrés Sabella Gálvez International","Angads","Antalya",
  "Antonio B. Won Pat International","Antonio Maceo","Antonio Nariño",
  "Antwerp International","Aomori","Appleton International","Arad International",
  "Arak International","Ardabil","Åre Östersund","Argyle International",
  "Aristides Pereira International","Arrachart","Arturo Merino Benítez International",
  "Arturo Michelena International","Arua","Arusha","Asaba International","Ashgabat",
  "Asmara International","Assiut","Ástor Piazzolla International","Asturias",
  "Aswan International","Atar International","Athens International",
  "Atlantic City International","Atyrau","Auckland","Augusto C. Sandino International",
  "Aurel Vlaicu International","Austin–Bergstrom International",
  "Ayatollah Hashemi Rafsanjani","Bacha Khan International","Bagdogra International",
  "Baghdad International","Bahawalpur","Bahías de Huatulco International",
  "Bahrain International","Baikal International","Baltimore/Washington International",
  "Bandar Abbas International","Bandaranaike International","Bangor International",
  "Bangui M'Poko International","Banja Luka International","Banjul International",
  "Baotou Donghe international","Barisal","Barnaul","Basra International","Batna",
  "Batten International","Batticaloa International","Batumi International",
  "Baudette International","Bauerfield International","Beauvais–Tillé","Begishevo",
  "Beihai Fucheng","Beijing Capital International","Beijing Daxing International","Beira",
  "Beirut–Rafic Hariri International","Beja","Belfast International",
  "Belgorod International","Belgrade Nikola Tesla","Bellingham International","Ben Gurion",
  "Beni Mellal","Benina International","Benito Salas","Bergen",
  "Bergerac Dordogne Périgord","Berlin Brandenburg","Bern","Beslan",
  "Béziers Cap d'Agde","Biarritz Pays Basque","Bicol International",
  "Biju Patnaik International","Bilbao","Bill and Hillary Clinton National","Billund",
  "Billy Bishop Toronto City","Birjand International","Birmingham",
  "Birmingham–Shuttlesworth International","Birsa Munda","Biskra",
  "Blaise Diagne International","Bluefields","Boa Vista International","Bobo Dioulasso",
  "Bocas del Toro \"Isla Colón\" International","Bodø","Bogashevo",
  "Bohol–Panglao International","Boise","Bokeo International","Bokhtar International",
  "Bologna","Bonriki International","Bordeaux–Mérignac","Boryspil International",
  "Bosaso","Bournemouth","Brač","Bradley International","Bram Fischer International",
  "Brasília International","Brașov-Ghimbav International","Bratislava","Bratsk","Bremen",
  "Brescia","Brest Bretagne","Brigadier General Antonio Parodi International","Brindisi",
  "Brisbane","Bristol","Brno–Tuřany","Broome International",
  "Brownsville/South Padre Island International","Brunei International","Brussels",
  "Brussels South Charleroi","Bryansk International","Bucholz Army Airfield",
  "Budapest Ferenc Liszt International","Buffalo Niagara International",
  "Bujumbura International","Bukhara International","Burgas","Bushehr",
  "Bydgoszcz Ignacy Jan Paderewski","Cabo San Lucas International","Cadjehoun",
  "Cagayan North International","Cagliari","Cairns","Cairo International",
  "Calexico International","Calgary International","Calicut International",
  "Cam Ranh International","Camilo Daza International","Campo Grande International",
  "Can Tho International","Canberra","Cancún International","Canouan",
  "Cape Town International","Cap-Haïtien International","Capital Region International",
  "Capitán de Corbeta Carlos A. Curbelo International","Carcassonne","Cardiff",
  "Carlos Concha Torres International","Carlos Martínez de Pinillos International",
  "Carrasco International","Carriel Sur International","Caselle","Cassidy International",
  "Castellón–Costa Azahar","Cat Bi International","Cataratas del Iguazú International",
  "Catumbela","Cayenne – Félix Eboué","Cesária Évora","České Budějovice",
  "Chabahar Konarak","Châlons Vatry","Chambéry","Changchun Longjia International",
  "Changi","Changsha Huanghua International","Changzhou Benniu International",
  "Chania International","Charles de Gaulle","Charles Kirkconnell International",
  "Charleston International","Charlotte Douglas International","Charlottetown",
  "Chaudhary Charan Singh International","Cheboksary International",
  "Cheddi Jagan International","Chelyabinsk","Chengdu Shuangliu International",
  "Chengdu Tianfu International","Chennai International","Cheongju International",
  "Cherepovets","Chernivtsi International","Chhatrapati Shivaji Maharaj International",
  "Chiang Mai International","Chiang Rai International","Chicago Rockford International",
  "Chihuahua International","Chileka International","Chinggis Khaan International",
  "Chingozi","Chios Island National","Chișinău International","Chita-Kadala International",
  "Chlef International","Chongqing Jiangbei International","Christchurch",
  "Christmas Island","Chu Lai","Chub Cay International","Chubu Centrair International",
  "Chuuk International","Cibao International","Cincinnati/Northern Kentucky International",
  "City of Derry","Ciudad del Carmen International","Clark International",
  "Clayton J. Lloyd International","Cleveland Hopkins International",
  "Cluj-Napoca International","Cochin International","Cocos (Keeling) Islands",
  "Coimbatore International","Cologne/Bonn","Columbia Metropolitan",
  "Comandante Armando Tola International","Comayagua International",
  "Conakry International","Copenhagen","Corfu International","Cork","Corn Island",
  "Corpus Christi International","Costa Smeralda","Cox's Bazar International",
  "Cozumel International","Craiova International","Cristoforo Colombo",
  "Culiacán International","Cuneo Levaldigi","Curaçao International","Cyril E. King",
  "Da Nang International","Dabolim","Daegu International","Dakhla","Dalaman",
  "Dalian Zhoushuizi International","Dallas Love Field","Dallas/Fort Worth International",
  "Damascus International","Dandong Langtou","Dane County Regional",
  "Daniel K. Inouye International","Daniel Oduber Quirós International","Daru",
  "Darwin International","Dasht-e Naz","Daşoguz","Datong Yungang",
  "Dayton International","Debrecen International","Deer Lake Regional","Dehong Mangshi",
  "Denizli Çardak","Denver International",
  "Deputado Luís Eduardo Magalhães International","Des Moines International",
  "Detroit Metropolitan","Devi Ahilya Bai Holkar","Dinard–Pleurtuit–Saint-Malo",
  "Diori Hamani International","Dire Dawa","Diyarbakır","Djerba–Zarzis International",
  "Djibouti–Ambouli International",
  "Doctor Fernando Piragine Niveyro International",
  "Domine Eduard Osok International","Domodedovo International",
  "Don Mueang International","Dortmund","Douala International","Douglas–Charles",
  "Dr. Babasaheb Ambedkar International","Dubai International","Dublin","Dubrovnik",
  "Dulles International","Duluth International","Dunedin","Dunhuang Mogao International",
  "Durango International","Dushanbe","Düsseldorf","Dzaoudzi–Pamandzi International",
  "East London","East Midlands","Edinburgh","Edmonton International",
  "Eduardo Gomes International","Egilsstaðir","Eindhoven","El Alamein International",
  "El Alcaraván","El Alto International","El Arish International","El Caraño",
  "El Dorado International","El Edén International","El Embrujo","El Palomar",
  "El Paso International","El Salvador International","El Tepual International",
  "Elazığ","Eldoret International","Elista","Eloy Alfaro International",
  "Enfidha–Hammamet International","Enrique Malek International","Enshi Xujiaping",
  "Entebbe International","Eppley Airfield","Erbil International","Ercan International",
  "Erhaç","Erie International","Erik Nielsen Whitehorse International","Erkilet",
  "Ernesto Cortissoz International","Esenboğa International","Essaouira-Mogador",
  "Eurico de Aguiar Salles","Euro Basel–Mulhouse–Freiburg","Exeter",
  "Exuma International","F. D. Roosevelt","Faa'a International",
  "Fabio Alberto León Bentley","Fairbanks International","Faisalabad International",
  "Faleolo International","Falls International","Farman Salmanov Surgut","Faro",
  "Fascene","Federico Fellini","Federico García Lorca Granada",
  "Felipe Ángeles International","Félix-Houphouët-Boigny International",
  "Fergana International","Fernando Luis Ribas Dominicci","Fertilia","Fès–Saïs",
  "Figari–Sud Corse","Flamingo International","Fontanarossa","Formosa International",
  "Fort Lauderdale–Hollywood International","Foz do Iguaçu International",
  "Francisco Bangoy International","Francistown International","Frank País","Frankfurt",
  "Frankfurt-Hahn","Fredericton International","Freetown International",
  "Fresno Yosemite International","Friedrichshafen","Friuli Venezia Giulia",
  "Fuaʻamotu International","Fuerteventura","Fukuoka","Funafuti International",
  "Fuzhou Changle International","Fuzuli International","Galileo Galilei",
  "Gan International","Gander International","Ganja International",
  "Ganzhou Huangjin","Garowe","Gary/Chicago International","Gatwick",
  "Gautam Buddha International","Gaya","Gazipaşa","Gdańsk Lech Wałęsa",
  "General Enrique Mosconi International","General Mitchell International",
  "General Santos International","Geneva","George Best Belfast City",
  "George Bush Intercontinental","George Enescu International",
  "Gerald R. Ford International","Gerardo Tobar López","Gibraltar International",
  "Gimhae International","Gimpo International","Girona-Costa Brava","Giuseppe Verdi",
  "Glasgow","Glasgow Prestwick","Gobernador Horacio Guzmán International","Gold Coast",
  "Golfo de Morrosquillo","Golosón International","Goma International","Gomel",
  "Gorgan International","Göteborg Landvetter",
  "Governador Jorge Teixeira de Oliveira International",
  "Governor Francisco Gabrielli International","Gran Canaria",
  "Grand Bahama International","Grantley Adams International","Graz",
  "Greater Moncton Roméo LeBlanc International","Greater Natal International",
  "Greater Rochester International","Green Bay–Austin Straubel International",
  "Greenville-Spartanburg International","Gregorio Luperón International",
  "Groningen Eelde","Grozny","Guadalajara International",
  "Guangzhou Baiyun International","Guaraní International","Guararapes International",
  "Guernsey","Guilin Liangjiang International","Guillermo León Valencia",
  "Guiyang Longdongbao International","Gulfport-Biloxi International","Gulu",
  "Gustaf III","Gustavo Artunduaga Paredes","Gustavo Rojas Pinilla International",
  "Gwadar International","Győr-Pér International","Gyumri Shirak International",
  "H.A.S. Hanandjoeddin International","Haifa","Haikou Meilan International",
  "Ha'il International","Hakodate","Halifax Stanfield International",
  "Halim Perdanakusuma International","Hamad International","Hamadan International",
  "Hamburg","Hamilton","Haneda","Hang Nadim International",
  "Hangzhou Xiaoshan International","Hanimaadhoo International","Hannover",
  "Harbin Taiping International","Hargeisa","Harrisburg International",
  "Harry Mwanga Nkumbula International","Harry Reid International",
  "Hartsfield–Jackson Atlanta International","Hassan I","Hat Yai International",
  "Haugesund","Hazrat Shahjalal International","Heathrow",
  "Hefei Xinqiao International","Heihe Aihui","Helsinki-Vantaa",
  "Henri Coandă International","Henry E. Rohlsen","Heraklion International",
  "Herat International","Hercílio Luz International","Hermes Quijada International",
  "Hermosillo International","Hévíz-Balaton","Hewanorra International",
  "Heydar Aliyev International","Hihifo","Hilo International","Hiroshima","Ho",
  "Hobart","Hohhot Baita International","Hong Kong International",
  "Honiara International","Horn Island","Hosea Kutako International",
  "Houari Boumediene","Hrodna","Huai'an Lianshui International","Hualien",
  "Huangshan Tunxi International","Huesca-Pirineos","Hulunbuir Hailar","Humberside",
  "Huntsville International","Hurghada International","I Gusti Ngurah Rai International",
  "Iași International","Ibiza","Ignacio Agramonte International","Ignatyevo","Ilam",
  "Iloilo International","Ilulissat","Imam Khomeini International","Imphal",
  "Incheon International","Indianapolis International","Indira Gandhi International",
  "Ingeniero Aeronáutico Ambrosio L.V. Taravella International","Inhambane",
  "Innsbruck","Inverness","Ireland West","Irkutsk","Isfahan International",
  "Islam Karimov Tashkent International","Islamabad International","Isle of Man",
  "Issyk-Kul International","Istanbul","Ivano-Frankivsk International",
  "Ivato International","Ixtapa-Zihuatanejo International",
  "JA Douglas McCurdy Sydney","Jackson–Medgar Wiley Evers International",
  "Jacksons International","Jacksonville International","Jaffna International",
  "Jaime González","Jaipur International","Jammu","Jardines del Rey",
  "Jeju International","Jenderal Ahmad Yani International","Jerez","Jersey",
  "Jiamusi Dongjiao","Jieyang Chaoshan International","Jijel Ferhat Abbas",
  "Jinan Yaoqiang International","Jinnah International","João Paulo II",
  "Johan Adolf Pengel International","John A. Osborne",
  "John C. Munro Hamilton International","John F. Kennedy International",
  "John Glenn Columbus International","John Wayne","Jomo Kenyatta International",
  "Jorge Chávez International","Jorge Isaacs","Jorge Wilstermann International",
  "José Joaquín de Olmedo International","José María Córdova International",
  "José Martí International","José Quiñones González International",
  "Josep Tarradellas Barcelona–El Prat","Joshua Mqabuko Nkomo International",
  "Juan Gualberto Gómez","Juan Manuel Gálvez International",
  "Juan Santamaría International","Juancho E. Yrausquin","Juanda International",
  "Juba International","Julius Nyerere International","Juneau International",
  "Kabul International","Kagoshima","Kalamata International","Kalibo International",
  "Kamloops","Kandahar International","Kangerlussuaq","Kannur International",
  "Kansai International","Kansas City International","Kaohsiung International",
  "Kapadokya","Karaganda","Karakol International","Karlovy Vary",
  "Karlsruhe/Baden-Baden","Karpathos Island National","Karshi","Kasane","Katowice",
  "Kaunas","Kavala International","Kazan","Kazi Nazrul Islam",
  "Kefalonia Island International","Keflavik International","Kelowna International",
  "Kempegowda International","Kenmore Air Harbor Seaplane Base",
  "Kenneth Kaunda International","Kerry","Kertajati International",
  "Ketchikan International","Key West International","Khabarovsk Novy",
  "Khan Jahan Ali","Kharkiv International","Khartoum International","Khrabrovo",
  "Khujand","Kigali International","Kilimanjaro International",
  "King Abdulaziz International","King Abdullah bin Abdulaziz International",
  "King County International","King Fahd International","King Hussein International",
  "King Khalid International","King Mswati III International",
  "King Shaka International","Kingston Norman Rogers",
  "Kisangani Bangoka International","Kish","Kismayo","Kissimmee Gateway",
  "Kisumu International","Kitakyushu","Kittilä","Klagenfurt","Kokshetau",
  "Koltsovo International","Komatsu","Komodo International","Komsomolsk-on-Amur",
  "Kona International","Konya","Kos International","Košice International",
  "Kosrae International","Kostanay","Kota Kinabalu International",
  "Krabi International","Kraków John Paul II International","Kristiansand Kjevik",
  "Kristiansund Kvernberget","Kruger Mpumalanga International",
  "Kryvyi Rih International","Kuala Lumpur International","Kualanamu International",
  "Kuching International","Kukës International Zayed","Kulob",
  "Kunming Changshui International","Kuopio","Kursk Vostochny",
  "Kutaisi International","Kuusamo","Kuwait International","Kyiv International",
  "Kyzylorda","L.F. Wade International","La Aurora International",
  "La Chinita International","La Florida","La Nubia","La Palma",
  "La Rochelle – Île de Ré","La Romana International","La Tontouta International",
  "La Vanguardia","Labuan International","Lachin International","LaGuardia",
  "Laguindingan International","Lajes","Lake Simcoe Regional",
  "Lakeland Linder International","Lal Bahadur Shastri","Lamerd","Lamezia Terme",
  "Langkawi International","Lankaran International","Lanseria International",
  "Lanzarote","Lanzhou Zhongchuan International","Laoag International",
  "Lappeenranta","Larestan International","Larnaca International",
  "Las Américas International","Las Brujas","Latakia International",
  "Leeds Bradford","Leipzig/Halle","Lennart Meri Tallinn",
  "León/Bajío International","Leonardo da Vinci–Fiumicino","Léon-Mba International",
  "Leoš Janáček","Lhasa Gonggar","Lianyungang Baitabu",
  "Libertador General José de San Martín","Liège","Lijiang Sanyi International",
  "Lille","Lilongwe International","Limoges – Bellegarde","Linate",
  "Linyi Qiyang","Linz","Lisbon","Liverpool John Lennon","Ljubljana Jože Pučnik",
  "Łódź Władysław Reymont","Logan International",
  "Lokpriya Gopinath Bordoloi International","Lombok International",
  "Lomé–Tokoin International","London City","London International",
  "London Southend","London Stansted","Loreto International",
  "Los Angeles International","Los Cabos International","Los Garzones","Lošinj",
  "Louis Armstrong New Orleans International","Louisville International",
  "Luang Prabang International","Lubango","Lubbock Preston Smith International",
  "Lübeck","Lublin","Lubumbashi International","Lugano",
  "Luis Muñoz Marín International","Luleå","Luoyang Beijiao","Luton","Luxembourg",
  "Luxor International","Lviv Danylo Halytskyi International",
  "Lynden Pindling International","Lyon–Saint-Exupéry","Maafaru International",
  "Maastricht Aachen","Macau International","Mactan–Cebu International","Madeira",
  "Madrid-Barajas","Madurai","Magnitogorsk International",
  "Maharaja Bir Bikram","Maharishi Valmiki International Ayodhya Dham",
  "Malabo International","Málaga","Malakal","Mallam Aminu Kano International",
  "Malmö","Malta International","Manas International","Manchester",
  "Mandalay International","Mangaluru International","Manohar International",
  "Manzhouli Xijiao","Maputo International","Maramureș",
  "Marechal Cunha Machado International","Marechal Rondon International",
  "Margaret Ekpo International","María Montez International",
  "Maribor Edvard Rusjan","Mariehamn","Mariscal Lamar International",
  "Mariscal Sucre International","Marrakesh Menara","Marsa Alam International",
  "Marseille Provence","Marsh Harbour International","Marshall Islands International",
  "Martín Miguel de Güemes International",
  "Martinique Aimé Césaire International","Mary International",
  "Mashhad International","Mataveri International","Matecaña International",
  "Mattala Rajapaksa International","Maun","Maurice Bishop International",
  "Maya-Maya","Mazar-i-Sharif International","Mazatlán International",
  "McAllen Miller International","McGhee Tyson","Mehrabad International",
  "Melbourne","Melbourne Orlando International","Memmingen","Memphis International",
  "Menorca","Mercedita International","Mérida International",
  "Mersa Matruh International","Mexicali International","Mexico City International",
  "Mfuwe","Miami International","Midland International Air and Space Port",
  "Midway International","Mihail Kogălniceanu International","Milan Malpensa",
  "Milas–Bodrum","Minangkabau International","Mineralnye Vody",
  "Ministro Pistarini International","Minneapolis/St. Paul International",
  "Minsk International","Mitiga International","Modibo Keita International",
  "Mohamed Boudiaf International","Mohammed V International","Moi International",
  "Monastir Habib Bourguiba International","Monterrey International",
  "Montréal–Trudeau International","Morava","Morelia International",
  "Moshoeshoe I International","Mostar International","Mosul International",
  "Mount Hagen","Muan International","Mudanjiang Hailang International",
  "Multan International","Mundo Maya International","Munich","Murmansk",
  "Murtala Muhammed International","Muscat International",
  "M'Vengue El Hadj Omar Bongo Ondimba International","Mwanza",
  "Mykolaiv International","Mykonos","Myrtle Beach International",
  "Mytilene International","Nadi International","Nador International","Nagasaki",
  "Naha","Najran Domestic","Nakhchivan","Nalchik","Namangan","Nampula",
  "Nanchang Changbei International","Nanjing Lukou International",
  "Nanning Wuxu International","Nantes Atlantique","Nantong Xingdong International",
  "Naples International","Narimanovo","Narita International","Narsarsuaq","Nashik",
  "Nashville International","Nasiriyah","Nauru International","Nausori International",
  "Navi Mumbai International","Navoiy International","Naypyidaw International",
  "N'Djamena International","N'djili","Nea Anchialos National",
  "Nelson Mandela International","Neom Bay","Netaji Subhas Chandra Bose International",
  "New Chitose","Newark Liberty International","Newcastle International",
  "Newport News/Williamsburg International","Newquay","Niagara Falls International",
  "Nice Côte d'Azur","Niigata","Nîmes–Alès–Camargue–Cévennes",
  "Ningbo Lishe International","Ninoy Aquino International",
  "Niš Constantine the Great","Niue International","Nizhnevartovsk",
  "Nnamdi Azikiwe International","Noi Bai International","Noida International",
  "Norfolk International","Norfolk Island","Norman Manley International","Norrköping",
  "North Eleuthera","Northwest Florida Beaches International","Norwich",
  "Nouadhibou International","Nouakchott–Oumtounsy International","Nukus","Nuremberg",
  "Nursultan Nazarbayev International","Nuuk","O. R. Tambo International",
  "Oakland International","Oaxaca International","Odesa International","Oğuzeli",
  "O'Hare International","Ohrid St. Paul the Apostle","Oita","Okayama",
  "Ölgii International","Olsztyn-Mazury","Omsk Tsentralny","Ontario International",
  "Oradea International","Oral Ak Zhol","Oran Es Senia",
  "Ordos Ejin Horo International","Orenburg Tsentralny","Orio al Serio",
  "Orlando International","Orlando Sanford International","Orly","Orsk","Osh",
  "Osijek","Oskemen","Oslo Gardermoen","Osmani International",
  "Ostend–Bruges International","Osvaldo Vieira International",
  "Ottawa Macdonald–Cartier International","Ouarzazate","Oulu",
  "Owen Roberts International","Pago Pago International","Paine Field",
  "Pakse International","Palanga International","Palermo","Palese",
  "Palm Beach International","Palm Springs International","Palma de Mallorca",
  "Palonegro International","Pamplona","Panama Pacifico International",
  "Paphos International","Pardubice","Pärnu","Paro International","Pashkovsky",
  "Pattimura International","Pau Pyrénées","Pavlodar","Pécs-Pogány International",
  "Pemba","Penang International","Pensacola International","Perales","Peretola",
  "Perm International","Perpignan–Rivesaltes","Persian Gulf","Perth","Petrolina",
  "Petropavl","Petrozavodsk","Philadelphia International",
  "Philip S. W. Goldson International","Phnom Penh International",
  "Phoenix Sky Harbor International","Phoenix–Mesa Gateway","Phu Bai International",
  "Phu Quoc International","Phuket International","Piarco International",
  "Piedmont Triad International","Piešťany",
  "Piloto Civil Norberto Fernández International","Pinto Martins International",
  "Pittsburgh International","Platov International","Playa de Oro International",
  "Plovdiv","Podgorica","Pohnpei International","Pointe Vele",
  "Pointe-à-Pitre International","Poitiers–Biard","Pokhara Regional International",
  "Polokwane International","Poltava","Poprad-Tatry","Poretta",
  "Port Harcourt International","Port Sudan New International",
  "Port-Gentil International","Portland International","Portland International Jetport",
  "Porto","Porto Santo","Portorož","Poznań–Ławica","Prempeh I International",
  "Presidente Carlos Ibáñez del Campo International",
  "Presidente Castro Pinto International",
  "Presidente Nicolau Lobato International","Presidente Perón International",
  "Prince Mohammad bin Abdulaziz International",
  "Prince Naif bin Abdulaziz International","Prince Said Ibrahim International",
  "Prince Sultan bin Abdulaziz","Princess Juliana International",
  "Pristina International","Providenciales","Provideniya Bay","Pskov",
  "Puebla International","Puerto Escondido International",
  "Puerto Princesa International","Puerto Vallarta International","Pula","Pulkovo",
  "Pune","Punta Cana International","Pyongyang International","Qabala International",
  "Qamishli","Qeshm International","Qingdao Jiaodong International",
  "Qinhuangdao Beidaihe","Qionghai Bo'ao International","Qiqihar Sanjiazi",
  "Quanzhou Jinjiang International","Quatro de Fevereiro",
  "Québec City Jean Lesage International","Queen Alia International",
  "Queen Beatrix International","Queenstown","Querétaro Intercontinental",
  "Quetta International","Rabah Bitat","Rabat–Salé","Radin Inten II International",
  "RAF Mount Pleasant","Rafael Hernández International","Rafael Núñez International",
  "Raja Bhoj","Rajiv Gandhi International","Raleigh–Durham International","Ramon",
  "Ramón Villeda Morales International","Rarotonga","Ras Al Khaimah International",
  "Rasht","Ratmalana","Red Sea International","Regina International",
  "Región de Murcia International","Region of Waterloo International",
  "Reno–Tahoe International","Resistencia International","Reus","Reykjavík",
  "Reynosa International","Rhode Island T. F. Green International",
  "Rhodes International","Richmond International","Rick Husband Amarillo International",
  "Rickenbacker International","Riga International","Rijeka",
  "Rio Branco International","Rio de Janeiro/Galeão International",
  "Rivera International","Riyan International","Robert Gabriel Mugabe International",
  "Robert L. Bradshaw International","Roberts International","Rochester International",
  "Rock Sound International","Rodez–Aveyron","Rodríguez Ballón International",
  "Roland Garros","Roman Tmetuchl International","Rome Ciampino",
  "Ronald Reagan Washington National","Rosario – Islas Malvinas International",
  "Roshchino International","Rota International","Rotterdam The Hague","Rovaniemi",
  "Rzeszów–Jasionka","Sabha","Sabiha Gökçen International",
  "Sacramento International","Sadiq Abubakar III International","Saidpur",
  "Saint Helena","Saint John","Saint-Étienne–Bouthéon","Saint-Pierre",
  "Saipan International","Şakirpaşa","Salalah International",
  "Salerno Costa d'Amalfi","Salgado Filho Porto Alegre International",
  "Salt Lake City International","Saltillo International","Salzburg",
  "Sam Ratulangi International","Samaná El Catey International",
  "Samara Kurumoch","Samarkand International","Samos International",
  "Samsun-Çarşamba","Samui","San Antonio International","San Bernardino International",
  "San Carlos de Bariloche","San Diego International","San Egidio",
  "San Francisco International","San Jose International","San Luis",
  "San Luis Potosí International","Sanaa International","Sandefjord Torp",
  "Sangster International","Sania Ramel","Santa Genoveva","Santa Maria",
  "Santa Rosa International","Santander","Santiago de Compostela",
  "Santo-Pekoa International","Santorini (Thira) International","Santos Dumont",
  "Sanya Phoenix International","São Paulo/Guarulhos International",
  "São Paulo–Congonhas","São Tomé International","Sarajevo International",
  "Sarasota–Bradenton International","Saratov Gagarin",
  "Sardar Vallabhbhai Patel International","Satu Mare International",
  "Savannah/Hilton Head International","Savannakhet","Savonlinna",
  "Scarlett Martínez International","Seattle–Tacoma International","Seiyun",
  "Seletar","Semey","Senai International","Sendai","Sentani International",
  "Seville","Seychelles International","Sfax–Thyna International",
  "Shah Amanat International","Shah Makhdum","Shahid Ashrafi Esfahani",
  "Shahid Sadooghi","Shaikh Zayed International","Shanghai Hongqiao International",
  "Shanghai Pudong International","Shannon","Sharjah International",
  "Sharm El Sheikh International","Sheboygan County Memorial",
  "Shenyang Taoxian International","Shenzhen Bao'an International",
  "Sheremetyevo International","Shijiazhuang Zhengding International",
  "Shiraz International","Shizuoka","Sialkot International","Šiauliai International",
  "Sibiu International","Siem Reap International","Sihanouk International",
  "Silvio Pettirossi International","Simferopol International",
  "Simón Bolívar International","Simon Mwansa Kapwepwe International",
  "Sir Seewoosagur Ramgoolam International","Sir Seretse Khama International",
  "Skiathos International","Skopje International","Skyros Island National",
  "Sochi International","Socotra","Soekarno–Hatta International","Sofia",
  "Sohag International","Sohar International","Sokol",
  "Solidarity Szczecin–Goleniów","Soummam","Southampton",
  "Southwest Florida International","Sphinx International","Spichenkovo","Split",
  "Spokane International","Sri Guru Ram Das Ji International","Srinagar",
  "St. Catherine International","St. Gallen–Altenrhein","St. John's International",
  "St. Louis Lambert International","St. Pete–Clearwater International","Stavanger",
  "Stavropol Shpakovskoye","Stewart International","Stockholm Arlanda",
  "Stockholm Bromma","Stockholm Skavsta","Stockholm Västerås","Strasbourg",
  "Strigino","Stuttgart","Subic Bay International","Suceava International",
  "Sukhumi Babushara","Sulaimaniyah International","Sultan Abdul Aziz Shah",
  "Sultan Abdul Halim",
  "Sultan Aji Muhammad Sulaiman Sepinggan International","Sultan Azlan Shah",
  "Sultan Haji Ahmad Shah","Sultan Hasanuddin International",
  "Sultan Iskandar Muda International","Sultan Ismail Petra","Sultan Mahmud",
  "Sultan Mahmud Badaruddin II International",
  "Sultan Syarif Kasim II International","Sunan Shuofang International",
  "Sundsvall–Timrå","Sunshine Coast","Sunyani","Supadio International","Surat",
  "Surat Thani International","Suvarnabhumi","Syamsudin Noor International",
  "Sydney","Syktyvkar","Şymkent International","Syracuse Hancock International",
  "Syunik","Taba International","Tabarka–Aïn Draham International",
  "Tabriz International","Taichung International","Taif International","Tainan",
  "Taipei Songshan","Taiyuan Wusu International","Takoradi","Talagi",
  "Tallahassee International","Tamale","Tampa International","Tampere–Pirkkala",
  "Tampico International","Tan Son Nhat International","Tancredo Neves International",
  "Tanga","Tangier Ibn Battouta","Taoyuan International","Taraz",
  "Târgu Mureș International","Tartu","Tbilisi International","Techo International",
  "Teesside International","Tenerife North–Ciudad de La Laguna","Tenerife South",
  "Teniente Benjamín Matienzo International",
  "Teniente Coronel Luis a Mantilla International","Tepic International","Teresina",
  "Termas de Río Hondo International","Termez",
  "Terrance B. Lettsome International","Thessaloniki",
  "Thomas Sankara International Ouagadougou","Thunder Bay International",
  "Tianjin Binhai International","Tijuana International",
  "Timișoara Traian Vuia International","Tinian International",
  "Tirana International Nënë Tereza","Tiruchirappalli International",
  "Tirupati International","Tivat","Toamasina","Tocumen International","Tôlanaro",
  "Toliara","Tolmachevo","Toluca International","Toncontín International",
  "Toronto Pearson International","Torreón International","Toulon–Hyères",
  "Toulouse–Blagnac","Tours Val de Loire","Toussaint Louverture International",
  "Tozeur–Nefta International","Trabzon","Tribhuvan International",
  "Tripoli International","Trivandrum International","Tromsø","Trondheim",
  "Tucson International","Tulsa International","Tulum International",
  "Tunis–Carthage International","Tunoshna","Turbat International",
  "Turkmenabat International","Turkmenbashi International","Turku",
  "Tuxtla Gutiérrez International","Tuzla International","Uberlândia",
  "Udon Thani International","Ufa International","Ugolny","Ulanqab Jining",
  "Ulyanovsk Baratayevka","Umeå","Urgench International","Urmia",
  "Uruapan International","Ürümqi Diwopu International",
  "Ushuaia – Malvinas Argentinas International","U-Tapao International","Uytash",
  "Uzhhorod International","V. C. Bird International","Vaasa","Václav Havel",
  "Vadodara","Vágar","Val de Cães International","Valencia","Valladolid",
  "Valle del Conlara","Valley International","Van Don International",
  "Vancouver International","Varna","Vavaʻu International","Växjö",
  "Velana International","Venice Marco Polo","Ventspils International",
  "Veracruz International","Verona Villafranca","Victoria Falls",
  "Victoria International","Vienna International","Vigo–Peinador",
  "Vijayawada International","Vilankulo","Villa International Maamigili",
  "Villahermosa International","Vilnius","Vilo Acuña","Vincenzo Florio",
  "Viracopos International","Viru Viru International","Visakhapatnam International",
  "Visby","Vitoria","Vladivostok International","Vnukovo","Volgograd International",
  "Voronezh International","Wa","Walvis Bay","Wanzhou Wuqiao","Warsaw Chopin",
  "Warsaw Modlin","Warsaw Radom","Wattay International","Weeze","Weihai Dashuibo",
  "Wellington","Wenzhou Yongqiang","Wilkes-Barre/Scranton International",
  "Will Rogers World","William P. Hobby","Wilmington International",
  "Windsor International","Winnipeg James Armstrong Richardson International",
  "Wrocław","Wuhan Tianhe International","Wuyishan","Xiamen Gaoqi International",
  "Xi'an Xianyang International","Xining Caojiabao International",
  "Xinzhou Wutaishan","Xishuangbanna Gasa International","Xuzhou Guanyin","Yakutsk",
  "Yanbu","Yancheng Nanyang","Yangon International","Yangyang International",
  "Yangzhou Taizhou International","Yanji","Yantai Penglai International",
  "Yaoundé Nsimalen International","Yap International","Yelizovo",
  "Yemelyanovo International","Yenişehir","Yichang Sanxia",
  "Yinchuan Hedong International","Yiwu","Yogyakarta International",
  "Yuncheng Guangong","Yuzhno-Sakhalinsk","Zacatecas International","Zadar",
  "Zafer","Zagreb","Zahedan","Zakynthos International","Zamboanga International",
  "Zangilan International","Zaporizhzhia International","Zaqatala International",
  "Zaragoza","Zenata – Messali El Hadj","Zhangjiajie Hehua","Zhanjiang Wuchuan",
  "Zhengzhou Xinzheng International","Zhuhai Jinwan","Zhukovsky International",
  "Žilina","Zonguldak","Zumbi dos Palmares International","Zunyi Xinzhou","Zurich",
  "Zvartnots International",
];

const OEMS = [
  "Boeing","Airbus","Embraer","Bombardier","COMAC","ATR","Dassault","Leonardo","SAAB",
  "Other (please specify)",
];

const selectStyle: React.CSSProperties = {
  backgroundColor: "var(--card)",
  color: "var(--foreground)",
  borderColor: "var(--border)",
};

export function RequestCoverage() {
  const [playerType, setPlayerType] = useState("");
  const [airline, setAirline] = useState("");
  const [airport, setAirport] = useState("");
  const [oem, setOem] = useState("");
  const [otherText, setOtherText] = useState("");
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const showOtherInput = playerType === "Other" || oem === "Other (please specify)";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl">
        <div
          className="p-8 rounded-xl border text-center"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            ✓
          </div>
          <h3 className="text-base font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Request Submitted
          </h3>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Thank you for your request. We&apos;ll review it for the next update.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Request Coverage
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Suggest a player to add to SkyLens market coverage
        </p>
      </div>

      {/* Intro */}
      <div
        className="p-5 rounded-xl border"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          This is the space to request an airline, airport, or OEM to be added to SkyLens coverage.
          Submit your request and it will be reviewed for inclusion in the next update.
        </p>
      </div>

      {/* Form */}
      <div
        className="p-6 rounded-xl border"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Player Type */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
              Player Type <span style={{ color: "var(--accent)" }}>*</span>
            </label>
            <select
              required
              value={playerType}
              onChange={(e) => { setPlayerType(e.target.value); setAirline(""); setAirport(""); setOem(""); setOtherText(""); }}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
              style={selectStyle}
            >
              <option value="">Select type…</option>
              <option value="Airline">Airline</option>
              <option value="Airport">Airport</option>
              <option value="OEM">OEM</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Airline dropdown */}
          {playerType === "Airline" && (
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Airline <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <select
                required
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                style={selectStyle}
              >
                <option value="">Select airline…</option>
                {AIRLINES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          )}

          {/* Airport dropdown */}
          {playerType === "Airport" && (
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Airport <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <select
                required
                value={airport}
                onChange={(e) => setAirport(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                style={selectStyle}
              >
                <option value="">Select airport…</option>
                {AIRPORTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          )}

          {/* OEM dropdown */}
          {playerType === "OEM" && (
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                OEM <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <select
                required
                value={oem}
                onChange={(e) => { setOem(e.target.value); setOtherText(""); }}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                style={selectStyle}
              >
                <option value="">Select OEM…</option>
                {OEMS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          )}

          {/* Other text input */}
          {showOtherInput && (
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Please specify <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Enter name…"
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                style={selectStyle}
              />
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
              Why should this player be covered?
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe why this player is relevant to SkyLens coverage…"
              rows={4}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none resize-none"
              style={selectStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
              Your email{" "}
              <span className="text-xs font-normal" style={{ color: "var(--muted)" }}>(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
              style={selectStyle}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            Submit Request
          </button>

        </form>
      </div>
    </div>
  );
}
