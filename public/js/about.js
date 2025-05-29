document.addEventListener('DOMContentLoaded', () => {
  const teamMembersContainer = document.getElementById('team-members-container');
  const featuredArtisansContainer = document.getElementById('about-featured-artisans-container');

  // --- Fetch and Render Team Members ---
  if (teamMembersContainer) {
    fetch('/api/team')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - Could not fetch team data.`);
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
                <p class="text-[#141414] text-base font-medium leading-normal">${member.name || 'N/A'}</p>
                <p class="text-[#757575] text-sm font-normal leading-normal">${member.title || 'N/A'}</p>
              </div>
            `;
            teamMembersContainer.appendChild(memberElement);
          });
        } else {
          teamMembersContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">Our team is working hard! Profiles coming soon.</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching team members:', error);
        teamMembersContainer.innerHTML = '<p class="text-center text-red-500 col-span-full">Could not load team members at this time.</p>';
      });
  } else {
    console.warn('Team members container not found.');
  }

  // --- Fetch and Render Featured Artisans ---
  if (featuredArtisansContainer) {
    fetch('/api/artisans/featured') // Using the general featured artisans endpoint
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - Could not fetch featured artisans.`);
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
                <p class="text-[#141414] text-base font-medium leading-normal">${artisan.name || 'N/A'}</p>
                <p class="text-[#757575] text-sm font-normal leading-normal">${artisan.description || 'Description not available.'}</p>
              </div>
            `;
            featuredArtisansContainer.appendChild(artisanElement);
          });
        } else {
          featuredArtisansContainer.innerHTML = '<p class="text-center text-gray-500 w-full">Lookout for our amazing featured artisans soon!</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching featured artisans:', error);
        featuredArtisansContainer.innerHTML = '<p class="text-center text-red-500 w-full">Could not load featured artisans at this time.</p>';
      });
  } else {
    console.warn('Featured artisans container for about page not found.');
  }
});
