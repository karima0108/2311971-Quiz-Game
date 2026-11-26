from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import AuditLog, User
from schemas import AuditLogResponse, AuditLogListResponse


router = APIRouter(
    prefix="/api/admin/audit-logs",
    tags=["Admin Audit Logs"],
)


@router.get("", response_model=AuditLogListResponse)
def list_audit_logs(
    actor_id: int | None = Query(default=None, ge=1),
    action: str | None = Query(default=None, max_length=100),
    target_type: str | None = Query(default=None, max_length=100),
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="Start date cannot be after end date",
        )

    query = (
        db.query(AuditLog, User.name, User.email)
        .outerjoin(User, AuditLog.actor_id == User.id)
    )

    if actor_id is not None:
        query = query.filter(AuditLog.actor_id == actor_id)

    if action:
        query = query.filter(AuditLog.action == action)

    if target_type:
        query = query.filter(AuditLog.target_type == target_type)

    if start_date:
        query = query.filter(AuditLog.created_at >= start_date)

    if end_date:
        query = query.filter(AuditLog.created_at <= end_date)

    total = query.count()

    rows = (
        query.order_by(AuditLog.created_at.desc(), AuditLog.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = [
        AuditLogResponse(
            id=log.id,
            actor_id=log.actor_id,
            actor_name=actor_name,
            actor_email=actor_email,
            action=log.action,
            target_type=log.target_type,
            target_id=log.target_id,
            description=log.description,
            details=log.details,
            ip_address=log.ip_address,
            created_at=log.created_at,
        )
        for log, actor_name, actor_email in rows
    ]

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }


@router.get("/{log_id}", response_model=AuditLogResponse)
def get_audit_log_details(
    log_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    row = (
        db.query(AuditLog, User.name, User.email)
        .outerjoin(User, AuditLog.actor_id == User.id)
        .filter(AuditLog.id == log_id)
        .first()
    )

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Audit log not found",
        )

    log, actor_name, actor_email = row

    return AuditLogResponse(
        id=log.id,
        actor_id=log.actor_id,
        actor_name=actor_name,
        actor_email=actor_email,
        action=log.action,
        target_type=log.target_type,
        target_id=log.target_id,
        description=log.description,
        details=log.details,
        ip_address=log.ip_address,
        created_at=log.created_at,
    )
