fetch('http://127.0.0.1:8000/vuz_list')
  .then(response => response.json())
  .then(data => {
    suggestions = data;
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });

window.addEventListener('DOMContentLoaded', () => {
  const inputField = document.getElementById('inputField');
  const inputSnils = document.getElementById('inputSnils');
  const suggestionsList = document.getElementById('suggestionsList');
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

        let requestOptions = {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
        };

        fetch(url, requestOptions)
          .then(response => response.json())
          .then(data => {
            tracksDict[listItem.textContent] = data;
            for (let i = 0; i < 5; i++) {
              let selectElement = document.createElement('select');
              selectElement.placeholder = 'Выберите направление';
              for (let e = 0; e < tracksDict[event.target.textContent].length; e++) {
                optionElement = document.createElement('option');
                optionElement.textContent = tracksDict[event.target.textContent][e];
                selectElement.appendChild(optionElement);
              }
              container.appendChild(selectElement);
            }
            let button = document.createElement('button');
            button.addEventListener('click', (event) => {
                let parent = event.target.parentElement;
                let selectors = parent.querySelectorAll('select');
                let vuz_tracks = []
                selectors.forEach(function (selector){
                    vuz_tracks.push(selector.value.split(' ')[0]);
                });


                url = 'http://127.0.0.1:8000/current_place';
                let snils = document.getElementById('inputSnils').value;
                let vuz_name = document.getElementById('inputField').value;
                data = {
                  snils: snils,
                  vuz_name: vuz_name,
                  vuz_tracks: vuz_tracks
                };

                requestOptions = {
                  method: 'POST',
                  headers: headers,
                  body: JSON.stringify(data)
                };

                fetch(url, requestOptions)
                  .then(response => response.json())
                  .then(all_data => {
                      if (parent.querySelectorAll('p').length > 0){
                          Array.from(parent.children).forEach(function (element){
                              if (element.tagName === 'P'){
                                  element.remove();
                              }
                          });
                      }
                      let breakLine = document.createElement('br');
                      parent.appendChild(breakLine);
                      all_data.forEach(function(data){
                        let text = document.createElement('p');
                        text.textContent = 'СНИЛС: ' + data['snils'] + ' Место в списке: ' + data['place'] + ' Всего баллов: ' + data['overall'] + ' Баллы ЕГЭ: ' + data['ege_res'] + ' Баллы за ИД: ' + data['id_res'] + ' Статус: ' + data['status']
                        parent.appendChild(text);
                      });
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

        if (container.children.length > 2) {
          let children = container.getElementsByTagName("select");
          container.getElementsByTagName("button")[0].remove();
          Array.from(children).forEach(function (select) {
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
