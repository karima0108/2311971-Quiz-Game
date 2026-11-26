
import re

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from dependencies import (
    require_admin,
    require_student,
    require_permission,
)
from models import Group, GroupMembership, GroupPermission, User

router = APIRouter(
    prefix="/api/admin/groups",
    tags=["Group Management"],
    dependencies=[Depends(require_admin)],
)


# =========================
# REQUEST SCHEMAS
# =========================

class GroupCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value):
        value = value.strip()
        if not value:
            raise ValueError("Group name cannot be empty")
        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value):
        if value is not None:
            value = value.strip()
            return value or None
        return value


class GroupUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value):
        if value is not None:
            value = value.strip()
            if not value:
                raise ValueError("Group name cannot be empty")
        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value):
        if value is not None:
            value = value.strip()
            return value or None
        return value


class GroupResponse(BaseModel):
    id: int
    name: str
    description: str | None

    model_config = ConfigDict(from_attributes=True)


class MemberCreate(BaseModel):
    user_id: int = Field(gt=0)


class PermissionCreate(BaseModel):
    permission: str = Field(min_length=1, max_length=100)


# =========================
# HELPER
# =========================

def get_group_or_404(group_id: int, db: Session):
    group = db.query(Group).filter(Group.id == group_id).first()

    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found",
        )

    return group


# =========================
# GROUP CRUD
# =========================

