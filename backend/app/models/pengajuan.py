import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.enums import PengajuanStatus


class Pengajuan(Base):
    """
    Model untuk pengajuan peminjaman ruangan dengan alur persetujuan bertingkat.
    """

    __tablename__ = "pengajuan"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    ruangan_id = Column(String, ForeignKey("ruangan.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    # Denormalisasi untuk performa baca (menghindari JOIN)
    user_name = Column(String, nullable=False)

    event_name = Column(String, nullable=False)
    event_description = Column(Text, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    attendees = Column(Integer, nullable=False)

    status = Column(
        SAEnum(PengajuanStatus),
        nullable=False,
        default=PengajuanStatus.MENUNGGU_VERIFIKASI,
    )
    queue_position = Column(Integer, nullable=True)

    # ── Audit trail persetujuan bertingkat ──
    verified_by = Column(String, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    approved_by = Column(String, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    rejection_reason = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # ── Relasi ──
    ruangan = relationship("Ruangan", back_populates="pengajuan_list")
    user = relationship(
        "User", back_populates="pengajuan_list", foreign_keys=[user_id]
    )
    verifier = relationship("User", foreign_keys=[verified_by])
    approver = relationship("User", foreign_keys=[approved_by])
    dokumen_list = relationship(
        "DokumenPengajuan",
        back_populates="pengajuan",
        cascade="all, delete-orphan",
        lazy="selectin",  # Load otomatis dokumen saat pengajuan di-query
    )
