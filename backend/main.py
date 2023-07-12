from fastapi import FastAPI, Query
from typing import Annotated
from misis import misis
import uvicorn

app = FastAPI()


vuz_list = ['Национальный исследовательский технологический университет МИСИС — российский технический университет']
vuz_tracks = {'Национальный исследовательский технологический университет МИСИС — российский технический университет': ['01.03.04 Прикладная математика', '09.00.00 Информатика и вычислительная техника']}


@app.get("/vuz_list")
async def get_vuz_list():
    return vuz_list


@app.get("/vuz_tracks/{vuz}")
async def get_vuz_tracks(vuz: str):
    return vuz_tracks[vuz]


@app.post("/current_place/misis/{snils}")
async def get_current_place(snils: str, tracks: Annotated[list[str], "List of tracks that you want to check"]):
    if len(tracks) <= 0:
        return '400'
    current_place = [misis.misis(track=track, snils=snils) for track in tracks]
    return current_place


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)