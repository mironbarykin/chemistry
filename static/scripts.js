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
        result_field.innerHTML = data.content
    })
    .catch(error => console.error('Error:', error));
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