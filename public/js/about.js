document.addEventListener('DOMContentLoaded', () => {
  const teamMembersContainer = document.getElementById('team-members-container');
  const featuredArtisansContainer = document.getElementById('about-featured-artisans-container');

  // --- Fetch and Render Team Members ---
  if (teamMembersContainer) {
    fetch('/api/team')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Errore HTTP! stato: ${response.status} - Impossibile recuperare i dati del team.`);
          }
          return response.json();
        })
        .then(teamMembers => {
          teamMembersContainer.innerHTML = ''; // Clear any placeholders or old content
          if (teamMembers && teamMembers.length > 0) {
            teamMembers.forEach(member => {
              const memberElement = document.createElement('div');
              memberElement.className = 'flex flex-col gap-3 text-center pb-3';
              memberElement.innerHTML = `
              <div class="px-4">
                <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full" 
                     style="background-image: url('${member.imageUrl || 'img/placeholder-avatar.jpg'}');">
                </div>
              </div>
              <div>
                <p class="text-[#141414] text-base font-medium leading-normal">${member.name || 'N/D'}</p>
                <p class="text-[#757575] text-sm font-normal leading-normal">${member.title || 'N/D'}</p>
              </div>
            `;
              teamMembersContainer.appendChild(memberElement);
            });
          } else {
            teamMembersContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">Il nostro team è al lavoro! I profili saranno presto disponibili.</p>';
          }
        })
        .catch(error => {
          console.error('Errore durante il recupero dei membri del team:', error);
          teamMembersContainer.innerHTML = '<p class="text-center text-red-500 col-span-full">Impossibile caricare i membri del team in questo momento.</p>';
        });
  } else {
    console.warn('Contenitore dei membri del team non trovato.');
  }

  // --- Fetch and Render Featured Artisans ---
  if (featuredArtisansContainer) {
    fetch('/api/artisans/featured') // Using the general featured artisans endpoint
        .then(response => {
          if (!response.ok) {
            throw new Error(`Errore HTTP! stato: ${response.status} - Impossibile recuperare gli artigiani in evidenza.`);
          }
          return response.json();
        })
        .then(artisans => {
          featuredArtisansContainer.innerHTML = ''; // Clear any placeholders
          if (artisans && artisans.length > 0) {
            artisans.forEach(artisan => {
              const artisanElement = document.createElement('div');
              artisanElement.className = 'flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60'; // min-w-60 as per original HTML
              artisanElement.innerHTML = `
              <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col" 
                   style="background-image: url('${artisan.imageUrl || 'img/placeholder-image.jpg'}');">
              </div>
              <div>
                <p class="text-[#141414] text-base font-medium leading-normal">${artisan.name || 'N/D'}</p>
                <p class="text-[#757575] text-sm font-normal leading-normal">${artisan.description || 'Descrizione non disponibile.'}</p>
              </div>
            `;
              featuredArtisansContainer.appendChild(artisanElement);
            });
          } else {
            featuredArtisansContainer.innerHTML = '<p class="text-center text-gray-500 w-full">Presto i nostri straordinari artigiani in evidenza!</p>';
          }
        })
        .catch(error => {
          console.error('Errore durante il recupero degli artigiani in evidenza:', error);
          featuredArtisansContainer.innerHTML = '<p class="text-center text-red-500 w-full">Impossibile caricare gli artigiani in evidenza in questo momento.</p>';
        });
  } else {
    console.warn('Artigiani in evidenza per la pagina "Chi siamo" non trovato.');
  }
});
