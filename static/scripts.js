var previous_generations = [];

function generateRandomElements() {
    document.getElementById('loader-generation').style.display = 'block';

    fetch('/generate', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loader-generation').style.display = 'none';

        const result_field = document.getElementById('generation');
        
        document.getElementById('redox-button').disabled = false
        document.getElementById('salz-button').disabled = false

        document.getElementById('redox').innerHTML = '<center><div id="loader-redox" class="loader"></div></center>'
        document.getElementById('salz').innerHTML = ''

        previous_generations.push(data);

        result_field.innerHTML = `
            <center><div id="loader-generation" class="loader"></div></center>
            <div class="square">
                <div class="element metall">
                    <div class="info">
                        <span class="group">${data.metall.deficiency}</span>
                        <span class="name">${data.metall.symbol}</span>
                    </div>
                    <span class="electrons">${data.metall.electrons}</span>
                </div>
                <div class="element nichtmetall">
                    <div class="info">
                        <span class="group">${8 - data.nichtmetall.deficiency}</span>
                        <span class="name">${data.nichtmetall.symbol}</span>
                    </div>
                    <span class="electrons">${data.nichtmetall.electrons}</span>
                </div>
            </div>
        `;
    })
    .catch(error => {
        console.error(error)
    });
}

function redox() {
    document.getElementById('redox-button').disabled = true

    document.getElementById('loader-redox').style.display = 'block';

    const result_field = document.getElementById('redox');
    
    fetch('/result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(previous_generations[previous_generations.length - 1]),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loader-redox').style.display = '';
        result_field.innerHTML = data.content
    })
    .catch(error => console.error(error));
}

function salz() {
    document.getElementById('salz-button').disabled = true
    const result_field = document.getElementById('salz');
    
    if (previous_generations) {
        metall = previous_generations[previous_generations.length - 1].metall
        nichtmetall = previous_generations[previous_generations.length - 1].nichtmetall
    } else {
        result_field.innerHTML = 'Error.';
        return
    }

    if (metall.deficiency == nichtmetall.deficiency) {
        metall_index = ''
        nichtmetall_index = ''
    } else {
        if (metall.deficiency == 1) {
            nichtmetall_index = ''
        } else {
            nichtmetall_index = metall.deficiency
        }
        
        if (nichtmetall.deficiency == 1) {
            metall_index = ''
        } else {
            metall_index = nichtmetall.deficiency
        }
    }

    result_field.innerHTML = `${metall.name}${nichtmetall.salt} (${metall.symbol}<span class="down">${metall_index}</span>${nichtmetall.symbol}<span class="down">${nichtmetall_index}</span>)`
}

function showContainer(containerId, buttonId) {
    document.querySelectorAll('.container').forEach(container => {
        container.classList.add('disabled');
    });

    document.getElementById(containerId).classList.remove('disabled');

    document.getElementById(buttonId).disabled = true;

    document.querySelectorAll('.nav-button').forEach(button => {
        if (button.id !== buttonId) {
            button.disabled = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/static/elements.csv')
        .then(response => response.text())
        .then(csvData => {
            const { metall, nichtmetall } = parseCSV(csvData);

            // Populate metall dropdown
            populateDropdown('metallSelect', metall);

            // Populate nichtmetall dropdown
            populateDropdown('nichtmetallSelect', nichtmetall);
        });
});

function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    const metall = [];
    const nichtmetall = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');

        if (values[4] == 'M') {
            metall.push(values);
        } else {
            nichtmetall.push(values);
        }
    }

    return { metall, nichtmetall };
}

function populateDropdown(id, options) {
    const dropdown = document.getElementById(id);

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option[0];
        dropdown.appendChild(optionElement);
    });

    // Add event listener to update selectedMetall or selectedNichtmetall on change

}

function redox_chosen() {
    const selectedMetall = document.getElementById('metallSelect').value.split(',');
    const selectedNichtmetall = document.getElementById('nichtmetallSelect').value.split(',');

    const result_field = document.getElementById('redox-chosen');
    
    fetch('/result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'metall': { 'symbol': selectedMetall[0], 'name': selectedMetall[1], 'deficiency': selectedMetall[2], 'electrons': selectedMetall[3], 'state': selectedMetall[4], 'salt': selectedMetall[5], 'molecule': selectedMetall[6], }, 
            'nichtmetall': { 'symbol': selectedNichtmetall[0], 'name': selectedNichtmetall[1], 'deficiency': selectedNichtmetall[2], 'electrons': selectedNichtmetall[3], 'state': selectedNichtmetall[4], 'salt': selectedNichtmetall[5], 'molecule': selectedNichtmetall[6], } 
        }),
    })
    .then(response => response.json())
    .then(data => {
        result_field.innerHTML = data.content
    })
    .catch(error => console.error(error));
}