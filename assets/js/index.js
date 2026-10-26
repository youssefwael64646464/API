// WRITE YOUR JS CODE HERE
  const dateSpace=document.getElementById('apod-date-detail')
  const apodDate=document.getElementById('apod-date')
  const apodDateInfo=document.getElementById('apod-date-info')
  const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".app-section");
let AllLunches=[]
let AllPlantes=[]
const planetStyles = [
    { id: "mercury", color: "#eab308", hover: "#eab30880" },
    { id: "venus", color: "#f97316", hover: "#f9731680" },
    { id: "earth", color: "#3b82f6", hover: "#3b82f680" },
    { id: "mars", color: "#ef4444", hover: "#ef444480" },
    { id: "jupiter", color: "#fb923c", hover: "#fb923c80" },
    { id: "saturn", color: "#facc15", hover: "#facc1580" },
    { id: "uranus", color: "#06b6d4", hover: "#06b6d480" },
    { id: "neptune", color: "#2563eb", hover: "#2563eb80" }
];

links.forEach(link => {
    link.onclick = function(e) {
        e.preventDefault();

        links.forEach(item => {
            item.classList.remove("bg-blue-500/10", "text-blue-400");
            item.classList.add("text-slate-300");
        });

        this.classList.remove("text-slate-300");
        this.classList.add("bg-blue-500/10", "text-blue-400");

        sections.forEach(section => {
            section.classList.add("hidden");
        });

        document.getElementById(this.dataset.section).classList.remove("hidden");
    };
});



async function getTodayAPOD() {
  try {
    const response = await fetch("https://api.nasa.gov/planetary/apod?api_key=HpDmLh6mK6NgfMLGfNFKc7HB9KQ9jDQb9LkLTQTL");
    const data = await response.json();
    if(response.status ==200){
      console.log(data)
    displayimage(data)
    displaydate(data)
    displayexplanation(data)
    displaymedia(data)
    displaytitle(data)
    }else{
  displayErrordate()
    }
  } catch (error) {
    console.log(error);
    
  }
}


async function getLaunches() {
try {
    const response= await fetch("https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10")
  const data= await response.json();
  if(response.status==200){
    AllLunches=data.results
    console.log(AllLunches)
    displayFeaturedLaunch()
    displayLaunchesGrid()
  }
} catch (error) {
  console.error(error)
}
  
}

async function getAllPlantes() {
  const response=await fetch('https://solar-system-opendata-proxy.vercel.app/api/planets')
  const data= await response.json()
  if(response.status==200){
    AllPlantes=data.bodies
    console.log(AllPlantes)
    displayPlantes()
    displayPlanetDetails(6);
    displayPlanetComparison()
    
  }
  
}
getAllPlantes()
getLaunches()
getTodayAPOD();
 




function displayPlantes() {
    let blackBox = "";

    for (let i = 0; i < AllPlantes.length; i++) {
        let planet = AllPlantes[i];
        let style = "";

        for (let j = 0; j < planetStyles.length; j++) {
            if (planet.englishName.toLowerCase() === planetStyles[j].id) {
                style = planetStyles[j];
                break;
            }
        }

        if (style === "") continue;

        blackBox += `
            <div
                class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
                data-planet-id="${planet.id}"
                style="--planet-color: ${style.color}"
                onmouseover="this.style.borderColor='${style.hover}'"
                onmouseout="this.style.borderColor='#334155'"
                onclick="displayPlanetDetails(${i})"
            >
                <div class="relative mb-3 h-24 flex items-center justify-center">
                    <img
                        class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                        src="${planet.image}"
                        alt="${planet.englishName}"
                    />
                </div>

                <h4 class="font-semibold text-center text-sm">
                    ${planet.englishName}
                </h4>

                <p class="text-xs text-slate-400 text-center">
                    ${(planet.semimajorAxis / 1000000).toFixed(1)}M km
                </p>
            </div>
        `;
    }

    document.getElementById("planets-grid").innerHTML = blackBox;
}




