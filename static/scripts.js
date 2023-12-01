function gcd(n, m) {
    return m == 0 ? n : gcd(m, n % m);
}
  
function nok(n, m) {
    return n * m / gcd(n, m);
}

var previous_generations = [];

function generateRandomElements() {
    // Fetch random elements from the server
    fetch('/generate', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {

        document.getElementById('redox-button').disabled = false
        document.getElementById('salz-button').disabled = false

        document.getElementById('redox').innerHTML = ''
        document.getElementById('salz').innerHTML = ''

        // todo: special function for adding new generation
        previous_generations.push(data);
    
        // todo: special function for displaying it on the screen
        const resultDiv = document.getElementById('generation');
        resultDiv.innerHTML = `
            <div class="square">
                <div class="element metall">
                    <div class="info">
                        <span class="group">${data.metall.edelgaskonfiguration}</span>
                        <span class="name">${data.metall.kurz}</span>
                    </div>
                    <span class="electrons">${data.metall.elektronen}</span>
                </div>
                <div class="element nichtmetall">
                    <div class="info">
                        <span class="group">${8 - data.nichtmetall.edelgaskonfiguration}</span>
                        <span class="name">${data.nichtmetall.kurz}</span>
                    </div>
                    <span class="electrons">${data.nichtmetall.elektronen}</span>
                </div>
            </div>
        `;
    })
    .catch(error => console.error('Error:', error));
}

function update(data) {
    
}

function redox() {
    document.getElementById('redox-button').disabled = true

    plus = '&#43'
    minus = '&#8722'
    arrow = '&#10230;'    
    electron = `<i>e</i><span class="up">&#8722</span>`

    oxidation = {
        'left': '',
        'right': '',
        'electrons': '',
        'charge': '',
    }
    reduktion = {
        'left': '',
        'right': '',
        'electrons': '',
        'charge': '',
    }
    
    const result_field = document.getElementById('redox');

    if (previous_generations) {
        metall = previous_generations[previous_generations.length - 1].metall
        nichtmetall = previous_generations[previous_generations.length - 1].nichtmetall
    } else {
        result_field.innerHTML = 'Error.';
        return
    }

    if (nichtmetall.kurz == 'S') {
        reduktion['left'] = nichtmetall.kurz
        molekule = ''
        multiplier = 1
    } else {
        reduktion['left'] = nichtmetall.kurz + `<span class="down">2</span>`
        molekule = 2
        multiplier = 2
    }
    
    reduktion['electrons'] = nichtmetall.edelgaskonfiguration * multiplier + electron
    reduktion['charge'] = nichtmetall.edelgaskonfiguration * multiplier

    if (nichtmetall.edelgaskonfiguration == 1) {
        nichtmetall.edelgaskonfiguration = ''
    }

    reduktion['right'] = molekule + nichtmetall.kurz + `<span class="up">${nichtmetall.edelgaskonfiguration}${minus}</span>`

    oxidation['charge'] = metall.edelgaskonfiguration

    if (metall.edelgaskonfiguration == 1) {
        metall.edelgaskonfiguration = ''
    }

    oxidation['left'] = metall.kurz
    oxidation['right'] = metall.kurz + `<span class="up">${metall.edelgaskonfiguration} ${plus}</span>`
    oxidation['electrons'] = ` ${metall.edelgaskonfiguration + electron} `
    
    oxidation['result'] = `${oxidation['left']} ${arrow} ${oxidation['right']} + ${oxidation['electrons']}`
    reduktion['result'] = `${reduktion['left']} + ${reduktion['electrons']} ${arrow} ${reduktion['right']}`

    console.log(oxidation, metall)
    console.log(reduktion, nichtmetall)

    result_field.innerHTML =  oxidation['result'] + `(${oxidation['charge']} Elektronen)` + `<br>` + reduktion['result'] + `(${reduktion['charge']} Elektronen)`;
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

    if (metall.edelgaskonfiguration == nichtmetall.edelgaskonfiguration) {
        metall_index = ''
        nichtmetall_index = ''
    } else {
        if (metall.edelgaskonfiguration == 1) {
            nichtmetall_index = ''
        } else {
            nichtmetall_index = metall.edelgaskonfiguration
        }
        
        if (nichtmetall.edelgaskonfiguration == 1) {
            metall_index = ''
        } else {
            metall_index = nichtmetall.edelgaskonfiguration
        }
    }

    result_field.innerHTML = `${metall.voll}${nichtmetall.salz} (${metall.kurz}<span class="down">${metall_index}</span>${nichtmetall.kurz}<span class="down">${nichtmetall_index}</span>)`

}