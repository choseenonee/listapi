from pydantic import BaseModel


class ParseVuz(BaseModel):
    vuz_name: str


class ParseCurrentPlace(BaseModel):
    snils: str
    vuz_name: str
    vuz_tracks: list[str]


class Vuz:
    def __init__(self, name: str, tracks: list[str], parse_current_pos: callable):
        self.name = name
        self.tracks = tracks
        self.parse_current_pos = parse_current_pos