function displayPlanetDetails(index) {
    let planet = AllPlantes[index];

  let blackBox = `
    <div class="flex flex-col xl:flex-row xl:items-start space-y-4 xl:space-y-0">
        <div class="relative h-48 w-48 md:h-64 md:w-64 shrink-0 mx-auto xl:mr-6">
            <img
                id="planet-detail-image"
                class="w-full h-full object-contain"
                src="${planet.image}"
                alt="${planet.englishName}"
            />
        </div>

        <div class="flex-1">
            <div class="flex items-center justify-between mb-3 md:mb-4">
                <h3
                    id="planet-detail-name"
                    class="text-2xl md:text-3xl font-space font-bold"
                >
                    ${planet.englishName}
                </h3>

                <button class="w-10 h-10 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <i class="far fa-heart"></i>
                </button>
            </div>

            <p
                id="planet-detail-description"
                class="text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base"
            >
                ${planet.description || "No description available."}
            </p>
        </div>
    </div>

    <div class="grid grid-cols-2 gap-2 md:gap-4 mt-4">
        <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <i class="fas fa-ruler text-xs"></i>
                <span>Semimajor Axis</span>
            </p>
            <p id="planet-distance" class="text-sm md:text-lg font-semibold">
                ${(planet.semimajorAxis / 1000000).toFixed(1)}M km
            </p>
        </div>

        <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <i class="fas fa-circle"></i>
                Mean Radius
            </p>
            <p id="planet-radius" class="text-lg font-semibold">
                ${Math.floor(planet.meanRadius)} km
            </p>
        </div>

        <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <i class="fas fa-weight"></i>
                Mass
            </p>
            <p id="planet-mass" class="text-lg font-semibold">
                ${planet.mass.massValue} × 10^${planet.mass.massExponent} kg
            </p>
        </div>

        <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <i class="fas fa-tint"></i>
                Density
            </p>
            <p id="planet-density" class="text-lg font-semibold">
                ${planet.density} g/cm³
            </p>
        </div>

        <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <i class="fas fa-sync-alt"></i>
                Orbital Period
            </p>
            <p id="planet-orbital-period" class="text-lg font-semibold">
                ${planet.sideralOrbit.toFixed(2)} days
            </p>
        </div>

        <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <i class="fas fa-redo"></i>
                Rotation Period
            </p>
            <p id="planet-rotation" class="text-lg font-semibold">
                ${planet.sideralRotation.toFixed(2)} hours
            </p>
        </div>

        <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <i class="fas fa-moon"></i>
                Moons
            </p>
            <p id="planet-moons" class="text-lg font-semibold">
                ${planet.moons ? planet.moons.length : 0}
            </p>
        </div>

        <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <i class="fas fa-arrows-alt-v"></i>
                Gravity
            </p>
            <p id="planet-gravity" class="text-lg font-semibold">
                ${planet.gravity.toFixed(2)} m/s²
            </p>
        </div>

      
`;


    document.getElementById("earth").innerHTML = blackBox;
    document.getElementById('mass').innerHTML=`  Mass: ${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`
  document.getElementById('Surface').innerHTML=`  Surface gravity: ${planet.gravity} m/s²`
  document.getElementById('Density').innerHTML=`Density: ${planet.density} g/cm³`
    document.getElementById('Axial').innerHTML=`Axial tilt: ${planet.axialTilt}°`
        document.getElementById('planet-discoverer').innerHTML=`${planet.discoveredBy || "Known since antiquity"}`
            document.getElementById('planet-discovery-date').innerHTML=`${planet.discoveryDate || "Ancient times"}`
                document.getElementById('planet-body-type').innerHTML=`  ${planet.bodyType}`
                                document.getElementById('planet-volume').innerHTML=`    ${planet.vol
                        ? `${planet.vol.volValue} × 10^${planet.vol.volExponent} km³`
                        : "Not available"}`

document.getElementById("planet-perihelion").innerHTML = `${(planet.perihelion / 1000000).toFixed(1)}M km`;

document.getElementById("planet-aphelion").innerHTML = `${(planet.aphelion / 1000000).toFixed(1)}M km`;

document.getElementById("planet-eccentricity").innerHTML = `${planet.eccentricity != null ? planet.eccentricity.toFixed(5) : "N/A"}`;

document.getElementById("planet-inclination").innerHTML = `${planet.inclination != null ? planet.inclination + "°" : "N/A"}`;

document.getElementById("planet-axial-tilt").innerHTML = `${planet.axialTilt != null ? planet.axialTilt.toFixed(2) + "°" : "N/A"}`;

document.getElementById("planet-temp").innerHTML = `${planet.avgTemp != null ? (planet.avgTemp - 273.15).toFixed(1) + "°C" : "N/A"}`;

document.getElementById("planet-escape").innerHTML = `${planet.escape != null ? (planet.escape / 1000).toFixed(2) + " km/s" : "N/A"}`;



  



    console.log(`${planet.bodyType}`)
}


          

            
  function displayPlanetComparison() {
    let blackBox = "";

    for (let i = 0; i < AllPlantes.length; i++) {
        let planet = AllPlantes[i];
        let style = "";

        for (let j = 0; j < planetStyles.length; j++) {
            if (planet.englishName.toLowerCase() == planetStyles[j].id) {
                style = planetStyles[j];
            }
        }

        let distance = (planet.semimajorAxis / 149597870.7).toFixed(2);
        let diameter = Math.round(planet.meanRadius * 2).toLocaleString();

        let mass = (
            (planet.mass.massValue * Math.pow(10, planet.mass.massExponent)) /
            (5.9722 * Math.pow(10, 24))
        ).toFixed(3);

        let orbitalPeriod = planet.sideralOrbit >= 365
            ? (planet.sideralOrbit / 365.25).toFixed(1) + " years"
            : planet.sideralOrbit.toFixed(0) + " days";

        if (planet.englishName == "Mars") {
            orbitalPeriod = "1.9 years";
        }

        let moons = planet.moons ? planet.moons.length : 0;

        let type = planet.type || planet.bodyType || "Unknown";

        blackBox += `
            <tr class="hover:bg-slate-800/30 transition-colors
                ${planet.englishName == "Earth" ? "bg-blue-500/5" : ""}">

                <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
                    <div class="flex items-center space-x-2 md:space-x-3">
                        <div
                            class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                            style="background-color: ${style.color}"
                        ></div>

                        <span class="font-semibold text-sm md:text-base whitespace-nowrap">
                            ${planet.englishName}
                        </span>
                    </div>
                </td>

                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                    ${distance}
                </td>

                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                    ${diameter}
                </td>

                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                    ${mass}
                </td>

                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                    ${orbitalPeriod}
                </td>

                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                    ${moons}
                </td>

                <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    <span
                        class="px-2 py-1 rounded text-xs"
                        style="background-color: ${style.color}50; color: ${style.color}"
                    >
                        ${type}
                    </span>
                </td>
            </tr>
        `;
    }

    document.getElementById("planet-comparison-tbody").innerHTML = blackBox;
}