@router.post(
    "",
    response_model=GroupResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_group(
    data: GroupCreate,
    db: Session = Depends(get_db),
):
    existing = (
        db.query(Group)
        .filter(func.lower(Group.name) == data.name.lower())
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A group with this name already exists",
        )

    group = Group(
        name=data.name,
        description=data.description,
    )

    db.add(group)
    db.commit()
    db.refresh(group)

    return group


@router.get("", response_model=list[GroupResponse])
def list_groups(db: Session = Depends(get_db)):
    return db.query(Group).order_by(Group.id.desc()).all()


@router.get("/{group_id}", response_model=GroupResponse)
def get_group(
    group_id: int,
    db: Session = Depends(get_db),
):
    return get_group_or_404(group_id, db)


@router.patch("/{group_id}", response_model=GroupResponse)
def update_group(
    group_id: int,
    data: GroupUpdate,
    db: Session = Depends(get_db),
):
    group = get_group_or_404(group_id, db)
    updates = data.model_dump(exclude_unset=True)

    if "name" in updates and updates["name"] is not None:
        existing = (
            db.query(Group)
            .filter(
                func.lower(Group.name) == updates["name"].lower(),
                Group.id != group_id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A group with this name already exists",
            )

    for key, value in updates.items():
        setattr(group, key, value)

    db.commit()
    db.refresh(group)

    return group


@router.delete(
    "/{group_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_group(
    group_id: int,
    db: Session = Depends(get_db),
):
    group = get_group_or_404(group_id, db)

    db.delete(group)
    db.commit()


# =========================
# GROUP MEMBER AND PERMISSION LISTS
# =========================

@router.get("/{group_id}/members")
def list_group_members(
    group_id: int,
    db: Session = Depends(get_db),
):
    group = get_group_or_404(group_id, db)

    memberships = (
        db.query(GroupMembership)
        .filter(GroupMembership.group_id == group.id)
        .all()
    )

    return [
        {
            "id": membership.user.id,
            "name": membership.user.name,
            "email": membership.user.email,
        }
        for membership in memberships
    ]


@router.get("/{group_id}/permissions")
def list_group_permissions(
    group_id: int,
    db: Session = Depends(get_db),
):
    group = get_group_or_404(group_id, db)

    permissions = (
        db.query(GroupPermission.permission)
        .filter(GroupPermission.group_id == group.id)
        .order_by(GroupPermission.permission)
        .all()
    )

    return [item[0] for item in permissions]

# =========================
# GROUP MEMBERSHIP
# =========================

@router.post(
    "/{group_id}/members",
    status_code=status.HTTP_201_CREATED,
)
def add_group_member(
    group_id: int,
    data: MemberCreate,
    db: Session = Depends(get_db),
):
    group = get_group_or_404(group_id, db)

    user = db.query(User).filter(User.id == data.user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.role != "user":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only students can be added to groups",
        )

    existing = (
        db.query(GroupMembership)
        .filter(
            GroupMembership.group_id == group.id,
            GroupMembership.user_id == user.id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student is already a member of this group",
        )

    membership = GroupMembership(
        group_id=group.id,
        user_id=user.id,
    )

    db.add(membership)
    db.commit()

    return {"message": "Student added to group successfully"}


@router.delete(
    "/{group_id}/members/{user_id}",
)
def remove_group_member(
    group_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    group = get_group_or_404(group_id, db)

    membership = (
        db.query(GroupMembership)
        .filter(
            GroupMembership.group_id == group.id,
            GroupMembership.user_id == user_id,
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group membership not found",
        )

    db.delete(membership)
    db.commit()

    return {"message": "Student removed from group successfully"}


# =========================
# GROUP PERMISSIONS
# =========================

@router.post(
    "/{group_id}/permissions",
    status_code=status.HTTP_201_CREATED,
)
def assign_group_permission(
    group_id: int,
    data: PermissionCreate,
    db: Session = Depends(get_db),
):
    group = get_group_or_404(group_id, db)

    permission = data.permission.strip()


    if not re.fullmatch(
        r"[a-z][a-z0-9_-]*(?:[:.][a-z][a-z0-9_-]*)*",
        permission,
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid permission format",
        )

    existing = (
        db.query(GroupPermission)
        .filter(
            GroupPermission.group_id == group.id,
            GroupPermission.permission == permission,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Permission is already assigned to this group",
        )

    db.add(
        GroupPermission(
            group_id=group.id,
            permission=permission,
        )
    )

    db.commit()

    return {"message": "Permission assigned successfully"}


@router.delete(
    "/{group_id}/permissions/{permission}",
)
def revoke_group_permission(
    group_id: int,
    permission: str,
    db: Session = Depends(get_db),
):
    group = get_group_or_404(group_id, db)

    existing = (
        db.query(GroupPermission)
        .filter(
            GroupPermission.group_id == group.id,
            GroupPermission.permission == permission,
        )
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group permission not found",
        )

    db.delete(existing)
    db.commit()

    return {"message": "Permission revoked successfully"}


# =========================
# STUDENT GROUP ACCESS
# =========================



student_router = APIRouter(
    prefix="/api/groups",
    tags=["Student Groups"],
    dependencies=[Depends(require_student)],
)


@student_router.get("/me")
def get_my_groups(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    memberships = (
        db.query(GroupMembership)
        .filter(GroupMembership.user_id == current_user.id)
        .all()
    )

    result = []

    for membership in memberships:
        group = membership.group

        result.append({
            "id": group.id,
            "name": group.name,
            "description": group.description,
            "permissions": [
                item.permission for item in group.permissions
            ],
        })

    return result


@student_router.get("/me/permissions")
def get_my_permissions(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    permissions = (
        db.query(GroupPermission.permission)
        .join(
            GroupMembership,
            GroupPermission.group_id == GroupMembership.group_id,
        )
        .filter(GroupMembership.user_id == current_user.id)
        .distinct()
        .all()
    )

    return {
        "permissions": sorted(item[0] for item in permissions)
    }


# =========================
# PERMISSION-PROTECTED RESOURCES
# =========================

@student_router.get(
    "/resources",
    dependencies=[
        Depends(require_permission("group:resources:read"))
    ],
)
def get_accessible_group_resources(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    accessible_groups = (
        db.query(Group)
        .join(
            GroupMembership,
            Group.id == GroupMembership.group_id,
        )
        .join(
            GroupPermission,
            Group.id == GroupPermission.group_id,
        )
        .filter(
            GroupMembership.user_id == current_user.id,
            GroupPermission.permission == "group:resources:read",
        )
        .all()
    )

    return {
        "resources": [
            {
                "group_id": group.id,
                "group_name": group.name,
            }
            for group in accessible_groups
        ]
    }
