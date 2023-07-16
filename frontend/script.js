fetch('http://127.0.0.1:8000/vuz_list')
        .then(response => response.json())
            .then(data => {
                (suggestions = data);
                })
                .catch(error => {
                console.error('Ошибка:', error);
              });

        window.addEventListener('DOMContentLoaded', () => {
            const inputField = document.getElementById('inputField');
            const inputSnils = document.getElementById('inputSnils');
            const suggestionsContainer = document.querySelector('.suggestions-container');
            const suggestionsList = document.getElementById('suggestionsList');
            // const container = document.getElementsByClassName('container')[0];
            let tracksDict = {};


            inputField.addEventListener('input', (event) => {
                const inputText = event.target.value.toLowerCase();
                const filteredSuggestions = suggestions.filter(suggestion =>
                    suggestion.toLowerCase().includes(inputText)
                );

                suggestionsList.innerHTML = '';

                filteredSuggestions.forEach(suggestion => {
                    const listItem = document.createElement('li');
                    listItem.textContent = suggestion;
                    listItem.addEventListener('click', (event) => {
                        event.target.parentElement.parentElement.querySelector("input").value = event.target.textContent;
                        
                        let container = event.target.parentElement.parentElement;
                        
                        let url = 'http://127.0.0.1:8000/vuz_tracks';
                        let data = {
                            vuz_name: listItem.textContent
                        };
                        
                        let headers = {
                            'Content-Type': 'application/json'
                        };
                        
                        let requestOptions ={
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify(data)
                        };
                        
                        fetch(url, requestOptions)
                        .then(response => response.json())
                            .then(data => {
                                tracksDict[listItem.textContent] = data;
                                for (let i=0; i < 5; i++){
                                    let selectElement = document.createElement('select');
                                    selectElement.placeholder = 'Выберите направление';
                                    console.log(tracksDict)
                                    for (let e=0; e < tracksDict[event.target.textContent].length; e++)
                                    {
                                    optionElement = document.createElement('option');
                                    optionElement.textContent = tracksDict[event.target.textContent][e];
                                    selectElement.appendChild(optionElement);
                                    }
                            container.appendChild(selectElement);
                                }
                                let button = document.createElement('button');
                                button.addEventListener('click', (event) =>{
                                    url = 'http://127.0.0.1:8000/current_place';
                        data = {
                            snils: inputSnils.textContent,
                            vuz_name: inputField.textContent
                        };

                        requestOptions ={
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify(data)
                        };

                        fetch(url, requestOptions)
                        .then(response => response.json())
                            .then(data => {
                                
                                })
                                .catch(error => {
                                console.error('Ошибка:', error);
                              });
                                });
                                
                        button.textContent = 'Найти';
                        container.appendChild(button);
                                })
                                .catch(error => {
                                console.error('Ошибка:', error);
                              });
                        if (container.children.length > 2){
                            let children = container.getElementsByTagName("select");
                            container.getElementsByTagName("button")[0].remove();
                            Array.from(children).forEach(function(select) {
                                    select.remove();
                                });
                        }
                    });
                    suggestionsList.appendChild(listItem);
                });
            });

            document.addEventListener('click', (event) => {
                if (event.target !== inputField) {
                    suggestionsList.innerHTML = '';
                }
            });

        });