
from security import (
    hash_password,
    password_hash,
    verify_password,
    verify_password_and_update,
)


def test_new_pepper_password_verification():
    password = "StrongPassword123!"
    hashed = hash_password(password)

    assert verify_password(password, hashed) is True


def test_wrong_password_is_rejected():
    hashed = hash_password("StrongPassword123!")

    assert verify_password("WrongPassword123!", hashed) is False


def test_legacy_password_is_verified():
    password = "LegacyPassword123!"
    old_hash = password_hash.hash(password)

    valid, upgraded_hash = verify_password_and_update(
        password,
        old_hash,
    )

    assert valid is True
    assert upgraded_hash is not None


def test_new_password_hash_does_not_need_upgrade():
    password = "NewPassword123!"
    new_hash = hash_password(password)

    valid, upgraded_hash = verify_password_and_update(
        password,
        new_hash,
    )

    assert valid is True
    assert upgraded_hash is None
