import requests
from bs4 import BeautifulSoup

s = '01.03.04'
snils = '183-289-215 94'

def misis(track: str, snils: str):
    fcode = ''.join(track.split('.'))
    r = requests.get(f'https://misis.ru/applicants/admission/progress/baccalaureate-and-specialties/list-of-applicants/list/?id=BAC-BUDJ-O-{fcode}-NITU_MISIS')
    soup = BeautifulSoup(r.content, 'html5lib')
    abit = soup.findAll('td')

    for i in abit:
        if snils in i.text:
            return(abit[abit.index(i)-2].text)
    
print(misis('01.03.04', '183-289-215 94'))