function displayFeaturedLaunch(){
  let blackBox=''
  
    blackBox+=`  <div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                      >
                        ${AllLunches[0].status.abbrev}
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                    ${AllLunches[0].name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${AllLunches[0].launch_service_provider.name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${AllLunches[0].rocket.configuration.name}</span>
                      </div>
                    </div>
                  
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">March 14, 2024</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">12:00 PM UTC</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${AllLunches[0].pad.location.name}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${AllLunches[0].pad.country.name}</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                      ${AllLunches[0].mission.description}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                  >
                  <img src=${AllLunches[0].image.image_url}  class="w-full h-full object-cover" />
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                    ></div>
                  </div>
                </div>
              </div>
            </div>`


        
  
  

  document.getElementById('featured-launch').innerHTML=blackBox
  
}





function displayLaunchesGrid(){
let blackBox=''

for(let i=1 ; i<AllLunches.length ; i++){
  blackBox +=`
    <div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
                  <img src=${AllLunches[i].image.image_url}  class="w-full h-full object-cover" />
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                  ${AllLunches[i].status.abbrev}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                  ${AllLunches[i].name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                  ${AllLunches[i].launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">Mar 15, 2024</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">23:00 UTC</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${AllLunches[i].rocket.configuration.name}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${AllLunches[i].pad.location.name}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
  `
}
document.getElementById('launches-grid').innerHTML=blackBox
}




function displayimage(data){
  const imagespace=document.getElementById('apod-image-container')
  imagespace.innerHTML=`
    <img
                  id="apod-image"
                  class="w-full h-full object-cover"
                  src="${data.hdurl}"
                  alt="Astronomy Picture of the Day"
                />
                  <div
                  class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div class="absolute bottom-6 left-6 right-6">
                    <button
                      class="w-full py-3 bg-white/10 backdrop-blur-md rounded-lg font-semibold hover:bg-white/20 transition-colors"
                    >
                      <i class="fas fa-expand mr-2"></i>View Full Resolution
                    </button>
                  </div>
                </div>
  `
}


function displaydate(data){

  dateSpace.innerHTML=`<i class="far fa-calendar mr-2"></i>${data.date}`
  apodDate.innerHTML=`
    Astronomy Picture of the Day - ${data.date}
  `
  apodDateInfo.innerHTML=`${data.date}`
}


function  displayErrordate(){
    dateSpace.innerHTML=`<i class="far fa-calendar mr-2"></i>Invalid Date`
  apodDate.innerHTML=`
    Astronomy Picture of the Day - Invalid Date
  `
  apodDateInfo.innerHTML=`Invalid Date`

}


function displayexplanation(data){
  const   dataExplanation=document.getElementById('apod-explanation')
  dataExplanation.innerHTML=`  ${data.explanation}`
}


function displaymedia(data){
  const type=document.getElementById('apod-media-type')
  type.innerHTML=`
  ${data.media_type}
  `
}

function displaytitle(data){
  const title=document.getElementById('apod-title')
  title.innerHTML=`
  ${data.title}
  `
}


