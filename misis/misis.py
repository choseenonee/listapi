import requests
from bs4 import BeautifulSoup

def misis(track: str, snils: str):
    fcode = ''.join(track.split('.'))
    r = requests.get(f'https://misis.ru/applicants/admission/progress/baccalaureate-and-specialties/list-of-applicants/list/?id=BAC-BUDJ-O-{fcode}-NITU_MISIS')
    soup = BeautifulSoup(r.content, 'html5lib')
    abit = soup.findAll('td')

    for i in abit:
        if snils in i.text:
            return(f'Ваше место: {abit[abit.index(i)-2].text}\nСнилс: {i.text}\nОбщая сумма баллов: {abit[abit.index(i)+2].text}\nСумма баллов по предметам: {abit[abit.index(i)+3].text}\nБаллы ИД: {abit[abit.index(i)+7].text}\nУсловие приема: {abit[abit.index(i)+9].text}')
    
