from sqlalchemy.orm import Session

from app.models.ruangan import Ruangan
from app.repositories.base import BaseRepository


class RuanganRepository(BaseRepository[Ruangan]):
    def __init__(self, db: Session):
        super().__init__(Ruangan, db)
