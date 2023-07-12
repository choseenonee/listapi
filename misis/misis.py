import requests
from bs4 import BeautifulSoup

def misis(track: str, snils: str):
    fcode = ''.join(track.split('.'))
    r = requests.get(f'https://misis.ru/applicants/admission/progress/baccalaureate-and-specialties/list-of-applicants/list/?id=BAC-BUDJ-O-{fcode}-NITU_MISIS')
    soup = BeautifulSoup(r.content, 'html5lib')
    abit = soup.findAll('td')

    for i in abit:
        if snils in i.text:
            place = abit[abit.index(i)-2].text
            snils = i.text
            overall = abit[abit.index(i)+2].text
            ege_res = abit[abit.index(i)+3].text
            id_res = abit[abit.index(i)+7]
            status = abit[abit.index(i)+9].text
            return {'place': place, 'snils': snils, 'overall': overall, 'ege_res': ege_res, 'id_res': id_res, 'status': status}

# print(misis('01.03.04', '182-693-080 95'))