import fs from 'fs';

const spaceId = '3r8djtzjmkjx';
const accessToken = 'RXfJG2HkiLpgIgCdX7NdG2nh3FtBzA9zpoLeP1l4fko';
const entryId = '1gx2h7wOhgsYNQ8oBPwcJO';

const url = `https://cdn.contentful.com/spaces/${spaceId}/entries/${entryId}?access_token=${accessToken}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        // Stringify the data
        const jsonData = JSON.stringify(data, null, 4);

        // Write the data to a file
        fs.writeFile('ctf-experience.json', jsonData, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Entry data saved to contentful-entry.json');
            }
        });
    })
    .catch(error => console.error('Error fetching entry:', error));