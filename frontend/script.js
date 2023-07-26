fetch('http://127.0.0.1:8000/vuz_list')
  .then(response => response.json())
  .then(data => {
    suggestions = data;
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });

window.addEventListener('DOMContentLoaded', () => {
  const inputFields = document.getElementsByClassName('inputField');
  suggestionsLists = document.getElementsByClassName('suggestions-list');
  let tracksDict = {};
  let buttons = document.getElementsByClassName('clear-search-button');
  Array.from(buttons).forEach(button => {
     button.addEventListener('click', function(event) {
        event.target.parentElement.getElementsByClassName('inputField')[0].value = '';
     });
  });
  
  Array.from(inputFields).forEach(inputField => {
      inputField.addEventListener('input', (event) => {
          const inputText = event.target.value.toLowerCase();
          const filteredSuggestions = suggestions.filter(suggestion =>
              suggestion.toLowerCase().includes(inputText)
          );
            
          Array.from(suggestionsLists).forEach(suggestionsList => {
              suggestionsList.innerHTML = '';
          });

          filteredSuggestions.forEach(suggestion => {
              const listItem = document.createElement('li');
              listItem.textContent = suggestion;
              listItem.addEventListener('click', (event) => {
                  event.target.parentElement.parentElement.querySelector("input").value = event.target.textContent;
                  vuz_name = event.target.textContent;
                  
                  let container = event.target.parentElement.parentElement;
                  
                  let containerElements = container.children;
                  
                  if (containerElements.length > 3) {
                      Array.from(containerElements).slice(3).forEach(element => {
                         element.remove(); 
                      });
                  }
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
                          button.textContent = 'Найти';
                          container.appendChild(button);
                          button.addEventListener('click', (event) => {
                              let parent = event.target.parentElement;
                              let selectors = parent.querySelectorAll('select');
                              let vuz_tracks = []
                              selectors.forEach(function (selector) {
                                  vuz_tracks.push(selector.value.split(' ')[0]);
                              });
                              url = 'http://127.0.0.1:8000/current_place';
                              let snils = document.getElementById('inputSnils').value;
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
                                      if (parent.querySelectorAll('p').length > 0) {
                                          Array.from(parent.children).forEach(function (element) {
                                              if (element.tagName === 'P') {
                                                  element.remove();
                                              }
                                          });
                                      }
                                      let breakLine = document.createElement('br');
                                      parent.appendChild(breakLine);
                                      all_data.forEach(function (data) {
                                          let text = document.createElement('p');
                                          text.textContent = 'СНИЛС: ' + data['snils'] + ' Место в списке: ' + data['place'] + ' Всего баллов: ' + data['overall'] + ' Баллы ЕГЭ: ' + data['ege_res'] + ' Баллы за ИД: ' + data['id_res'] + ' Статус: ' + data['status']
                                          parent.appendChild(text);
                                      });
                                  })
                                  .catch(error => {
                                      console.error('Ошибка:', error);
                                  });

                              let cloneTheWholeBody = document.documentElement.cloneNode(true);
                              let cloneOneElement = cloneTheWholeBody.getElementsByClassName('container')[0];
                              document.body.appendChild(cloneOneElement);

                              suggestionsLists = document.getElementsByClassName('suggestions-list');
                              
                              let buttons = document.getElementsByClassName('clear-search-button');
                              Array.from(buttons).forEach(button => {
                                 button.addEventListener('click', function(event) {
                                    event.target.parentElement.getElementsByClassName('inputField')[0].value = '';
                                 });
                              });
                              Array.from(suggestionsLists).forEach(suggestionList => {
                                suggestionList.appendChild(listItem);
                                console.log(suggestionList, listItem);
                                    });
                          });
                      })
                      .catch(error => {
                          console.error('Ошибка:', error);
                      });

                  if (container.children.length > 2) {
                      let children = container.getElementsByTagName("select");
                      Array.from(children).forEach(function (select) {
                          select.remove();
                      });
                  }
              });
              
              Array.from(suggestionsLists).forEach(suggestionList => {
                  suggestionList.appendChild(listItem);
              });
          });
      });
  });
  
  
  document.addEventListener('click', (event) => {
     
    if (event.target.classList[0] !== 'inputField') {
      Array.from(suggestionsLists).forEach(suggestionsList => {
          suggestionsList.innerHTML = '';
      });
    }
  });

});
