from fastapi import FastAPI, HTTPException
from schema import *
from misis import misis
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vuz_list = [
    Vuz(name='Национальный исследовательский технологический университет МИСИС — российский технический университет',
        tracks=['01.03.04 Прикладная математика', '09.00.00 Информатика и вычислительная техника'],
        parse_current_pos=misis.misis)]


@app.get("/vuz_list")
async def get_vuz_list():
    return [vuz.name for vuz in vuz_list]


@app.post("/vuz_tracks/")
async def get_vuz_tracks(data: ParseVuz):
    for vuz in vuz_list:
        if vuz.name == data.vuz_name:
            return vuz.tracks
    raise HTTPException(status_code=404, detail='not found')


@app.post("/current_place/")
async def get_current_place(data: ParseCurrentPlace):
    if len(data.vuz_tracks) <= 0:
        raise HTTPException(status_code=400, detail='no vuz_tracks found')
    for vuz in vuz_list:
        if vuz.name == data.vuz_name:
            print(set(data.vuz_tracks))
            response = [vuz.parse_current_pos(snils=data.snils, track=track) for track in set(data.vuz_tracks)]
            return response
    raise HTTPException(status_code=404, detail='not found')


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
